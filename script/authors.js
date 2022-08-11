const apiUrl = "https://localhost:8000"
const authorsList = document.querySelector('#authors-list');

async function loadAuthors () {
	const response = await fetch(apiUrl + "/api/writers");
	const responseJSON = await response.json();

	writers = responseJSON['hydra:member'];

	writers.forEach(async (element) => {
		const writerResponse = await fetch(apiUrl + element['@id']);
		const writerJSON = await writerResponse.json();

		const userResponse = await fetch(apiUrl + writerJSON.user);
		const userJSON = await userResponse.json();

		let authorDiv = document.createElement('div');
		authorDiv.className = "author";

		let authorMail = document.createElement('div');
		authorMail.className = "author-mail";
		authorMail.textContent = userJSON.email;

		let authorMenu = document.createElement('div');
		authorMenu.className = "author-menu";

		let deleteButton = document.createElement('button');
		deleteButton.className = "cliquable author-button author-delete";
		deleteButton.textContent = "🗑";

		let editButton = document.createElement('button');
		editButton.className = "cliquable author-button author-edit";
		editButton.textContent = "📝";
		editButton.addEventListener('click', function () {
			window.location.href = "/authors/edit?id=" + element.id;
		})

		authorMenu.append(editButton, deleteButton)
		authorDiv.append(authorMail, authorMenu);
		authorsList.append(authorDiv);

	});
}

loadAuthors();