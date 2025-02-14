# laboratoire_test
Laboratoire de cour de suite de tests

Gestion d'Utilisateurs et de Tâches avec Tests et CI/CD
Contexte
Ce projet a pour but de développer une application en Node.js avec un accent particulier sur la mise en place des tests et de l’intégration continue (CI/CD). Il permet de gérer des utilisateurs et leurs tâches tout en validant des fonctionnalités à travers différents types de tests (unitaires, BDD, E2E) et un pipeline CI/CD automatisé. Ce projet fournit une structure simple mais robuste pour les applications backend et frontend, en utilisant des fichiers JSON pour simuler les données.

Fonctionnalités de l'Application
1. Authentification Utilisateur
Inscription : POST /register pour inscrire un utilisateur.
Connexion : POST /login pour se connecter avec un utilisateur existant.
2. Gestion des Tâches
Ajouter une tâche : POST /tasks pour ajouter une tâche à un utilisateur.
Consulter les tâches : GET /tasks pour obtenir la liste des tâches de l'utilisateur connecté.
Supprimer une tâche : DELETE /tasks/:id pour supprimer une tâche par son identifiant.
3. Données Simulées
Les utilisateurs et les tâches sont stockés dans des fichiers JSON (users.json et tasks.json), ce qui simplifie la gestion des données sans avoir besoin d’une base de données réelle.

Structure Technique

1. Backend
Routes API créées avec Express.js.
Données stockées dans des fichiers JSON pour les utilisateurs et les tâches.
Middleware pour validation et authentification des requêtes.

2. Frontend
Une simple page HTML pour le formulaire de connexion et d'ajout de tâches.
Le js du client
Un petit css basique

3. Tests
Tests Unitaires avec Jest pour valider des fonctionnalités critiques (validation des emails, ajout et suppression de tâches).
Tests BDD avec Cucumber pour tester des comportements via des scénarios de Gherkin.
Tests E2E avec Playwright pour simuler l'interaction utilisateur sur la page HTML.

4. CI/CD
GitHub Actions avec deux workflows pour automatiser les tests :
ci-tests.yml : Tests unitaires et BDD (sur la branche main).
e2e-tests.yml : Tests E2E (sur la branche e2e-tests).

Installation et Exécution

Prérequis
Node.js (version 14 ou supérieure)
npm pour gérer les dépendances

Étapes d'installation

Clonez ce repository :
bash
Copier
git clone https://github.com/Miko0024/laboratoire_test
cd laboratoire_test

Installez les dépendances :
bash
Copier
npm install
Lancez l'application 

bash
Copier
npm start
Cela démarre le serveur sur http://localhost:3001.

Exécution des Tests Locaux
1. Tests Unitaires avec Jest
Pour exécuter les tests unitaires, utilisez la commande suivante :

bash
Copier
npm run test:jest
Cette commande exécutera tous les tests unitaires avec Jest.

2. Tests BDD avec Cucumber
Pour exécuter les tests Cucumber :

bash
Copier
npm run test:cucumber
Cela lancera les tests en fonction des scénarios définis dans le fichier labo.feature.

3. Tests E2E avec Playwright
Pour exécuter les tests E2E avec Playwright, utilisez la commande suivante :

bash
Copier
npm run test:e2e
Cela ouvrira Playwright et exécutera les tests sur l'interface HTML de l'application.

Pipeline CI/CD avec GitHub Actions
1. Tests Unitaires et BDD
Les tests unitaires et BDD sont automatisés via GitHub Actions pour la branche main. Les fichiers de workflow sont dans .github/workflows/ci-tests.yml. Ce pipeline sera exécuté lors des pushs ou pull requests sur la branche principale.

Workflow ci-tests.yml :
Exécute les tests unitaires avec Jest.
Exécute les tests BDD avec Cucumber.
2. Tests E2E
Les tests E2E sont exécutés dans un autre workflow dédié à la branche e2e-tests avec le fichier .github/workflows/e2e-tests.yml.

Workflow e2e-tests.yml :
Exécute les tests E2E avec Playwright.
Processus CI/CD
Tests sur la branche principale (main) :
Lors de chaque push ou pull request, les tests unitaires et BDD seront exécutés.
Tests E2E sur la branche e2e-tests :
Lors des modifications liées aux tests E2E, les tests Playwright seront lancés pour valider le comportement de l'application de manière intégrée.


Conclusion
Ce projet offre une base solide pour une application de gestion d'utilisateurs et de tâches avec une attention particulière sur les tests et l'automatisation des flux CI/CD. Grâce à Jest, Cucumber, Playwright et GitHub Actions, on peut facilement garantir que l'application fonctionne correctement à chaque étape du développement.
