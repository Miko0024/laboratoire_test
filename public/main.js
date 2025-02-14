
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const authSection = document.getElementById('auth-section');
    const tasksSection = document.getElementById('tasks-section');
    const authForm = document.getElementById('auth-form');
    const taskForm = document.getElementById('task-form');
    const taskFormContainer = document.getElementById('task-form-container');
    const tasksList = document.getElementById('tasks-list');
    const authMessage = document.getElementById('auth-message');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const allTasksBtn = document.getElementById('all-tasks-btn');
    const myTasksBtn = document.getElementById('my-tasks-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const cancelTaskBtn = document.getElementById('cancel-task-btn');
    const logoutBtn = document.getElementById('logout-btn');

    let currentView = 'my-tasks';

    // Gestionnaire pour le bouton d'ajout de tâche
    addTaskBtn.addEventListener('click', function() {
        taskFormContainer.style.display = 'block';
        addTaskBtn.disabled = true;
    });

    // Gestionnaire pour le bouton d'annulation
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', function() {
            taskFormContainer.style.display = 'none';
            addTaskBtn.disabled = false;
            taskForm.reset();
        });
    }

    // Vérification de l'état de connexion
    function checkAuthState() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            authSection.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            tasksSection.classList.remove('hidden');
            loadTasks('my-tasks'); // Charge les tâches de l'utilisateur par défaut
            return true;
        } else {
            authSection.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            tasksSection.classList.add('hidden');
            return false;
        }
    }

    // Gestion des boutons de filtrage
    if (allTasksBtn) {
        allTasksBtn.addEventListener('click', function() {
            currentView = 'all-tasks';
            loadTasks('all-tasks');
            allTasksBtn.classList.add('active');
            myTasksBtn.classList.remove('active');
        });
    }

    if (myTasksBtn) {
        myTasksBtn.addEventListener('click', function() {
            currentView = 'my-tasks';
            loadTasks('my-tasks');
            myTasksBtn.classList.add('active');
            allTasksBtn.classList.remove('active');
        });
    }

    // Chargement initial
    checkAuthState();

    // Prévenir la soumission par défaut du formulaire
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
    });

    // Gestion de la connexion
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, password: userPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('loggedInUser', userEmail);
                authMessage.textContent = data.message;
                authMessage.className = 'success';
                checkAuthState();
            } else {
                authMessage.textContent = data.message;
                authMessage.className = 'error';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            authMessage.textContent = "Erreur de connexion au serveur";
            authMessage.className = 'error';
        });
    });

    // Gestion de l'inscription
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, password: userPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('loggedInUser', userEmail);
                authMessage.textContent = data.message;
                authMessage.className = 'success';
                checkAuthState();
            } else {
                authMessage.textContent = data.message;
                authMessage.className = 'error';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            authMessage.textContent = "Erreur de connexion au serveur";
            authMessage.className = 'error';
        });
    });

    // Modification du gestionnaire de soumission du formulaire de tâche
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskTitle = document.getElementById('task-title').value;
            const taskDescription = document.getElementById('task-description').value;
            
            fetch('/api/tasks', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': localStorage.getItem('loggedInUser')
                },
                body: JSON.stringify({ 
                    title: taskTitle,
                    description: taskDescription
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    taskForm.reset();
                    taskFormContainer.style.display = 'none';
                    addTaskBtn.disabled = false;
                    loadTasks(currentView);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        });
    }

    // Chargement des tâches
    function loadTasks(viewType) {
        const userEmail = localStorage.getItem('loggedInUser');
        if (!userEmail) return;

        const endpoint = viewType === 'all-tasks' ? '/api/tasks/all' : '/api/tasks';

        fetch(endpoint, {
            headers: {
                'X-User-Email': userEmail
            }
        })
        .then(response => response.json())
        .then(tasks => {
            if (tasksList) {
                tasksList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    
                    const titleDiv = document.createElement('div');
                    titleDiv.className = 'task-title';
                    titleDiv.textContent = task.title;
                    
                    const descDiv = document.createElement('div');
                    descDiv.className = 'task-description';
                    descDiv.textContent = task.description || '(Pas de description)';
                    
                    const userDiv = document.createElement('div');
                    userDiv.className = 'task-user';
                    userDiv.textContent = `Créé par: ${task.userEmail}`;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Supprimer';
                    // N'affiche le bouton supprimer que pour les tâches de l'utilisateur
                    if (task.userEmail === userEmail) {
                        deleteBtn.onclick = () => deleteTask(task.id);
                    } else {
                        deleteBtn.style.display = 'none';
                    }
                    
                    li.appendChild(titleDiv);
                    li.appendChild(descDiv);
                    li.appendChild(userDiv);
                    li.appendChild(deleteBtn);
                    tasksList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    // Suppression d'une tâche
    function deleteTask(taskId) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'X-User-Email': localStorage.getItem('loggedInUser')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadTasks();
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    // Déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            checkAuthState();
        });
    }

    function validateForm() {
        const errorElement = document.querySelector('.error-message'); 
        if (!isValid) {
          errorElement.style.display = 'block';
          errorElement.textContent = 'Message d\'erreur approprié';
        }
      }
});