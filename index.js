import { route, router } from "./routing.js";
import { dataFetching } from "./dataFetching.js";
import { getProducts } from "./getProducts.js";

let validbtn = false;

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
  const filterDiv = document.getElementsByClassName("filters")[0];
  filterDiv.style.display = "flex";
  const data = [];
  for (let i = 0; i < 6; i++) {
    const pageData = await dataFetching(
      `https://awesome-nft-app.herokuapp.com/?page=${i}`
    );
    data.push.apply(data, pageData);
  }
  let creatorNames = data.map((nft) => nft.creator.username);
  creatorNames = creatorNames.filter((a, b) => creatorNames.indexOf(a) === b);
  creatorNames = creatorNames.filter((e) => e.length !== 0);
  const selector = filterDiv.querySelector("select");
  selector.innerHTML = "";
  selector.options.add(new Option("Creator", "all creators", true, true));
  for (const o of creatorNames) {
    selector.options.add(new Option(o));
  }
  selector.addEventListener("change", async function () {
    const data = await dataFetching(
      `https://awesome-nft-app.herokuapp.com/search?q=${selector.value}`
    );
    const newList = data.filter((item) =>
      item.creator.username.toLowerCase().includes(selector.value.toLowerCase())
    );
    getProducts(newList);
  });

  const searchBar = filterDiv.querySelector("input");
  const clearIcon = filterDiv.querySelector("i");
  clearIcon.addEventListener("click", async () => {
    searchBar.value = "";
    await searchByKeyword();
  });

  const showAll = filterDiv.getElementsByClassName("select-all")[0];
  showAll.addEventListener("click", async function () {
    getProducts();
  });
  const showSales = filterDiv.getElementsByClassName("show-sales")[0];
  showSales.addEventListener("click", async function () {
    const allEntities = document.querySelector(".allentities");
    const items = allEntities.childNodes;
    const itemsArr = [];
    for (const i in items) {
      if (items[i].nodeType == 1) {
        // get rid of the whitespace text nodes
        itemsArr.push(items[i]);
      }
    }
    itemsArr.sort(function (a, b) {
      return parseInt(a.dataset.sales) == parseInt(b.dataset.sales)
        ? 0
        : parseInt(a.dataset.sales) < parseInt(b.dataset.sales)
        ? 1
        : -1;
    });
    for (let i = 0; i < itemsArr.length; ++i) {
      allEntities.appendChild(itemsArr[i]);
    }
    // getProducts(newList);
  });

  const input = filterDiv.querySelector("input");
  input.innerHTML = "";
  let timeout = null;
  input.addEventListener("keyup", async function () {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (input.value.toLowerCase().trim().length > 0) {
        const data = await dataFetching(
          `https://awesome-nft-app.herokuapp.com/search?q=${input.value
            .toLowerCase()
            .trim()}`
        );
        await getProducts(data);
      } else {
        await getProducts();
      }
    }, 1000);
  });
};

const initApp = () => {
  initFavorites();
  if (!validbtn) {
    initFilters();
    validbtn = true;
  }
};

document.addEventListener("datasLoaded", () => {
  initApp();
});

window.addEventListener("load", (e) => {
  // Router
  // Define the mappings route->template.
  route("/", "home");
  route(`/product/`, "product");
  route(`/nftcreator/`, "nftcreator");

  window.addEventListener("hashchange", router);
  router(e);
});

async function searchByKeyword() {
  const filterDiv = document.getElementsByClassName("filters")[0];
  const input = filterDiv.querySelector("input");
  if (input.value.toLowerCase().trim().length > 0) {
    const data = await dataFetching(
      `https://awesome-nft-app.herokuapp.com/search?q=${input.value
        .toLowerCase()
        .trim()}`
    );
    getProducts(data);
  } else {
    getProducts();
  }
}
