console.log("wordcloud.js")

const container = document.querySelector('.wordcloud');

function getHighestWeight (words) {
	let highest = 0;
	Object.keys(words).forEach((element) => {
		if (words[element] > highest) {
			highest = words[element];
		}
	});
	return highest;
}

async function displayWordCloud ()
{
	// On récupère les mots grace a la fonction prévue dans words.js.
	const words = await getWords();
	console.log(words);
	// On récupère toutes les clés de words, donc les noms des catégories
		// C'est ici que les choses ne se passent plus comme je prévoyais...
		// Question de temporalité, à mon humble avis, words n'a pas eu le temps d'avoir récupéré ses valeurs.
		// Object.keys retourne un tableau vide.
	const wordsKeys = Object.keys(words)
	console.log(wordsKeys);

	// On récupère la catégorie qui apparait le plus souvent.
	const maxWeight =  getHighestWeight(words);

	// Ensuite pour chaque categories, on l'affiche dans le nuage de mot, plus il y a d'articles qui y sont liés, plus elle apparait grande et vive.
	// A l'inverse, si moins d'artcile sont liés à une catégorie, le nom de celle-ci apparait en plus petit et d'une couleur moins saturée.
	Object.keys(words).forEach((element) => {
		// On crée la balise <a></a> qui correspond.
		let a = document.createElement('a');

		// On y ajoute le nom, on obtient donc <a>Nom</a>
		a.textContent = element;

		// On ajoute le lien, on a donc <a href="/categories?name=Nom">Nom</a>
		a.href = "/categories?name=" + element;

		// On change la taille et l'opacité en fonction du nombre d'articles.
		a.style.fontSize = words[element] + 'em';
		a.style.opacity = 0.5 + 0.5 * (words[element] / maxWeight);
		
		// On ajoute la balise à celle contenant le nuage de mots
		container.appendChild(a);
	});

}

displayWordCloud();