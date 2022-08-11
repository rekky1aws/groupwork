const apiUrl = "https://localhost:8000"
const authorsList = document.querySelector('#authors-list');
const infoMessage = document.querySelector('#info-message');

async function loadAuthors () {
	const response = await fetch(apiUrl + "/api/writers");
	const responseJSON = await response.json();


	writers = responseJSON['hydra:member'];
	console.log(writers);

	writers.forEach(async (element) => {
		const writerResponse = await fetch(apiUrl + element['@id']);
		const writerJSON = await writerResponse.json();

		const userResponse = await fetch(apiUrl + writerJSON.user);
		const userJSON = await userResponse.json();

		let authorDiv = document.createElement('div');
		authorDiv.className = "author";

		let authorInfos = document.createElement('div');
		authorInfos.className = "author-infos";

		let authorId = document.createElement('div');
		authorId.className = "author-id";
		authorId.textContent = element.id;

		let authorMail = document.createElement('div');
		authorMail.className = "author-mail";
		authorMail.textContent = userJSON.email;

		let authorMenu = document.createElement('div');
		authorMenu.className = "author-menu";

		let deleteButton = document.createElement('button');
		deleteButton.className = "cliquable author-button author-delete";
		deleteButton.textContent = "🗑";
		deleteButton.addEventListener('click', deleteAuthor)

		let editButton = document.createElement('button');
		editButton.className = "cliquable author-button author-edit";
		editButton.textContent = "📝";
		editButton.addEventListener('click', function () {
			window.location.href = "/authors/edit?id=" + element.id;
		})

		authorInfos.append(authorId, authorMail);
		authorMenu.append(editButton, deleteButton)
		authorDiv.append(authorInfos, authorMenu);
		authorsList.append(authorDiv);

	});
}

async function deleteAuthor (event)
{
	const authorId = event.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent;

	const confirmed = confirm("Êtes vous sur de vouloir supprimer cet auteur ?");
	if(confirmed)
	{
		const response = await fetch(apiUrl + "/api/writers/" + authorId, {
			method: 'DELETE'
		});

		const responseJSON = await response.json();

		if(response.status === 204) {
			infoMessage.textContent = `L'Auteur n° ${authorId} a été supprimé`;
			infoMessage.style.display = 'block';
			infoMessage.style.borderColor = "seagreen";
			infoMessage.style.color = "seagreen";

		} else {
			infoMessage.textContent = `Une erreur est survenue lors de la suppression de l'Auteur n° ${authorId}`;
			infoMessage.style.display = 'block';
			infoMessage.style.borderColor = "tomato";
			infoMessage.style.color = "tomato";
			console.error(responseJSON['hydra:description']);
		}

	} else {
		infoMessage.textContent = `La suppression de l'Auteur n° ${authorId} a été annulée`;
		infoMessage.style.display = 'block';
		infoMessage.style.borderColor = "royalblue";
		infoMessage.style.color = "royalblue";
	}
}

loadAuthors();