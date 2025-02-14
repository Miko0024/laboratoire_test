
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fonction utilitaire pour lire/écrire les fichiers JSON
function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(path.join(__dirname, filename));
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeJSONFile(filename, data) {
    fs.writeFileSync(
        path.join(__dirname, filename),
        JSON.stringify(data, null, 2)
    );
}

// Route principale
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route pour l'inscription
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const users = readJSONFile('users.json');

    if (users.find(u => u.email === email)) {
        return res.json({
            success: false,
            message: "Un utilisateur avec cet email existe déjà!"
        });
    }
    if ((email.includes('@') && email.includes('.')) && (password.length>=8)){
        users.push({ email, password });
        writeJSONFile('users.json', users);

        res.json({
            success: true,
            message: "Succes! Inscription réussie!"
        });
    }else{
        res.json({
            success: false,
            message: "Erreur! Le courriel ou le mot de passe n'est pas valide"
        })
    }
});

// Route pour la connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readJSONFile('users.json');

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({
            success: true,
            message: "Correct! Connexion réussie!"
        });
    } else {
        res.json({
            success: false,
            message: "Erreur! Email ou mot de passe incorrect!"
        });
    }
});

// Route pour ajouter une tâche
app.post('/api/tasks', (req, res) => {
    const userEmail = req.headers['x-user-email'];
    const { title, description } = req.body;
    
    if (!userEmail || !title) {
        return res.status(400).json({
            success: false,
            message: "Erreur! Données manquantes"
        });
    }

    const tasks = readJSONFile('tasks.json');
    const newTask = {
        id: Date.now().toString(),
        userEmail,
        title,
        description: description || '',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeJSONFile('tasks.json', tasks);

    res.json({
        success: true,
        task: newTask
    });
});

// Route pour récupérer toutes les tâches
app.get('/api/tasks/all', (req, res) => {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
        return res.status(401).json({
            success: false,
            message: "Erreur! Non autorisé"
        });
    }

    const tasks = readJSONFile('tasks.json');
    res.json(tasks);
});

// Route pour récupérer les tâches de l'utilisateur
app.get('/api/tasks', (req, res) => {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
        return res.status(401).json({
            success: false,
            message: "Erreur! Non autorisé"
        });
    }

    const tasks = readJSONFile('tasks.json');
    const userTasks = tasks.filter(task => task.userEmail === userEmail);

    res.json(userTasks);
});

// Route pour supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
        return res.status(401).json({
            success: false,
            message: "Erreur! Non autorisé"
        });
    }

    const tasks = readJSONFile('tasks.json');
    const taskIndex = tasks.findIndex(
        task => task.id === taskId && task.userEmail === userEmail
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Erreur! Tâche non trouvée"
        });
    }

    tasks.splice(taskIndex, 1);
    writeJSONFile('tasks.json', tasks);

    res.json({
        success: true,
        message: "Correct! Tâche supprimée avec succès"
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});