// minimal value of tags
let tagId = 2
// array for insert tags
let tagsArray = []
// array for save in LocalStorage actuals tags
let tagsStorage=[]
// shortcuts:
// for the checkbox'save'
const dateIsSaving= document.getElementById('save')
// for button 'ajouter un tag'
const buttonTag = document.getElementById('newTag')
// for input 'titre de l'article'
const titleValue = document.getElementById('title')
// for input 'Contenue de l'article'
const bodyValue = document.getElementById('body')
// for select 'Categorie de l'article'
const categoryValue = document.getElementById('category-select')
// for select 'Auteur de l'article'
const writerValue = document.getElementById('writer-select')
// for select date
const dateValue = document.getElementById('dateSelect')

// function for store actual data
function storeData() {
  // set an object of actual value
  let data = {
    
    'title': titleValue.value,
    'body': bodyValue.value,
    'category': categoryValue.selectedIndex,
    'tags':tagsStorage,
    'writer': writerValue.value,
    'date': dateValue.value
  }
  // store data 
  localStorage.setItem('data', JSON.stringify(data));
}

// function for restore data
async function getData() {
// get to localstorage dataObject
  const storagedata = JSON.parse(localStorage.getItem('data'))
// restore data input
  titleValue.value = storagedata.title
  bodyValue.value = storagedata.body
  categoryValue.selectedIndex = storagedata.category
  writerValue.value = storagedata.writer
  dateValue.value = storagedata.date
  // loop for each select 'tags de l'article'
  for(let i=1;i<=storagedata.tags.length;i++){
// for additional tags
    if(i>2){
      // increase tag value
      tagId++
      // create à select for additional tags
      let NewTag = document.createElement('select')
      // shortcut for the section of tag
      let tagsSection = document.getElementById('tagsSection')
      // add id to select querrie
      NewTag.id = `tags${tagId}`
      // insert select in section of tag
      tagsSection.appendChild(NewTag)
      // call API for get options
       await getTags()
      //  restore local data for additionnal tags
       document.getElementById(`tags${i}`).selectedIndex=storagedata.tags[(i-1)];
      
    }   
      // restore local data for 2 first tags
      document.getElementById(`tags${i}`).selectedIndex=storagedata.tags[(i-1)];
  }
}
// function for push tags in local storage
function addTags(){
  // reset array of tags
  tagsStorage=[]
  // for each select tags box 
  for (let i=1 ; i<=tagId;i++){
  // push select box value in tags array
tagsStorage.push(document.getElementById(`tags${i}`).selectedIndex)
  }
}
// event listener on change tagsSection for store actual tags data
document.getElementById('tagsSection').addEventListener('change',addTags)


// Call API for get tags data
async function getTags() {
  // call the tags array
  const JsonResponse = await (fetch("https://127.0.0.1:8000/api/tags"))
  const response = await JsonResponse.json()
  // loop for add tags name in each select
  for (let i = 1; i <= tagId; i++) {
    console.log(i)
    response['hydra:member'].forEach(response => {
      // shortcut for select box
      let tagsList = document.getElementById(`tags${i}`)
      // create an option select for each tag
      let selectTag = document.createElement('option')
      selectTag.innerHTML = `${response.id}:${response.name}`
      selectTag.value = response.id
      // insert each option in select box
      tagsList.appendChild(selectTag)

    })
  }
}

