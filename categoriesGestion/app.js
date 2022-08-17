let nameField=document.getElementById('name')
let categorieList = document.getElementById('category-select')
let categoryName = []
let infoMessage=document.getElementById('info')



async function getCategories() {
    nameField.value=''
    const JsonResponse = await (fetch("https://127.0.0.1:8000/api/categories"))
    const response = await JsonResponse.json()
    response['hydra:member'].forEach(response => {
      
      let selectCategory = document.createElement('option')
      selectCategory.innerHTML = `${response.id}:${response.name}`
      selectCategory.name=response.name
      selectCategory.value = response.id
      categorieList.appendChild(selectCategory)
      categoryName.push(response.name)
    })
  }

getCategories()


 function categoryNamefuction(){
     console.log(categorieList.value)
   if(categorieList.value!='nouvelle categorie'){
    nameField.value=categoryName[parseInt(categorieList.value)-1]
 }else{
     nameField.value=''
 }
}
       
  

categorieList.addEventListener('change',categoryNamefuction)

async function updateCategorie(){
    let APIURL=null
    let HTTPMethod=null
    if(categorieList.value==='nouvelle categorie'){
        APIURL='https://127.0.0.1:8000/api/categories'
        HTTPMethod='POST'
    }else{
        APIURL='https://127.0.0.1:8000/api/categories/'+ (categorieList.value)
        HTTPMethod='PUT'
    }
    const JsonResponse = await fetch(APIURL,{
        method: HTTPMethod,
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            name: nameField.value
        })});
    if(JsonResponse.status==200 ){
        infoMessage.innerHTML= "categorie modifié" 
    }else if(JsonResponse.status==201 ){
        infoMessage.innerHTML= "categorie créé" 
    }
    else{
        infoMessage.innerHTML= 'une erreur est survenue'
    }
}

document.getElementById('update').addEventListener('click',updateCategorie)

