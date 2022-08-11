const apiUrl = "https://localhost:8000"
const articlesList = document.querySelector('#articles-list');
const infoMessage = document.querySelector('#info-message');

let hideInfosTO;

async function loadAuthors () {
	const response = await fetch(apiUrl + "/api/articles");
	const responseJSON = await response.json();
	articles = responseJSON['hydra:member'];
	articlesList.innerHTML = null;

	articles.forEach(async (element) => {
		let articleDiv = document.createElement('div');
		articleDiv.className = "article";

		let articleInfos = document.createElement('div');
		articleInfos.target = "_blank";
		articleInfos.className = "article-infos";

		let articleId = document.createElement('div');
		articleId.className = "article-id"
		articleId.textContent = element.id;

		let articleTitle = document.createElement('a');
		articleTitle.href = "/articles?id=" + element.id;
		articleTitle.className = "article-title cliquable";
		articleTitle.textContent = element.title;

		let articleDate = document.createElement('div');
		articleDate.className = "article-date";
		articleDate.textContent = element.published_at ? element.published_at.replace("T", " à ").split("+")[0] : "Non publié";

		let articleCategory = document.createElement('div');
		articleCategory.className = "article-category";
		const catResp = await fetch(apiUrl + element.category);
		const catJSON = await catResp.json();
		articleCategory.textContent = catJSON.name.replace(/^\w/, (c) => c.toUpperCase());;

		let articleTags = document.createElement('div');
		articleTags.className = "article-tags-container";
		element.tags.forEach(async (tag) => {
			const tagResp = await fetch(apiUrl + tag);
			const tagJSON = await tagResp.json();

			let aTag = document.createElement('div');
			aTag.className = "article-tag";
			aTag.textContent = tagJSON.name;
			articleTags.append(aTag);
		});

		let articleMenu = document.createElement('div');
		articleMenu.className = "article-menu";

		let editButton = document.createElement('button');
		editButton.className = "edit-button article-button cliquable";
		editButton.textContent = "📝";

		let deleteButton = document.createElement('button');
		deleteButton.className = "delete-button article-button cliquable";
		deleteButton.textContent = "🗑";
		deleteButton.addEventListener('click', deleteArticle)

		articleMenu.append(editButton, deleteButton);
		articleInfos.append(articleId, articleTitle, articleDate, articleCategory, articleTags);
		articleDiv.append(articleInfos, articleMenu);
		articlesList.append(articleDiv);
	});

}

async function deleteArticle (event)
{
	const articleId = event.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent;

	const confirmed = confirm("Êtes vous sur de vouloir supprimer cet article ?");
	if(confirmed)
	{
		const response = await fetch(apiUrl + "/api/articles/" + articleId, {
			method: 'DELETE'
		});

		// const responseJSON = await response.json();

		if(response.status === 204) {
			infoMessage.textContent = `L'article n° ${articleId} a été supprimé`;
			infoMessage.style.display = 'block';
			infoMessage.style.borderColor = "seagreen";
			infoMessage.style.color = "seagreen";
			let articleToRemove = event.target.parentNode.parentNode;
			articleToRemove.parentNode.removeChild(articleToRemove);

		} else {
			infoMessage.textContent = `Une erreur est survenue lors de la suppression de l'article n° ${articleId}`;
			infoMessage.style.display = 'block';
			infoMessage.style.borderColor = "tomato";
			infoMessage.style.color = "tomato";
			console.error(responseJSON['hydra:description']);
		}

	} else {
		infoMessage.textContent = `La suppression de l'article n° ${articleId} a été annulée`;
		infoMessage.style.display = 'block';
		infoMessage.style.borderColor = "royalblue";
		infoMessage.style.color = "royalblue";
	}

	clearInterval(hideInfosTO);
	hideInfosTO = setTimeout(hideInfos, 5000);
}

function hideInfos () 
{
	infoMessage.textContent = null;
	infoMessage.style.display = "none";
}

loadAuthors();