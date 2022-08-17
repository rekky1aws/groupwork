const validateButton = document.querySelector('.validate-button');
const userMailInput = document.querySelector('#mail');
const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#confirm-password');

validateButton.addEventListener('click', validateUser);

async function validateUser () 
{
	// Si l'utilisateur a saisi un mail
	if (userMailInput.value) {
		// Si l'utilisateur a entré un mot de passe
		if (passwordInput.value) {
			// On verifie que le mot de passe et le mot de passe de confirmation sont les memes.
			if (passwordConfirmInput.value === passwordInput.value) {
				/*
				Créer l'utilisateur ici.
				*/
			// Si les mots de passes ne correspondent pas, on ne créée pas l'utilisateur et on le lui notifie.
			} else {
				infoMessage.newMessage('Les mots de passes doivent correspondre.', 'error');
				passwordConfirmInput.value = null;
				passwordInput.value = null;
				return false;
			}
		// Si l'utilisateur n'a pas entré de mot de passe, on ne créée pas l'utilisateur et on le lui notifie.
		} else {
			infoMessage.newMessage('Impossible de créer un utilisateur sans mot de passe.', 'error');
			return false;
		}
	// Si l'utilisateur n'a pas saisi de mail, on ne créée pas l'utilisateur et on le lui notifie.
	} else {
		infoMessage.newMessage('Impossible de créer un utilisateur sans mail.', 'error');
	}
}