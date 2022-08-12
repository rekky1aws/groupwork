let nameField=document.getElementById('name')
let tagList = document.getElementById('tags-select')
let categoryName = []
let infoMessage=document.getElementById('info')



async function getTags() {
    nameField.value=''
    const JsonResponse = await (fetch("https://127.0.0.1:8000/api/tags"))
    const response = await JsonResponse.json()
    response['hydra:member'].forEach(response => {
      
      let selectCategory = document.createElement('option')
      selectCategory.innerHTML = `${response.id}:${response.name}`
      selectCategory.name=response.name
      selectCategory.value = response.id
      tagList.appendChild(selectCategory)
      categoryName.push(response.name)
    })
  }

getTags()
console.log(categoryName)

 function categoryNamefuction(){
     console.log(tagList.value)
   if(tagList.value!='nouveau tag'){
    nameField.value=categoryName[parseInt(tagList.value)-1]
 }else{
     nameField.value=''
 }
}
       
  

tagList.addEventListener('change',categoryNamefuction)

async function updateTag(){
    let APIURL=null
    let HTTPMethod=null
    if(tagList.value==='nouveau tag'){
        APIURL='https://127.0.0.1:8000/api/tags'
        HTTPMethod='POST'
    }else{
        APIURL='https://127.0.0.1:8000/api/tags/'+ (tagList.value)
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
        infoMessage.innerHTML= "tag modifié" 
    }else if(JsonResponse.status==201 ){
        infoMessage.innerHTML= "tag créé" 
    }
    else{
        infoMessage.innerHTML= 'une erreur est survenue'
    }
}

document.getElementById('update').addEventListener('click',updateTag)

