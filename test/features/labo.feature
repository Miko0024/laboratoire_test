Feature: Validation de l'inscription, de l'ajout et de la suppression de tache

  Scenario: Inscription refusee si le courriel et le mot de passe sont vides
    Given un courriel ""
    And un mot de passe ""
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Veuillez remplir les champs courriel et mot de passe pour vous connecter"

  Scenario: Inscription refusee si le courriel est vide meme si le mot de passe est correct
    Given un courriel ""
    And un mot de passe "labo1234"
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Veuillez entrer votre courriel"

  Scenario: Inscription refusee si le courriel ne respecte pas le format standard
    Given un courriel "labotest.com"
    And un mot de passe "labo1234"
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Veuillez un courriel valide"

  Scenario: Inscription refusee si le mot de passe est vide
    Given un courriel "labotest@gmail.com"
    And un mot de passe ""
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Veuillez entrer votre mot de passe"

  Scenario: Inscription refusee si le mot de passe ne respecte pas le standard
    Given un courriel "labotest@gmail.com"
    And un mot de passe "1234"
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Veuillez entrer un mot de passe valide"

  Scenario: Inscription acceptee si le courriel et le mot de passe sont corrects
    Given un courriel "labotest@gmail.com"
    And un mot de passe "labo1234"
    When un nouvel utilisateur s'inscrit
    Then le resultat doit etre "Inscription acceptee"

  Scenario: Ajout de tache refuse si le titre de la tache est vide
    Given Le titre de la tache ""
    When un utilisateur ajoute une nouvelle tache
    Then le resultat doit etre "Veuillez entrer le titre de la tache"

  Scenario: Ajout de tache acceptee si le titre n'est pas vide
    Given Le titre de la tache "Rediger le labo"
    When un utilisateur ajoute une nouvelle tache
    Then le resultat doit etre "Tache ajoutee avec succes"

  Scenario: Suppression de tache dont l'utilisateur n'est pas le createur
    Given Le courriel relie a la tache "toto@test.com"
    And Le courriel de l'utilisateur connecte "labotest@gmail.com"
    When un utilisateur supprime une tache
    Then le resultat doit etre "Vous ne pouvez pas supprimer une tache que vous n'avez pas creee"

  Scenario: Suppression de tache dont l'utilisateur est le createur
    Given Le courriel relie a la tache "labotest@gmail.com"
    And Le courriel de l'utilisateur connecte "labotest@gmail.com"
    When un utilisateur supprime une tache
    Then le resultat doit etre "Tache supprimee avec succes"