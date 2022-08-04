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
	const words = await getWords();
	console.log(words);
	const wordsKeys = await Object.keys(words)
	console.log(wordsKeys);

	const maxWeight =  getHighestWeight(words);


	Object.keys(words).forEach((element) => {
		let a = document.createElement('a');
		a.textContent = element;
		a.href = "/categories?name=" + element;
		a.style.fontSize = words[element] + 'em';
		a.style.opacity = 0.5 + 0.5 * (words[element] / maxWeight);
		console.log(a);	
		container.appendChild(a);
	});

}

displayWordCloud();