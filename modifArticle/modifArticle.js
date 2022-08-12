// Configuration variables
const APIURL = "https://127.0.0.1:8000/api";
const articlesAPIURL = APIURL + "/articles/";
const tagsAPIURL = APIURL + "/tags/";
const categoryAPIURL = APIURL + "/categories/";
const usersAPIURL = APIURL + "/users/";
const writersAPIURL = APIURL + "/writers/";

// future DOM interactions
const articleSelect = document.querySelector("#articles");
const articleNameInput = document.querySelector("#articleName");
const articleBodyInput = document.querySelector("#articleBody");
const sectionTags = document.querySelector("#tagsSection");
const buttonTag = document.querySelector("#newTag");
const sectionCategory = document.querySelector("#categorySection");
const writerSelect = document.querySelector("#writer-select");
const dateValue = document.querySelector("#dateSelect");
const dateIsSaving = document.querySelector("#save");
const btnUpdate = document.querySelector("#btnUpdate");

let arrayTag = [];
let arrayCategory = [];
let tagsCount = 0;
async function getArticles() {
  const responseJSON = await fetch(articlesAPIURL);
  const response = await responseJSON.json();
  response["hydra:member"].forEach((response) => {
    let articleList = document.getElementById("articles");
    let selectArticle = document.createElement("option");
    selectArticle.innerHTML = response.title;
    selectArticle.value = response.id;
    articleList.appendChild(selectArticle);
  });
  console.log(response["hydra:member"]);
}

async function getArticleData() {
  sectionTags.innerHTML = null;
  sectionCategory.innerHTML = null;
  const id = articleSelect.selectedIndex + 1;
  const responseJSON = await fetch(articlesAPIURL + id);
  const response = await responseJSON.json();
  console.log(response.publishedAt);
  arrayTag = response.tags.map((e) => e.split("/")).map((e) => e[3]);
  console.log(arrayTag);

  arrayCategory = response.category.split("/");
  arrayCategory = arrayCategory[3];

  articleNameInput.value = response.title;
  articleBodyInput.value = response.body;
  dateValue.selectedIndex = response.publishedAt;
  console.log(dateValue.selectedIndex);

  await getTags();
  await getCategories();
  await getWriters();

  for (let i = 1; i <= arrayTag.length; i++) {
    document.getElementById(`tags${i}`).selectedIndex = arrayTag[i - 1] - 1;
    console.log(i);
  }
  document.getElementById("category").selectedIndex = arrayCategory[0] - 1;
}
getArticles();

// appel d'api poour récuperer les tags
async function getTags() {
  tagsCount = 0;
  const responseJSON = await fetch(tagsAPIURL);
  const response = await responseJSON.json();
  // creàtion d'une boucle pour que chaque select contienne les tags
  for (let i = 1; i <= arrayTag.length; i++) {
    tagsCount++;
    console.log(i);
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

buttonTag.addEventListener("click", newTag);

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

function updateArticle() {
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
  })
    .then(function (response) {
      return response.json();
    })
    .then((responseJSON) => {
      console.log(responseJSON);
    })
    .catch((err) => console.log(err));
}

btnUpdate.addEventListener("click", updateArticle);
articleSelect.addEventListener("change", getArticleData);
