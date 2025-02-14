
const { validateSubscription, validateAddingTask, validateDeletingTask } = require('../../labo');

test('Refuser l\'inscription si le courriel et le mot de passe sont vides', () => {
    expect(validateSubscription('')).toBe('Erreur');
});

test('Refuser l\'inscription si le courriel est vide', () => {
    expect(validateSubscription("''", "labo1234")).toBe('Erreur');
});

test('Refuser l\'inscription si le courriel ne respecte pas le format standard', () => {
    expect(validateSubscription('labotestgmail.com', 'labo1234')).toBe('Erreur');
})

test('Refuser l\'inscription si le mot de passe est vide', () =>{
    expect(validateSubscription("labotest@gmail.com", "''")).toBe('Erreur');
})

test('Refuser l\'inscription si le format du mot de passe n\'est pas correct', ()=>{
    expect(validateSubscription('labotest@gmail.com', '1234')).toBe('Erreur')
})

test('Accepter l\'inscription si le courriel et le mot de passe sont corrects', () => {
    expect(validateSubscription('labotest@gmail.com', 'labo1234')).toBe('Correct');
});
test('Refuser l\'ajout d\'une tache dont le titre est vide', () => {
    expect(validateAddingTask('')).toBe('Erreur');
});

test('Accepter l\'ajout d\'une tache dont le titre n\'est pas vide', () => {
    expect(validateAddingTask('Rediger le labo')).toBe('Correct');
})

test('Refuser la suppression d\'une tache dont on n\'est pas le createur', () =>{
    expect(validateDeletingTask('toto@test.com', 'labotest@gmail.com')).toBe('Erreur');
})

test('Accepter la suppression d\'une tache par son createur', ()=>{
    expect(validateDeletingTask('labotest@gmail.com', 'labotest@gmail.com')).toBe('Correct')
})
