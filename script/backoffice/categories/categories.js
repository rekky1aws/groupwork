const nameField = document.querySelector('#name');
const categorieList = document.querySelector('#category-select');
const infoMessage = document.querySelector('#info-message');
const updateButton =document.querySelector("#update");

let categoryName = [];

async function getCategories() {
    nameField.value = '';
    const jsonResponse = await (fetch("https://127.0.0.1:8000/api/categories"));
    const response = await jsonResponse.json();
    response['hydra:member'].forEach(response => {

      let selectCategory = document.createElement('option');
      selectCategory.innerHTML = `${response.id} : ${response.name}`;
      selectCategory.name = response.name;
      selectCategory.value = response.id;
      categorieList.appendChild(selectCategory);
      categoryName.push(response.name);
  });
}


function categoryNamefuction()
{
    if (categorieList.value != 'Nouvelle Catégorie') {
        nameField.value = categoryName[parseInt(categorieList.value) - 1];
        updateButton.textContent = "UPDATE";
    } else {
       nameField.value = null;
       updateButton.textContent = "CREATE";
    }
}

async function updateCategorie()
{
    let APIURL;
    let HTTPMethod;

    if (nameField.value) {
        if (categorieList.value === 'Nouvelle Catégorie') {
            APIURL = 'https://127.0.0.1:8000/api/categories';
            HTTPMethod = 'POST';
        } else {
            APIURL = 'https://127.0.0.1:8000/api/categories/'+ (categorieList.value);
            HTTPMethod = 'PUT';
        }

        const jsonResponse = await fetch(APIURL, {
            method: HTTPMethod,
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name: nameField.value
            })
        });

        if (jsonResponse.status == 200 ) {
            infoMessage.innerHTML = "Categorie modifiée.";
            infoMessage.style.display = "block";
        } else if (jsonResponse.status == 201 ) {
            infoMessage.innerHTML = "Categorie créé.";
            infoMessage.style.display = "block";
        } else {
            infoMessage.innerHTML = "Une erreur est survenue.";
            infoMessage.style.display = "block";
            infoMessage.style.borderColor = 'tomato';
            infoMessage.style.color = 'tomato';
        }
    } else {
        infoMessage.innerHTML = "Impossible de créer un catégorie sans nom";
        infoMessage.style.display = "block";
        infoMessage.style.borderColor = 'tomato';
        infoMessage.style.color = 'tomato';
    }
}

getCategories();

categorieList.addEventListener('change',categoryNamefuction);
updateButton.addEventListener('click',updateCategorie);
