const myJSON = "https://localhost:8000/api/articles";
const divArticles = document.querySelector("#articles");

fetch(myJSON)
  .then((response) => response.json())
  .then((articlesJSON) => {
    // fonction pour trier  un tableau d’objets avec la valeur de date par order croissant
    function sortArticles20() {
      let articleArr = JSON.parse(JSON.stringify(articlesJSON["hydra:member"]));

      console.log(articleArr);

      articleArr = articleArr.filter( function(x) {
        if (x.published_at) {
          return true;
        }
      }).sort(function (x, y) {

        if (x.published_at < y.published_at) return -1;
        if (x.published_at > y.published_at) return 1;
        return 0;
      });
      // boucle pour sortir 20 articles par page
      for (
        let i = 0;
        i < Math.min(articleArr.length, 20);
        i++
      ) {
        divArticles.innerHTML += `<div class="block  md:p-[22.3px] p-6 m-2 max-w-sm bg-[#830002] rounded-lg border border-gray-400 shadow-md hover:bg-stone-300">
          <p class="mb-2 text-xl font-bold tracking-tight text-white">Titre : ${articleArr[i].title}</p>
          <p class="mb-2 text-xl font-bold tracking-tight text-white">Date : ${articleArr[i].published_at}</p>
          </div>`;
      }
      console.log(articlesJSON["hydra:member"])
    }
    sortArticles20();
  });
