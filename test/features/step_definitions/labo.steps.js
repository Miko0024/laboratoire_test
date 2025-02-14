
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Variables globales
let email = '';
let password = '';
let title = '';
let resultat = '';
let emailTask = '';
let emailUser = '';

// Steps d'inscription
Given('un courriel {string}', function(contenuEmail) {
    email = contenuEmail;
    return true;
});

Given('un mot de passe {string}', function(contenuPass) {
    password = contenuPass;
    return true;
});

When('un nouvel utilisateur s\'inscrit', function() {
    if (email === '' && password === '') {
        resultat = 'Veuillez remplir les champs courriel et mot de passe pour vous connecter';
    } else if (email === '') {
        resultat = 'Veuillez entrer votre courriel';
    } else if (!email.includes('@') || !email.includes('.')) {
        resultat = 'Veuillez un courriel valide';
    } else if (password === '') {
        resultat = 'Veuillez entrer votre mot de passe';
    } else if (password.length < 8) {
        resultat = 'Veuillez entrer un mot de passe valide';
    } else {
        resultat = 'Inscription acceptee';
    }
    return true;
});

Then('le resultat doit etre {string}', function(messageAttendu) {
    assert.strictEqual(resultat, messageAttendu);
    return true;
});

// Steps des tâches
Given('Le titre de la tache {string}', function(contenuTitle) {
    title = contenuTitle;
    return true;
});

When('un utilisateur ajoute une nouvelle tache', function() {
    if (title === '') {
        resultat = 'Veuillez entrer le titre de la tache';
    } else {
        resultat = 'Tache ajoutee avec succes';
    }
    return true;
});

Given('Le courriel relie a la tache {string}', function(email) {
    emailTask = email;
    return true;
});

Given('Le courriel de l\'utilisateur connecte {string}', function(email) {
    emailUser = email;
    return true;
});

When('un utilisateur supprime une tache', function() {
    if (emailTask === emailUser) {
        resultat = 'Tache supprimee avec succes';
    } else {
        resultat = 'Vous ne pouvez pas supprimer une tache que vous n\'avez pas creee';
    }
    return true;
});