// Configuration variables API
const APIURL = "https://127.0.0.1:8000/api";
const articlesAPIURL = APIURL + "/articles/";
const tagsAPIURL = APIURL + "/tags/";
const categoryAPIURL = APIURL + "/categories/";
const usersAPIURL = APIURL + "/users/";
const writersAPIURL = APIURL + "/writers/";

// future DOM interactions

// infoZone
const infoZoneDiv = document.querySelector("#infoZone");
// for select Articles
const articleSelect = document.querySelector("#articles");
// for input 'titre de l'article'
const articleNameInput = document.querySelector("#articleName");
// for input 'Contenue de l'article'
const articleBodyInput = document.querySelector("#articleBody");
// for select 'Tags de l'article'
const sectionTags = document.querySelector("#tagsSection");
// for button 'ajouter un tag'
const buttonTag = document.querySelector("#newTag");
// for select 'Categorie de l'article'
const sectionCategory = document.querySelector("#categorySection");
// for select 'Auteur de l'article'
const writerSelect = document.querySelector("#writer-select");
// for select date
const dateValue = document.querySelector("#dateSelect");
// for the checkbox'save'
const dateIsSaving = document.querySelector("#save");
// for button 'Modifier article'
const btnUpdate = document.querySelector("#btnUpdate");

// array for insert tags
let arrayTag = [];
// array for insert category
let arrayCategory = [];
// count for tags
let tagsCount = 0;

// Call API for get articles data
async function getArticles() {
  articleNameInput.value = "";
  articleBodyInput.value = "";

  const responseJSON = await fetch(articlesAPIURL, { method: "GET" });
  const response = await responseJSON.json();
  response["hydra:member"].forEach((response) => {
    let articleList = document.getElementById("articles");
    let selectArticle = document.createElement("option");
    selectArticle.innerHTML = response.title;
    selectArticle.value = response.id;
    articleList.appendChild(selectArticle);
  });
}
getArticles();

async function getArticleData() {
  sectionTags.innerHTML = null;
  sectionCategory.innerHTML = null;
  const id = articleSelect.selectedIndex + 1;
  const responseJSON = await fetch(articlesAPIURL + id);
  const response = await responseJSON.json();

  arrayTag = response.tags.map((e) => e.split("/")).map((e) => e[3]);
  buttonTag.classList.toggle("hidden");

  arrayCategory = response.category.split("/");
  arrayCategory = arrayCategory[3];

  articleNameInput.value = response.title;
  articleBodyInput.value = response.body;

  const today = new Date();
  dateValue.value = today.toISOString().substr(0, 10);
  console.log(dateValue.value);

  await getTags();
  await getCategories();
  await getWriters();

  for (let i = 1; i <= arrayTag.length; i++) {
    document.getElementById(`tags${i}`).selectedIndex = arrayTag[i - 1] - 1;
  }
  document.getElementById("category").selectedIndex = arrayCategory[0] - 1;
}

// Call API for get tags data
async function getTags() {
  tagsCount = 0;
  const responseJSON = await fetch(tagsAPIURL);
  const response = await responseJSON.json();
  // creàtion d'une boucle pour que chaque select contienne les tags
  for (let i = 1; i <= arrayTag.length; i++) {
    tagsCount++;
    let tagsList = document.createElement("select");
    tagsList.id = `tags${i}`;
    response["hydra:member"].forEach((response) => {
      let selectTag = document.createElement("option");
      selectTag.innerHTML = `${response.name}`;
      selectTag.value = response.id;
      sectionTags.appendChild(tagsList);
      tagsList.appendChild(selectTag);
    });
  }
}

// function create a select box for additional tag
async function newTag() {
  const responseJSON = await fetch(tagsAPIURL);
  const response = await responseJSON.json();
  // create new select box
  tagsCount++;
  let newTag = document.createElement("select");
  // shortcut for section of tag
  newTag.id = `tags${tagsCount}`;
  sectionTags.appendChild(newTag);

  // call Api and create option select tags
  response["hydra:member"].forEach((response) => {
    let selectTag = document.createElement("option");
    selectTag.innerHTML = response.name;
    selectTag.value = response.id;
    newTag.appendChild(selectTag);
  });
}
// on click 'ajouter un tag' create new select box + API
buttonTag.addEventListener("click", newTag);

// Call API for get tags data
async function getCategories() {
  const responseJSON = await fetch(categoryAPIURL);
  const response = await responseJSON.json();

  let categorieList = document.createElement("select");
  categorieList.id = "category";

  response["hydra:member"].forEach((response) => {
    let selectCategory = document.createElement("option");
    selectCategory.innerHTML = `${response.name}`;
    selectCategory.value = response.id;
    sectionCategory.appendChild(categorieList);
    categorieList.appendChild(selectCategory);
  });
}

// function for call API for get writer
async function getWriters() {
  // call users array
  const JsonResponseUser = await fetch(usersAPIURL);
  const responseUser = await JsonResponseUser.json();
  // call writer array
  const JsonResponseWriter = await fetch(writersAPIURL);
  const responseWriter = await JsonResponseWriter.json();
  // pick in users array user with "ROLE_WRITER"
  responseUser["hydra:member"].forEach((responseUser) => {
    if (responseUser.roles.includes("ROLE_WRITER")) {
      // pick writer id
      responseWriter["hydra:member"].forEach((response) => {
        if (response.user == `/api/users/${responseUser.id}`) {
          // shortcut for select box
          let writerList = document.getElementById("writer-select");
          // create an option select for each writer
          let selectWriter = document.createElement("option");
          // add in option select writerId and userEmail
          selectWriter.innerHTML = `${responseUser.email}`;
          selectWriter.value = response.id;
          // insert each option in select box
          writerList.appendChild(selectWriter);
        }
      });
    }
  });
}
// fuction for PUT form values with API
function updateArticle() {
  if (articleNameInput.value == "") {
    return;
  }
  // reset tags Array for security
  tagsArray = [];
  // for each select box push select box value in tagsArray
  for (let i = 1; i <= tagsCount; i++) {
    tagsArray.push("/api/tags/" + document.getElementById(`tags${i}`).value);
  }
  let category = document.getElementById("category").value;

  const headers = {
    "Content-Type": "application/json",
  };

  let requestBody = {
    title: articleNameInput.value,
    body: articleBodyInput.value,
    tags: tagsArray,
    category: "api/categories/" + category,
    writer: "api/writers/" + writerSelect.value,
    publishedAt: dateValue.value,
  };
  if (dateIsSaving.checked == false) {
    requestBody = {
      title: articleNameInput.value,
      body: articleBodyInput.value,
      tags: tagsArray,
      category: "api/categories/" + category,
      writer: "api/writers/" + writerSelect.value,
    };
  }
  fetch(articlesAPIURL + articleSelect.value, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(requestBody),
  }).then((response) => {
    getArticles();
    if (response.status === 200) {
      infoZoneDiv.textContent = "Modification de la catégorie effectuée";
    } else {
      infoZoneDiv.textContent =
        "⚠ Une erreur est survenue lors de la modification de la catégorie";
    }
  });
}
// event listener for "modifie cet article" button
btnUpdate.addEventListener("click", updateArticle);
articleSelect.addEventListener("change", getArticleData);
