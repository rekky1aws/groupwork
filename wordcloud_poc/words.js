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
	let words = [];
	const apiUrl = "https://127.0.0.1:8000";

	const response = await fetch(apiUrl + '/api/articles/');
	if(response.ok) {
		const responseJSON = await response.json();
		const articles = responseJSON["hydra:member"]
		articles.forEach(async function (element) {
			const catResponse = await fetch(apiUrl + element.category);
			const catJSON = await catResponse.json();
			if (words[catJSON.name]) {
				words[catJSON.name] ++;
			} else {
				words[catJSON.name] = 1;
			}
			// console.log(catJSON.name);
		});
		return words;
	}
}