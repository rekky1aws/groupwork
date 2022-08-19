let nameField = document.getElementById('name');
let tagList = document.getElementById('tags-select');
let categoryName = [];

async function getTags() {
    nameField.value = '';
    const jsonResponse = await fetch("https://localhost:8000/api/tags");
    const response = await jsonResponse.json();
    response['hydra:member'].forEach(response => {
      
      let selectCategory = document.createElement('option');
      selectCategory.innerHTML = `${response.id} : ${response.name}`;
      selectCategory.name = response.name;
      selectCategory.value = response.id;
      tagList.appendChild(selectCategory);
      categoryName.push(response.name);
    });
  }

getTags();

function categoryNamefuction(){
    if (tagList.value != 'nouveau tag') {
        nameField.value = categoryName[parseInt(tagList.value) - 1];
    } else {
        nameField.value = '';
    }
}

tagList.addEventListener('change',categoryNamefuction);

async function updateTag(){
    let APIURL = null;
    let HTTPMethod = null;
    if (tagList.value === 'nouveau tag') {
        APIURL = 'https://localhost:8000/api/tags';
        HTTPMethod = 'POST';
    } else {
        APIURL = 'https://localhost:8000/api/tags/' + (tagList.value);
        console.log(APIURL);
        HTTPMethod = 'PUT';
    }
    const JsonResponse = await fetch(APIURL, {
        method: HTTPMethod,
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            name: nameField.value
        });
    });

    if (JsonResponse.status == 200) {
        infoMessage.newMessage("Tag modifié", 'ok');
    } else if (JsonResponse.status == 201) {
        infoMessage.newMessage("Tag créé", 'ok');
    } else {
        infoMessage.newMessage('Une erreur est survenue', 'error');
    }
}

document.getElementById('update').addEventListener('click',updateTag);
