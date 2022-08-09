let tagId=2
let tagsArray=[]
const buttonTag = document.getElementById('newTag')
const titleValue=document.getElementById('title')
const bodyValue=document.getElementById('body')
const categoryValue=document.getElementById('category-select')
const writerValue=document.getElementById('writer-select')
const dateValue=document.getElementById('dateSelect')

// appel d'api poour récuperer les tags
async function GetTags(){
    const JsonResponse= await(fetch("https://127.0.0.1:8000/api/tags"))
    const response= await JsonResponse.json()
// creàtion d'une boucle pour que chaque select contienne les tags
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

// appel d'api pour récuperer les catégorie et les injecter dans le select
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

async function getWriters(){
    const JsonResponseUser= await(fetch("https://127.0.0.1:8000/api/users"))
    const responseUser= await JsonResponseUser.json()
    const JsonResponseWriter= await(fetch("https://127.0.0.1:8000/api/writers"))
    const responseWriter= await JsonResponseWriter.json()
    responseUser['hydra:member'].forEach(responseUser=>{
        if(responseUser.roles.includes("ROLE_WRITER")){
            console.log(responseUser.id)
            responseWriter['hydra:member'].forEach(response=>{
                console.log(response.user)
                if(response.user==`/api/users/${responseUser.id}`){
                    let writerList=document.getElementById('writer-select')
                    let selectWriter=document.createElement('option')
                    selectWriter.innerHTML=`${response.id}:${responseUser.email}`
                    selectWriter.value=response.id
                    writerList.appendChild(selectWriter)
                }
            })

        }
    })
}
getWriters()
// fuction pour créér un nouveau select et ajouter plus de deux tags
function newTag(){
    let errorSection=document.getElementById('errorSection');
    let value1=document.getElementById('tags1').value
    let value2=document.getElementById('tags2').value
        errorSection.innerHTML=''
    tagsArray.push(value1)
    tagsArray.push(value2)
    // vérification des valeurs des deux premier id pour rappeler la regles des tags different
    if(value1==value2){
        tagsArray=[]
        errorSection.innerHTML='Erreur :Vous devez séléctionner des tags differents'
        errorSection.appendChild(errorMessage)
    }else{
// création d'un nouveau select avec les options
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

const createArticle = async function(event) {
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
        "writer":"/api/writers/"+writerValue.value,
        "publishedAt":dateValue.value,
    };

    const JSONResponse=await fetch("https://127.0.0.1:8000/api/articles", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(requestBody)
    })
    const response= await JSONResponse.json()
    
    
        var resultDiv = document.getElementById("resultMessage");
        resultDiv.innerHTML=''
        if (response["@type"] == "hydra:Error"||response["@type"] == "ConstraintViolationList") {
            resultDiv.innerHTML = "Une erreur est survenue"+' '+ response["hydra:description"];
        }
        else {
            console.log(response)
            resultDiv.innerHTML = "Article créée";
        }
        document.body.appendChild(resultDiv);
    
}

document.getElementById('create').addEventListener('click',createArticle)

