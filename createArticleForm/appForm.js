let tagId = 2
let tagsArray = []
let tagsStorage=[]
let dateIsSaving= document.getElementById('save')

const buttonTag = document.getElementById('newTag')
const titleValue = document.getElementById('title')
const bodyValue = document.getElementById('body')
const categoryValue = document.getElementById('category-select')
const writerValue = document.getElementById('writer-select')
const dateValue = document.getElementById('dateSelect')

function storeData() {
  
  let data = {
    
    'title': titleValue.value,
    'body': bodyValue.value,
    'category': categoryValue.selectedIndex,
    'tags':tagsStorage,
    'writer': writerValue.value,
    'date': dateValue.value
  }
  localStorage.setItem('data', JSON.stringify(data));
  console.log("storage done");

}


async function getData() {

  let storagedata = JSON.parse(localStorage.getItem('data'))
  console.log(storagedata.tags.length)
  console.log("storage data: ", storagedata);
  console.log("stored category: ", storagedata.category);
  titleValue.value = storagedata.title
  bodyValue.value = storagedata.body
  categoryValue.selectedIndex = storagedata.category
  writerValue.value = storagedata.writer
  dateValue.value = storagedata.date
  for(let i=1;i<=storagedata.tags.length;i++){

    if(i>2){
      tagId++
      let NewTag = document.createElement('select')
      let tagsSection = document.getElementById('tagsSection')
      NewTag.id = `tags${tagId}`
      tagsSection.appendChild(NewTag)
       await getTags()
       document.getElementById(`tags${i}`).selectedIndex=storagedata.tags[(i-1)];
      
    }    
      document.getElementById(`tags${i}`).selectedIndex=storagedata.tags[(i-1)];
  }
}

console.log(localStorage.getItem('data'))
// appel d'api poour récuperer les tags
async function getTags() {
  const JsonResponse = await (fetch("https://127.0.0.1:8000/api/tags"))
  const response = await JsonResponse.json()
  // creàtion d'une boucle pour que chaque select contienne les tags
  for (let i = 1; i <= tagId; i++) {
    console.log(i)
    response['hydra:member'].forEach(response => {
      let tagsList = document.getElementById(`tags${i}`)
      let selectTag = document.createElement('option')
      selectTag.innerHTML = `${response.id}:${response.name}`
      selectTag.value = response.id
      tagsList.appendChild(selectTag)

    })
  }
}

// appel d'api pour récuperer les catégorie et les injecter dans le select
async function getCategories() {
  const JsonResponse = await (fetch("https://127.0.0.1:8000/api/categories"))
  const response = await JsonResponse.json()
  response['hydra:member'].forEach(response => {
    let categorieList = document.getElementById('category-select')
    let selectCategory = document.createElement('option')
    selectCategory.innerHTML = `${response.id}:${response.name}`
    selectCategory.value = response.id
    categorieList.appendChild(selectCategory)
  })
}

async function getWriters() {
  const JsonResponseUser = await (fetch("https://127.0.0.1:8000/api/users"))
  const responseUser = await JsonResponseUser.json()
  const JsonResponseWriter = await (fetch("https://127.0.0.1:8000/api/writers"))
  const responseWriter = await JsonResponseWriter.json()
  responseUser['hydra:member'].forEach(responseUser => {
    if (responseUser.roles.includes("ROLE_WRITER")) {
      console.log(responseUser.id)
      responseWriter['hydra:member'].forEach(response => {
        console.log(response.user)
        if (response.user == `/api/users/${responseUser.id}`) {
          let writerList = document.getElementById('writer-select')
          let selectWriter = document.createElement('option')
          selectWriter.innerHTML = `${response.id}:${responseUser.email}`
          selectWriter.value = response.id
          writerList.appendChild(selectWriter)
        }
      })

    }
  })
}

// fuction pour créér un nouveau select et ajouter plus de deux tags
function newTag() {
  let errorSection = document.getElementById('errorSection');
  let value1 = document.getElementById('tags1').value
  let value2 = document.getElementById('tags2').value
  errorSection.innerHTML = ''

  // vérification des valeurs des deux premier id pour rappeler la regles des tags different
  if (value1 == value2) {
    tagsArray = []
    errorSection.innerHTML = 'Erreur :Vous devez séléctionner des tags differents'
    errorSection.appendChild(errorMessage)
  } else {
    // création d'un nouveau select avec les options
    document.getElementById('errorSection').innerHTML = ''
    tagId++
    let NewTag = document.createElement('select')
    let tagsSection = document.getElementById('tagsSection')
    NewTag.id = `tags${tagId}`
    tagsSection.appendChild(NewTag)
    getTags()
  }
}

buttonTag.addEventListener("click", newTag)

function addTags(){
  tagsStorage=[]
  for (let i=1 ; i<=tagId;i++){
tagsStorage.push(document.getElementById(`tags${i}`).selectedIndex)
  }
  console.log(tagsStorage)
}
document.getElementById('tagsSection').addEventListener('change',addTags)
const createArticle = async function(event) {
  tagsArray = []
  
  for (let i = 1; i <= tagId; i++) {
    tagsArray.push("/api/tags/" + document.getElementById(`tags${i}`).value)
  }
  console.log(tagsArray)
  var requestBody = {
    "title": titleValue.value,
    "body": bodyValue.value,
    "tags": tagsArray,
    "category": "/api/categories/" + categoryValue.value,
    "writer": "/api/writers/" + writerValue.value,
    "publishedAt": dateValue.value,
  };
if(dateIsSaving.checked==false){
  requestBody={
    "title": titleValue.value,
    "body": bodyValue.value,
    "tags": tagsArray,
    "category": "/api/categories/" + categoryValue.value,
    "writer": "/api/writers/" + writerValue.value,
  }
}
  const JSONResponse = await fetch("https://127.0.0.1:8000/api/articles", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  const response = await JSONResponse.json()


  var resultDiv = document.getElementById("resultMessage");
  resultDiv.innerHTML = ''
  if (response["@type"] == "hydra:Error" || response["@type"] == "ConstraintViolationList") {
    resultDiv.innerHTML = "Une erreur est survenue" + ' ' + response["hydra:description"];
  } else {
    console.log(response)
    resultDiv.innerHTML = "Article créée";
    titleValue.value = ''
    bodyValue.value = ''
    dateValue.value = ''
    localStorage.clear()
    setTimeout(location.reload(),5000) 
  }
  document.body.appendChild(resultDiv);

}

document.getElementById('create').addEventListener('click', createArticle)

async function loader() {
  const categories = await getCategories();
  const tags = await getTags();
  const writers = await getWriters();
  const storeInterval = setInterval(storeData, 1000);
  const data = await getData();
 
}

loader();