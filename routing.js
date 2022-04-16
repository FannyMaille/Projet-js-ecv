import createElement from "./createElement.js";
//Routing

let routes = {};
let templates = {};

function home() {
  const root = document.querySelector("body");
  createElement(
    "h1",
    {
      text: "Welcome on the website for the nft",
      color: "#627264",
      myclass: "title",
    },
    root
  );
  (async () => {
    async function dataFetching(url) {
      const raw = await fetch(url);
      const { assets } = await raw.json();
      return assets;
    }
    //create my main div
    createElement('div', { myclass: 'allentities' }, root);
    const allentities = document.getElementsByClassName('allentities')[0];
    let n = 0;
    try {
      const assets = await dataFetching("https://awesome-nft-app.herokuapp.com/")
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
        createElement('button', { text: "Voir la fiche détails", myonclick: `window.location.href='#/product/${id}'`, myclass: 'btn', color: '#627264', bgcolor: '#A1CDA8', border: '#A1CDA8' }, cardFooter);
        n++;
      })

    } catch (error) {
      console.log(error);
    }
    const datasLoadedEvent = new Event('datasLoaded')
    document.dispatchEvent(datasLoadedEvent)
  })();
}

function product() {
  (async () => {
    const root = document.querySelector('body');
    createElement('button', { text: "Retour", myonclick: `window.location.href='#/'`, myclass: 'btn ml-2 mt-2', color: '#627264', bgcolor: '#A1CDA8', border: '#A1CDA8' }, root);
    const id_nft = 385541148;

    async function dataFetchingSingle(url) {
      const raw = await fetch(url);
      return await raw.json();
    }

    async function dataFetching(url) {
      const raw = await fetch(url);
      const { assets } = await raw.json();
      return assets;
    }
    //création des divs
    createElement('div', { myid: 'product_detail', myclass: 'container' }, root);
    createElement('div', { myid: 'product_essential', myclass: 'product_essential' }, root);
    createElement('div', { myid: 'product_information', myclass: 'product_information' }, root);
    createElement('div', { myid: 'product_information_left', myclass: 'product_information_child' }, root);
    createElement('div', { myid: 'product_information_right', myclass: 'product_information_child bg_grey' }, root);

    try {

      const asset = await dataFetchingSingle(`https://awesome-nft-app.herokuapp.com/nft/${id_nft}`)
      console.log(asset);
      const { name, description, image_url, collection, creator } = asset;

      const divProductDetail = document.getElementById('product_detail');
      const divProductEssential = document.getElementById('product_essential');
      divProductDetail.append(divProductEssential);

      // Div Product Essential

      createElement('h1', { text: 'Fiche produit', color: '', myclass: 'text-center' }, divProductEssential);
      createElement('hr', { text: '', color: '', myclass: 'text-center hr-horizontal center w-60' }, divProductEssential);
      createElement('h2', { text: name, color: '', myclass: 'text-center' }, divProductEssential);
      createElement('hr', { text: '', color: '', myclass: 'text-center hr-horizontal center w-60' }, divProductEssential);

      if (image_url) {
        createElement('img', { imgsrc: image_url, myclass: 'img-responsive img-product' }, divProductEssential);
      }

      // Div Information : coontient 2 div
      // Div Child Information Left : Informations concernant le produit


      const divProductInformation = document.getElementById('product_information');
      divProductDetail.append(divProductInformation);

      const divProductInformationLeft = document.getElementById('product_information_left');
      divProductInformation.append(divProductInformationLeft);
      // Description
      if (description) {
        createElement('h3', { text: 'Description :', color: '', myclass: '' }, divProductInformationLeft);
        createElement('hr', { text: '', color: '', myclass: 'ml-0 hr-horizontal w-100' }, divProductInformationLeft);
        createElement('p', { text: description, color: 'black', myclass: '' }, divProductInformationLeft);
      }
      // Créateur
      if (creator.username) {
        createElement('p', { text: creator.username, color: 'black', myclass: 'creator' }, divProductInformationLeft);
      }

      // Div Child Information Right : informations concernant la collection
      const divProductInformationRight = document.getElementById('product_information_right');
      divProductInformation.append(divProductInformationRight);

      createElement('h3', { text: 'Collection :', color: '', myclass: '' }, divProductInformationRight);
      createElement('hr', { text: '', color: '', myclass: 'ml-0 hr-horizontal w-100' }, divProductInformationRight);
      // Nom de la collection
      if (collection.name) {
        createElement('p', { text: collection.name, color: 'black', myclass: '' }, divProductInformationRight);
      }
      // Image de la collection
      if (collection.banner_image_url) {
        createElement('img', { imgsrc: collection.banner_image_url, myclass: 'img-responsive test' }, divProductInformationRight);
      }
      // Date de création
      if (collection.created_at) {
        createElement('p', { text: collection.created_at, color: 'black', myclass: 'date' }, divProductInformationRight);
      }
    } catch (error) {
      console.log(error);
    }
  })();
}

function route(path, template) {
  if (typeof template === "function") {
    return (routes[path] = template);
  } else if (typeof template === "string") {
    return (routes[path] = templates[template]);
  } else {
    return;
  }
}

function template(name, templateFunction) {
  return (templates[name] = templateFunction);
}

template("home", function () {
  home();
});
template("product", function () {
  product();
});

function resolveRoute(route) {
  try {
    return routes[route];
  } catch (e) {
    throw new Error(`Route ${route} not found`);
  }
}

function router(evt) {
  let url = window.location.hash.slice(1) || "/";
  let route = resolveRoute(url);

  route();
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

export { route };
