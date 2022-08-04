console.log("wordcloud.js")

console.log(words);

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

const maxWeight =  getHighestWeight(words);

Object.keys(words).forEach((element) => {
	let a = document.createElement('a');
	a.textContent = element;
	a.href = "/categories?name=" + element;
	a.style.fontSize = words[element] + 'em';
	a.style.opacity = 0.5 + 0.5 * (words[element] / maxWeight);
	container.appendChild(a);
});