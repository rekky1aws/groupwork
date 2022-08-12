// Configuration variables
let APIURL = "https://127.0.0.1:8000/api";
let articlesAPIURL = APIURL + "/articles/";
let tagsAPIURL = APIURL + "/tags/";
let categoryAPIURL = APIURL + "/categories/";

// future DOM interactions
let articleSelect = document.querySelector("#articles");
let articleNameInput = document.querySelector("#articleName");
let articleBodyInput = document.querySelector("#articleBody");
let sectionTags = document.querySelector("#tagsSection");
let sectionCategory = document.querySelector("#categorySection");

let arrayTag = [];
let arrayCategory = [];
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

  arrayTag = response.tags.map((e) => e.split("/")).map((e) => e[3]);
  console.log(arrayTag);

  arrayCategory = response.category.split("/");
  arrayCategory = arrayCategory[3];

  articleNameInput.value = response.title;
  articleBodyInput.value = response.body;

  await getTags();
  await getCategories();

  for (let i = 1; i <= arrayTag.length; i++) {
    document.getElementById(`tags${i}`).selectedIndex = arrayTag[i - 1] - 1;
    console.log(i);
  }
  document.getElementById("category").selectedIndex = arrayCategory[0] - 1;
}
getArticles();

// appel d'api poour récuperer les tags
async function getTags() {
  const responseJSON = await fetch(tagsAPIURL);
  const response = await responseJSON.json();
  // creàtion d'une boucle pour que chaque select contienne les tags
  for (let i = 1; i <= arrayTag.length; i++) {
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

articleSelect.addEventListener("change", getArticleData);

