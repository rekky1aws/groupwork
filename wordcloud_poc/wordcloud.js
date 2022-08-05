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

function getFrequencies (words)
{
	let wordFrequencies = [];
	words.forEach( (word) => {
		wordFrequencies[word.name] = word.articles.length
	});
	return wordFrequencies;
}

function displayWordCloud (wordFrequencies) {
	//const wordsKeys = Object.keys(wordFrequencies);
	//console.log(wordsKeys);

	// On récupère la catégorie qui apparait le plus souvent.
	const maxWeight =  getHighestWeight(wordFrequencies);

	// Ensuite pour chaque categories, on l'affiche dans le nuage de mot, plus il y a d'articles qui y sont liés, plus elle apparait grande et vive.
	// A l'inverse, si moins d'artcile sont liés à une catégorie, le nom de celle-ci apparait en plus petit et d'une couleur moins saturée.
	Object.keys(wordFrequencies).forEach((element) => {
		// On crée la balise <a></a> qui correspond.
		let a = document.createElement('a');

		// On y ajoute le nom, on obtient donc <a>Nom</a>
		a.textContent = element;

		// On ajoute le lien, on a donc <a href="/categories?name=Nom">Nom</a>
		a.href = "/categories?name=" + element;

		// On change la taille et l'opacité en fonction du nombre d'articles.
		a.style.fontSize = 1 + (wordFrequencies[element] / maxWeight) * 2 + 'em';
		a.style.opacity = 0.5 + 0.5 * (wordFrequencies[element] / maxWeight);
		
		// On ajoute la balise à celle contenant le nuage de mots
		container.appendChild(a);
	});
}

function displayWords (words)
{
	const wordFrequencies = getFrequencies(words);
	displayWordCloud(wordFrequencies);
}

const words = getCategories();

words.then(displayWords);