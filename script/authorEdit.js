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
function getUrlParams ()
{
	// On ne garde que la partie après "?".
	const urlParts = window.location.href.split("?");
	let paramObject = {};
	if (urlParts[1]) {
		// On sépare chaque paramètre de l'URL.
		const params = urlParts[1].split("&");
		// Pour chaque paramètre, on ajoute une couple clé valeur à l'objet que l'on va ensuite retourner.
		params.forEach(element => {
			paramObject[element.split('=')[0]] = element.split('=')[1]
		});
	}
	return paramObject;	
}

async function getUsers ()
{
	const response = await fetch(apiUrl + "/api/users/");
	const responseJSON = await response.json();
	const users = responseJSON['hydra:member'];

	users.forEach((element) => {
		let userOption = document.createElement('option');
		userOption.value = element.id;
		userOption.textContent = `${element.id} : ${element.email}`;
		userSelect.append(userOption);
	});

	

	// On récupère les informations sur le writer dont l'id est passé en paramètre dans l'URL.
	const authorResponse = await fetch(apiUrl + "/api/writers/" + urlParams.id);
	if (authorResponse.ok) {
		const authorJSON = await authorResponse.json();

		// On ne garde que l'id de l'utilisateur correspondant au writer.
		let userId = authorJSON.user.split('/');
		userId = parseInt(userId[userId.length - 1]);

		userSelect.selectedIndex = userId - 1;	
	} else {
		alert('Auteur inexistant');
		window.location.replace('/authors/');
	}
}

async function sendData ()
{
	const writerBase = await fetch(apiUrl + "/api/writers/" + urlParams.id);
	const writerBaseJSON = await writerBase.json();
	console.log(writerBaseJSON);

	let requestBody = {
		"articles": writerBaseJSON.articles,
		"pages": writerBaseJSON.pages,
		"user": "/api/users/" + toString(userSelect.selectedIndex + 1)
	}
	requestBody.user = "/api/users/" + (userSelect.selectedIndex + 1);
	console.log(requestBody);

	const response = await fetch(apiUrl + "/api/writers/" + urlParams.id, {
		method: 'PATCH',
		body: JSON.stringify(requestBody),
		headers: {
			'Content-Type': 'application/merge-patch+json',
		},
	});
	if(response.status === 200)
	{
		const responseJSON = await response.json();
		console.log(responseJSON);
	} else if (response.status === 500) {
		alert("Impossible d'associer l'auteur à cet utilisateur, celui-ci est déjà associé à un autre auteur");
	}
}


// On récupère les paramètres passés dans l'URL sous forme d'objet.
const urlParams = getUrlParams();
if (urlParams.id) {
	getUsers();
} else {
	alert('Vous devez avoir un auteur à éditer.');
	window.location.replace('/authors/');
}
