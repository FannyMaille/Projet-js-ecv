import { route, router } from "./routing.js";
import createElement from "./createElement.js";

/**
 * Fonctionnalités des favoris :
 *
 * 1. Créer un élément (a ou button) dans le dom avec data-favorite="SON_ID_UNIQUE" (SON_ID_UNIQUE est l'id du NFT renvoyé par l'api)
 * 2. Lui ajouter data-favorite-add-text="TEXTE_A_AFFICHER_POUR_AJOUTER" (exemple : "Ajouter aux favoris")
 * 3. Lui ajouter data-favorite-remove-text="TEXTE_A_AFFICHER_POUR_SUPPRIMER" (exemple : "Retirer des favoris")
 * 4. Si on veut ajouter du style css au bouton en fonction du statut, ajoutez les classes dynamiques :
 *  - data-favorite-added-classes="class1 class2" --> le bouton aura les classes si le nft est dans les fav
 *  - data-favorite-removed-classes="class1 class2" --> le bouton aura les classes si le nft n'est pas dans les fav
 *
 */

/**
 * Performs a GET method on the given URL with the fetch function.
 * 
 * @param {string} url - url to fetch from
 * @returns json parsed from the fetched data.
 */
 async function dataFetching(url) {
    const raw = await fetch(url);
    const { assets } = await raw.json();
    return assets;
  }


const initFavorites = () => {
  const keyFavorites = "nftFavorites";
  let favorites = JSON.parse(localStorage.getItem(keyFavorites));
  if (!Array.isArray(favorites)) {
    favorites = [];
  }

  const updateState = (element) => {
    document
      .querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`)
      .forEach((button) => {
        button.dataset.favoriteAdded = favorites.includes(
          button.dataset.favorite
        )
          ? 1
          : 0;
      });
  };

  const updateText = (element) => {
    document
      .querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`)
      .forEach((button) => {
        button.innerHTML =
          button.dataset.favoriteAdded == 1
            ? button.dataset.favoriteAddText ?? ""
            : button.dataset.favoriteRemoveText ?? "";
      });
  };

  const updateClasses = (element) => {
    document
      .querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`)
      .forEach((button) => {
        const addedClasses = button.dataset.favoriteAddedClasses
          ? button.dataset.favoriteAddedClasses.split(" ")
          : null;
        const removedClasses = button.dataset.favoriteRemovedClasses
          ? button.dataset.favoriteRemovedClasses.split(" ")
          : null;
        if (button.dataset.favoriteAdded == 1) {
          if (addedClasses) {
            button.classList.add(...addedClasses);
          }
          if (removedClasses) {
            button.classList.remove(...removedClasses);
          }
        } else {
          if (addedClasses) {
            button.classList.remove(...addedClasses);
          }
          if (removedClasses) {
            button.classList.add(...removedClasses);
          }
        }
      });
  };

  document.querySelectorAll("[data-favorite]").forEach((element) => {
    const idNft = element.dataset.favorite;
    updateState(element);
    updateText(element);
    updateClasses(element);

    element.addEventListener("click", () => {
      const indexOfNft = favorites.indexOf(idNft);
      if (indexOfNft == -1) {
        favorites.push(idNft);
      } else {
        favorites.splice(indexOfNft, 1);
      }
      updateState(element);
      updateText(element);
      updateClasses(element);
      localStorage.setItem(keyFavorites, JSON.stringify(favorites));
    });
  });
};

 const initFilters = async () => {
    const filterDiv = document.getElementsByClassName('filters')[0];
    const data = [];
    for ( let i = 0; i < 6 ; i++ ) {
        const pageData = await dataFetching(`https://awesome-nft-app.herokuapp.com/?page=${i}`)
        data.push.apply(data, pageData);
    }
    let creatorNames = data.map((nft) => nft.creator.username );
    creatorNames = creatorNames.filter((a, b) => creatorNames.indexOf(a) === b );
    creatorNames = creatorNames.filter((e) => e.length !== 0);
    const selector = filterDiv.querySelector('select');
    selector.options.add(new Option( 'Creator', 'all creators', true, true ));
    for ( const o of creatorNames ) {
        selector.options.add(new Option( o ));
    };
    selector.addEventListener('change', async function() {
        const data = await dataFetching(`https://awesome-nft-app.herokuapp.com/search?q=${ selector.value }`);
        const newList = data.filter(( item ) => item.creator.username.toLowerCase().includes( selector.value.toLowerCase()))
        getProducts( newList );
    })
    
    const searchBar = filterDiv.querySelector('input');
    const clearIcon = filterDiv.querySelector('i');
    clearIcon.addEventListener("click", async () => {
        searchBar.value = "";
       await searchByKeyword();
    })
   
}

