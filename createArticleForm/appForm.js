let tagId=2
let tagsArray=[]
const titleValue=document.getElementById('title')
const bodyValue=document.getElementById('body')
const categoryValue=document.getElementById('category-select')
const writerValue=document.getElementById('writer')
const dateValue=document.getElementById('dateSelect')
let curentDate=new Date()
console.log(curentDate)

async function GetTags(){
    const JsonResponse= await(fetch("https://127.0.0.1:8000/api/tags"))
    const response= await JsonResponse.json()
    for(let i=1; i<=tagId ; i++){
        console.log(i)
    response['hydra:member'].forEach(response=>{
        let tagsList=document.getElementById(`tags${i}`)
        let selectTag=document.createElement('option')
        selectTag.innerHTML=`${response.id}:${response.name}`
        selectTag.value=response.id
        tagsList.appendChild(selectTag)
})
}
}
GetTags()
async function GetCategories(){
    const JsonResponse= await(fetch("https://127.0.0.1:8000/api/categories"))
    const response= await JsonResponse.json()
    response['hydra:member'].forEach(response=>{
        let categorieList=document.getElementById('category-select')
        let selectCategory=document.createElement('option')
        selectCategory.innerHTML=`${response.id}:${response.name}`
        selectCategory.value=response.id
        categorieList.appendChild(selectCategory)
    })
}
GetCategories()


const buttonTag = document.getElementById('newTag')
function newTag(){
    let errorSection=document.getElementById('errorSection');
    let value1=document.getElementById('tags1').value
    let value2=document.getElementById('tags2').value
        errorSection.innerHTML=''
    tagsArray.push(value1)
    tagsArray.push(value2)
    if(value1==value2){
        tagsArray=[]
        errorSection.innerHTML='Erreur :Vous devez séléctionner des tags differents'
        errorSection.appendChild(errorMessage)
    }else{
        document.getElementById('errorSection').innerHTML=''
        tagId++
        let NewTag=document.createElement('select')
        let tagsSection=document.getElementById('tagsSection')
        NewTag.id=`tags${tagId}`
        tagsSection.appendChild(NewTag)
        GetTags()
        
        
    }
}

buttonTag.addEventListener("click",newTag)

const createArticle = function(event) {
    tagsArray=[]
    for(let i=1;i<=tagId;i++){
        tagsArray.push("/api/tags/"+document.getElementById(`tags${i}`).value)
    }
    console.log(tagsArray)
    var requestBody = {
        "title":titleValue.value,
        "body":bodyValue.value,
        "tags":tagsArray,
        "category": "/api/categories/"+categoryValue.value,
        "writer":"/api/writers/1",
        "publishedAt":dateValue.value,
    };
    console.log(typeof(categoryValue.value))
    fetch("https://127.0.0.1:8000/api/articles", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(requestBody)
    }).then(function (response) {
        return response.json()
    })
    .then(function (responseJSON) {
        var resultDiv = document.createElement("div");
        if (responseJSON["@type"] == "hydra:Error") {
            console.log("Une erreur est survenue : " + responseJSON["hydra:description"])
            resultDiv.innerHTML = "Une erreur est survenue";
        }
        else {
            console.log(responseJSON)
            resultDiv.innerHTML = "Article créée";
        }
        document.body.appendChild(resultDiv);
    })
}

document.getElementById('create').addEventListener('click',createArticle)

