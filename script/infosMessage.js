class InfoMessages {
	constructor() {
		this.typeStyles = {
			"base": {
				"border" : "1px solid black",
				"color": "black"
			},
			"error": {
				"border" : "1px solid tomato",
				"color": "tomato"
			},
		}
	}

	get generateContainer () {
		let container = document.querySelector('#infos-messages-container');

		// If container doesn't exists, create it.
		if (!container) {
			container = document.createElement('section');
			document.body.appendChild(container);
		}

		this.container = container;

		container.id = "infos-messages-container";

		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.alignItems = 'flex-end';
		container.style.justifyContent = 'flex-end'
		container.style.gap = "10px";
		container.style.position = "fixed";
		container.style.margin = "15px";
		container.style.right = "15px";
		container.style.bottom = '15px';
	}

	newMessage(message, type = "base") {
		let messageDiv = document.createElement('div');
		messageDiv.class = "info-message";

		// Displaying message
		messageDiv.textContent = message;

		// Applying style if it exists, else apply 'base' 
		if (this.typeStyles[type]) {
			Object.keys(this.typeStyles[type]).forEach((element) => {
				messageDiv.style[element] = this.typeStyles[type][element];
			})
		} else {
			messageDiv.style = this.typeStyles.base;
		}

		// On attribue le style commun
		messageDiv.backgroundColor = "white";
		messageDiv.style.padding = "15px";
		messageDiv.style.borderRadius = "25px";
		messageDiv.style.extAlign = "center";

		this.container.append(messageDiv);
		let removeTimeOut = setTimeout(this.removeOldestMessage, 5000, this);

	}

	removeOldestMessage (section) {
		section.container.childNodes[0].remove();
	}
}

let infoMessageClass = new InfoMessages();

infoMessageClass.generateContainer;
infoMessageClass.newMessage('Coucou', 'error');