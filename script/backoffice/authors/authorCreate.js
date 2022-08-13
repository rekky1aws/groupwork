// Bouton de validation
	// CONSTANTES GLOBALES
// Adresse de base de l'API
const apiUrl = "https://localhost:8000";

// Select pour choisir les Users
const userSelect = document.querySelector('#user-selector');

// Bouton de validation
const validateButton = document.querySelector('.validate-button');

	// EVENT LISTENERS
validateButton.addEventListener('click', sendData);

	// FONCTIONS
// Fonction pour récupérer sous forme d'objet les paramètres passés dans l'URL.

async function getUsers ()
{
	// On récupère tous les utilisateurs depuis l'API.
	const response = await fetch(apiUrl + "/api/users/");
	const responseJSON = await response.json();
	const users = responseJSON['hydra:member'];

	// Pour chaque utilisateur on créé une option dans le select.
	users.forEach((element) => {
		let userOption = document.createElement('option');
		userOption.value = element.id;
		userOption.textContent = `${element.id} : ${element.email}`;
		userSelect.append(userOption);
	});
}

async function sendData ()
{	
	// On crée le body de notre requête pour modifier l'auteur, avec certaines données qui ne bougent pas.
	let requestBody = {
		"articles": [],
		"pages": [],
	}
	requestBody.user = "/api/users/" + (userSelect.selectedIndex + 1);

	// Requete pour modifier la bdd
	const response = await fetch(apiUrl + "/api/writers", {
		method: 'POST',
		body: JSON.stringify(requestBody),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if(response.status === 201)
	{
		infoMessage.newMessage("L'Auteur a été créé.", 'ok');
	} else if (response.status === 500) {
		infoMessage.newMessage("Impossible d'associer l'auteur à cet utilisateur, celui-ci est déjà associé à un autre auteur.", 'error');
	}
}

getUsers();