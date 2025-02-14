
function validateSubscription(email, password){
    let message;
    if ((email.includes('@')) && (email.includes('.'))) {
        if ((password.length) >= 8){
            message ="Correct"
        }else{
            message ="Erreur"
        }
    }else{
        message ="Erreur"
    }
    return message
}

function validateAddingTask(title){
    let retour;
    if((title.length) < 3){
        retour="Erreur"
    }else{
        retour="Correct"
    }
    return retour
}

function validateDeletingTask(taskEmail, userEmail){
    let rapport;
    if(taskEmail===userEmail){
        rapport="Correct"
    }else{
        rapport="Erreur"
    }
    return rapport
}

module.exports = {validateSubscription, validateAddingTask, validateDeletingTask}