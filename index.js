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
const initFavorites = () => {

    const keyFavorites = 'nftFavorites'
    let favorites = JSON.parse(localStorage.getItem(keyFavorites));
    if(!Array.isArray(favorites)){
        favorites = []
    }

    const updateState = (element) => {
        document.querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`).forEach((button) => {
            button.dataset.favoriteAdded = favorites.includes(button.dataset.favorite) ? 1 : 0
        })
    }

    const updateText = (element) => {
        document.querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`).forEach((button) => {
            button.innerHTML = button.dataset.favoriteAdded == 1 ? button.dataset.favoriteAddText ?? '' : button.dataset.favoriteRemoveText ?? ''
        })
    }

    const updateClasses = (element) => {
        document.querySelectorAll(`[data-favorite="${element.dataset.favorite}"]`).forEach((button) => {
            const addedClasses = button.dataset.favoriteAddedClasses ? button.dataset.favoriteAddedClasses.split(' ') : null
            const removedClasses = button.dataset.favoriteRemovedClasses ? button.dataset.favoriteRemovedClasses.split(' ') : null
            if(button.dataset.favoriteAdded == 1){
                if(addedClasses){
                    button.classList.add(...addedClasses)
                }
                if(removedClasses){
                    button.classList.remove(...removedClasses)
                }
            } else {
                if(addedClasses){
                    button.classList.remove(...addedClasses)
                }
                if(removedClasses){
                    button.classList.add(...removedClasses)
                }
            }
        })
    }

    document.querySelectorAll('[data-favorite]').forEach((element) => {
        const idNft = element.dataset.favorite;
        updateState(element)
        updateText(element)
        updateClasses(element)

        element.addEventListener('click', () => {
            const indexOfNft = favorites.indexOf(idNft)
            if(indexOfNft == -1){
                favorites.push(idNft)
            } else {
                favorites.splice(indexOfNft,1)
            }
            updateState(element)
            updateText(element)
            updateClasses(element)
            localStorage.setItem(keyFavorites, JSON.stringify(favorites))
    
        })
    })

    
};

const initApp = () => {
    initFavorites()
}

document.addEventListener('datasLoaded', () => {
    initApp();
})

function createElement(tag, config, parent = null) {
  const { text, imgsrc, myclass, color, myid, myonclick } = config || {};

  const element = document.createElement(tag);

  if (color) {
    element.style.color = color;
  }

  if (imgsrc) {
    element.setAttribute('src', imgsrc);
  }

  if (myclass) {
    element.setAttribute('class', myclass);
  }

  if (myid) {
    element.setAttribute('id', myid);
  }

  if (myonclick) {
    element.setAttribute('onclick', myonclick);
  }

  if (text) {
    element.innerHTML = text;
  }
  if (!parent) {
    root.appendChild(element);
  } else {
    parent.appendChild(element);
  }
  return element;
}

function changeColor(){
  const heart = document.getElementsByClassName('favorite');
  heart.addEventListener("onclick", function () {
    heart.addClass("intro");
  });
}

$(function() {
  $( "a" ).click(function() {
    $( "a" ).toggleClass( "press", 1000 );
  });
});