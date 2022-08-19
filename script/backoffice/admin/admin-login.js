class User {
	constructor(name, password) {
		this.name = name;
		this.password = password;
	}
}

const usernameField = document.querySelector('#username');
const passwordField = document.querySelector('#password');
const logInButton = document.querySelector('#validate');

logInButton.addEventListener('click', connexion);

const allowedUsers = [
	new User("admin", "admin"),
	new User("root", ""),
	new User("dba", "123")
];

function connexion ()
{
	let isAllowed = false;
	allowedUsers.forEach( (user) => {
		if (user.name === usernameField.value) {
			if (user.password === passwordField.value) {
				isAllowed = true;
				return true;
			}
		}
	});

	if (isAllowed) {
		console.log('ok');
		window.location.replace("http://localhost:8080/interface_admin_super_secrete/interface.html");
	} else {
		usernameField.style.border = "1px solid red";
		passwordField.style.border = "1px solid red";
		passwordField.value = null;
		console.warn("Username or password isn't correct.");
	}
}