//function for Call API for get categories data
async function getCategories() {
  // call the catégories array
  const JsonResponse = await (fetch("https://127.0.0.1:8000/api/categories"))
  const response = await JsonResponse.json()
  response['hydra:member'].forEach(response => {
    // shortcut for select box of categories
    let categorieList = document.getElementById('category-select')
    // create option select for each categories
    let selectCategory = document.createElement('option')
    selectCategory.innerHTML = `${response.id}:${response.name}`
    selectCategory.value = response.id
       // insert each option in select box
    categorieList.appendChild(selectCategory)
  })
}
// function for call API for get writer
async function getWriters() {
  // call users array
  const JsonResponseUser = await (fetch("https://127.0.0.1:8000/api/users"))
  const responseUser = await JsonResponseUser.json()
  // call writer array
  const JsonResponseWriter = await (fetch("https://127.0.0.1:8000/api/writers"))
  const responseWriter = await JsonResponseWriter.json()
  // pick in users array user with "ROLE_WRITER"
  responseUser['hydra:member'].forEach(responseUser => {
    if (responseUser.roles.includes("ROLE_WRITER")) {
  // pick writer id
      responseWriter['hydra:member'].forEach(response => {
        if (response.user == `/api/users/${responseUser.id}`) {
          // shortcut for select box
          let writerList = document.getElementById('writer-select')
          // create an option select for each writer
          let selectWriter = document.createElement('option')
          // add in option select writerId and userEmail
          selectWriter.innerHTML = `${response.id}:${responseUser.email}`
          selectWriter.value = response.id
                 // insert each option in select box
          writerList.appendChild(selectWriter)
      }
    })
  }
  })
}

// function create a select box for additional tag
function newTag() {
  // shortcut for error div
  let errorSection = document.getElementById('errorSection');
  // pick first select box value
  let value1 = document.getElementById('tags1').value
    // pick second select box value
  let value2 = document.getElementById('tags2').value
  errorSection.innerHTML = ''

  // check select boxes values
  if (value1 == value2) {
    // reset array of tag 
    tagsArray = []
    // error message
    errorSection.innerHTML = 'Erreur :Vous devez séléctionner des tags differents'
    // insert error message
    errorSection.appendChild(errorMessage)
  } else {
    // reset error message
    document.getElementById('errorSection').innerHTML = ''
    // increase tag value
    tagId++
    // create new select box
    let NewTag = document.createElement('select')
    // shortcut for section of tag
    let tagsSection = document.getElementById('tagsSection')
    NewTag.id = `tags${tagId}`
    tagsSection.appendChild(NewTag)
    // call Api and create option select tags
    getTags()
  }
}
// on click 'ajouter un tag' create new select box + API
buttonTag.addEventListener("click", newTag)

// fuction for post form values with API
async function createArticle(event) {
  // reset tags Array for security
  tagsArray = []
  // for each select box push select box value in tagsArray
  for (let i = 1; i <= tagId; i++) {
    tagsArray.push("/api/tags/" + document.getElementById(`tags${i}`).value)
  }
// set object of form actual values
  var requestBody = {
    "title": titleValue.value,
    "body": bodyValue.value,
    "tags": tagsArray,
    "category": "/api/categories/" + categoryValue.value,
    "writer": "/api/writers/" + writerValue.value,
    "publishedAt": dateValue.value,
  };
  // if box not checked set object without date
if(dateIsSaving.checked==false){
  requestBody={
    "title": titleValue.value,
    "body": bodyValue.value,
    "tags": tagsArray,
    "category": "/api/categories/" + categoryValue.value,
    "writer": "/api/writers/" + writerValue.value,
  }
}
// call api
  const JSONResponse = await fetch("https://127.0.0.1:8000/api/articles", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  const response = await JSONResponse.json()
  // shortcut for result div
  var resultDiv = document.getElementById("resultMessage");
  // clear result div
  resultDiv.innerHTML = ''
  // check if error
  if (response["@type"] == "hydra:Error" || response["@type"] == "ConstraintViolationList") {
    resultDiv.innerHTML = "Une erreur est survenue" + ' ' + response["hydra:description"];
  } else {
    console.log(response)
    // message confirmation
    resultDiv.innerHTML = "Article créée";
    // reset form value
    titleValue.value = ''
    bodyValue.value = ''
    dateValue.value = ''
    // reset localStorage
    localStorage.clear()
    // reload page for reset tags section
   location.reload()
  }
  document.body.appendChild(resultDiv);

}
// event listener for "creer cet article" button
document.getElementById('create').addEventListener('click', createArticle)
// load all api's call in one function
async function loader() {
  const categories = await getCategories();
  const tags = await getTags();
  const writers = await getWriters();
  const storeInterval = setInterval(storeData, 1000);
  const data = await getData();
 
}
// load all data and api call
loader();