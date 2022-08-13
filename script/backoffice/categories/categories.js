const nameField = document.querySelector('#name');
const categorieList = document.querySelector('#category-select');
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

        switch(jsonResponse.status) {
            case 200:
                infoMessage.newMessage('Catégorie modifiée.', 'ok');
                break;

            case 201:
                infoMessage.newMessage('Catégorie créée.', 'ok');
                break;

            default:
                infoMessage.newMessage('Une erreur est survenue lors de la création de la catégorie.', 'error');
                break;
        }
    } else {
        infoMessage.newMessage('Impossible de créer une catégorie sans nom', 'error');
    }
}

getCategories();

categorieList.addEventListener('change',categoryNamefuction);
updateButton.addEventListener('click',updateCategorie);