const initApp = () => {
    initFavorites();
    initFilters();
}

document.addEventListener('datasLoaded', () => {
    initApp();
})

window.addEventListener("load", (e) => {
  // Router
  // Define the mappings route->template.
  route("/", "home");
  route(`/product/`, "product");
  route(`/nftcreator/`, "nftcreator");

  window.addEventListener("hashchange", router);
  router(e);
});
async function sortbySales(param) {
    if ( param ) {
        const data = await dataFetching(`https://awesome-nft-app.herokuapp.com/`);
        const newList = data.sort(( item1, item2 ) => item2.sales - item1.sales );
        getProducts( newList );
    } else {
        getProducts();
    }
}

async function searchByKeyword() {
    const filterDiv = document.getElementsByClassName('filters')[0];
    const input = filterDiv.querySelector('input')
    if ( input.value.toLowerCase().trim().length > 0 ) {
        const data = await dataFetching(`https://awesome-nft-app.herokuapp.com/search?q=${ input.value.toLowerCase().trim() }`);
        getProducts( data );
    } else {
        getProducts();
    }
}

async function getProducts( data ) {
    const div = document.getElementsByClassName('allentities')[0];
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    const allentities = document.getElementsByClassName('allentities')[0];
    let n = 0;
    for ( let i = 1 ; i < 6 ; i++ ) {
        let assets = await dataFetching(`https://awesome-nft-app.herokuapp.com/?page=${i}`);
        if ( data && Object.keys( data ).length > 0 ) {
            assets = data;
        }
        assets.map(({ name, image_url, id, creator, collection, sales }) => {
            //create Card
            createElement('div', { myclass: 'card' }, allentities);
            const card = document.getElementsByClassName('card')[n];

            //create div header
            createElement('div', { myclass: 'card-header' }, card);
            const cardHeader = document.getElementsByClassName('card-header')[n];

            //Create title and heart
            createElement('div', { myclass: 'titlenft' }, cardHeader);
            const titlenft = document.getElementsByClassName('titlenft')[n];
            createElement('h2', { text: name, color: '#627264', myclass: 'namenft' }, titlenft);
            createElement('a', {
            myclass: 'favorite', dataFavorite: id,
            dataFavoriteAddClass: 'favoriteadd', dataFavoriteRemoveClass: 'favoriteremove'
            }, titlenft);

            //create p username
            if (creator.username) {
            createElement('p', { text: `Created by ${creator.username} <br> On the ${collection.created_at.slice(0, 10)}`, myclass: 'card-subtitle text-gray' }, cardHeader);
            }
            else {
            createElement('p', { text: `Created by unknown Creator <br> On the ${collection.created_at.slice(0, 10)}`, myclass: 'card-subtitle text-gray' }, cardHeader);
            }

            //create p sales
            if (sales) {
            createElement('p', { text: `${sales} sales`, color: '#627264', myclass: 'card-subtitle' }, cardHeader);
            }
            else {
            createElement('p', { text: `0 sales`, color: '#627264', myclass: 'card-subtitle' }, cardHeader);
            }

            //create image
            if (image_url) {
                createElement('DIV', { myclass: 'card-image' }, card);
                const cardImage = document.getElementsByClassName('card-image')[n];
                createElement('img', { imgsrc: image_url, myclass: 'img-responsive image' }, cardImage);
            }

            //create btn
            createElement('div', { myclass: 'card-footer' }, cardHeader);
            const cardFooter = document.getElementsByClassName('card-footer')[n];
            createElement('button', { text: "Voir la fiche détails", myonclick: `window.location.href='product.html?id=${id}'`, myclass: 'btn', color: '#627264', bgcolor: '#A1CDA8', border: '#A1CDA8' }, cardFooter);
            n++;
        })
    }
    

}