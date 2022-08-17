const myJSON = "https://localhost:8000/api/articles";
const divArticles = document.querySelector("#articles");

fetch(myJSON)
  .then((response) => response.json())
  .then((articlesJSON) => {
    // fonction pour trier  un tableau d’objets avec la valeur de date par order croissant
    function sortArticles20() {
      let articleArr = articlesJSON["hydra:member"];

      articleArr = articleArr.filter( function(x) {
        // On ne récupère que les articles qui ont une date de publication non nulle.
        if (x.published_at) {
          return true;
        }
      }).sort(function (x, y) {
        // On trie le tableau par date de publication chronologique.
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
        divArticles.innerHTML += `<div class="article">
          <p class="article-infos">Titre : ${articleArr[i].title}</p>
          <p class="article-infos">Date : ${articleArr[i].published_at}</p>
          </div>`;
      }
    }
    sortArticles20();
  });
