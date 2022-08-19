const apiUrl = "https://localhost:8000"
const usersList = document.querySelector('#users-list');

async function loadUsers () {
	const response = await fetch(apiUrl + "/api/users");
	const responseJSON = await response.json();


	users = responseJSON['hydra:member'];
	console.log(users);

	users.forEach(async (element) => {

		let userDiv = document.createElement('div');
		userDiv.className = "user";

		let userInfos = document.createElement('div');
		userInfos.className = "user-infos";

		let userId = document.createElement('div');
		userId.className = "user-id";
		userId.textContent = element.id;

		let userMail = document.createElement('div');
		userMail.className = "user-mail";
		userMail.textContent = element.email;

		let userMenu = document.createElement('div');
		userMenu.className = "user-menu";

		let deleteButton = document.createElement('button');
		deleteButton.className = "cliquable user-button user-delete";
		deleteButton.textContent = "🗑";
		deleteButton.addEventListener('click', deleteUser)

		let editButton = document.createElement('button');
		editButton.className = "cliquable user-button user-edit";
		editButton.textContent = "📝";
		editButton.addEventListener('click', function () {
			window.location.href = "./edit?id=" + element.id;
		})

		userInfos.append(userId, userMail);
		userMenu.append(editButton, deleteButton)
		userDiv.append(userInfos, userMenu);
		usersList.append(userDiv);

	});
}

async function deleteUser (event)
{
	/*const authorId = event.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent;

	console.log(authorId);

	const confirmed = confirm("Êtes vous sur de vouloir supprimer cet auteur ?");
	if(confirmed)
	{
		const response = await fetch(apiUrl + "/api/writers/" + authorId, {
			method: 'DELETE'
		});

		const responseJSON = await response.json();

		console.log(responseJSON);

		if(response.status === 204) {
			infoMessage.newMessage(`L'Auteur n° ${authorId} a été supprimé`, 'ok');
		} else {
			infoMessage.newMessage(`Une erreur est survenue lors de la suppression de l'Auteur n° ${authorId}`, 'error');
		}

	} else {
		infoMessage.newMessage(`La suppression de l'Auteur n° ${authorId} a été annulée`, 'cancel');
	}*/
}

loadUsers();