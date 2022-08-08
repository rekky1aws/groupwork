const myJSON = "https://localhost:8000/api/articles";
const divArticles = document.querySelector("#articles");

fetch(myJSON)
  .then((response) => response.json())
  .then((articlesJSON) => {
    // fonction pour trier  un tableau d’objets avec la valeur de date par order croissant
    function sortArticles20() {
      articlesJSON["hydra:member"].sort(function (x, y) {
        let firstDate = new Date(x.published_at),
          SecondDate = new Date(y.published_at);

        if (firstDate < SecondDate) return -1;
        if (firstDate > SecondDate) return 1;
        return 0;
      });
      // boucle pour sortir 20 articles par page
      for (
        let i = 0;
        i < Math.min(articlesJSON["hydra:member"].length, 20);
        i++
      ) {
        divArticles.innerHTML += `<div class="block  md:p-[22.3px] p-6 m-2 max-w-sm bg-[#830002] rounded-lg border border-gray-400 shadow-md hover:bg-stone-300">
          <p class="mb-2 text-xl font-bold tracking-tight text-white">Titre : ${articlesJSON["hydra:member"][i].title}</p>
          </div>`;
      }
    }
    sortArticles20();
  });
