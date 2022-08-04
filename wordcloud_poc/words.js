console.log("words.js");

/*
const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elith Donec sed viverra metus Cras felis augue semper at velit at finibus varius mauris Aliquam vulputate, nunc eget hendrerit elementum, libero ligula facilisis orci, ut bibendum diam turpis id lectus Nulla sodales molestie augue in hendrerit enim elementum in Cras ut euismod augue eget faucibus nisl Praesent id ligula eu sem pulvinar viverra Nunc at tempus tellus, laoreet molestie risus Fusce imperdiet faucibus orci, nec molestie felis venenatis nec Duis lectus justo, tincidunt a metus ac, consectetur feugiat odio Nulla sapien diam, pretium ac vulputate non porta porttitor justo Donec tincidunt vestibulum odio in mollis";
const splittedStr = str.toLowerCase().replace(/[.,]/g, '').split(" ");
let words = [];
splittedStr.forEach((element) => {
	if(words[element]) {
		words[element] ++;
	} else {
		words[element] = 1;
	}
});
*/

async function getWords ()
{
	// On initialise words.
	let words = [];

	const apiUrl = "https://127.0.0.1:8000";

	// On va chercher tous les articles.
	const response = await fetch(apiUrl + '/api/articles/');
	if(response.ok) {
		// On récupère le resultat de notre requête au format JSON.
		const responseJSON = await response.json();
		// On stocke les différents articles dans la variables correspondante.
		const articles = responseJSON["hydra:member"]

		// On itère pour chaque article afin de connaitre la fréquence d'une catégorie;
		articles.forEach(async function (element) {
			// On va donc chercher le nom de la catégorie qui correspond.
			const catResponse = await fetch(apiUrl + element.category);
			if (catResponse.ok)
			{
				// On récupère un objet JSON.
				const catJSON = await catResponse.json();
				// Si on a déjà une propriété (clé) de words qui correspond a la categorie, on incrémente sa fréquence (valeur).
				if (words[catJSON.name]) {
					words[catJSON.name] ++;

				// Sinon on la crée et on l'initialise à 1.
				} else {
					words[catJSON.name] = 1;
				}
				// console.log(catJSON.name);
			}
		});
		return words;
	}
}

// Une fois que l'on a récupéré la fréquence des catégories, c'est le fichier wordcloud.js qui va se charger de les afficher.