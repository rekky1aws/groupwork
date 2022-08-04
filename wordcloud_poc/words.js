console.log("words.js");

const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed viverra metus. Cras felis augue, semper at velit at, finibus varius mauris. Aliquam vulputate, nunc eget hendrerit elementum, libero ligula facilisis orci, ut bibendum diam turpis id lectus. Nulla sodales molestie augue, in hendrerit enim elementum in. Cras ut euismod augue, eget faucibus nisl. Praesent id ligula eu sem pulvinar viverra. Nunc at tempus tellus, laoreet molestie risus. Fusce imperdiet faucibus orci, nec molestie felis venenatis nec. Duis lectus justo, tincidunt a metus ac, consectetur feugiat odio. Nulla sapien diam, pretium ac vulputate non, porta porttitor justo. Donec tincidunt vestibulum odio in mollis.";
const splittedStr = str.replace('.', '').replace(',', '').toLowerCase().split(" ");
let words = [];
splittedStr.forEach((element) => {
	if(words[element]) {
		words[element] ++;
	} else {
		words[element] = 1;
	}
});
