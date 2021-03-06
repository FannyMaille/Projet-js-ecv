import createElement from "./createElement.js";
import { dataFetchingSingle } from "./dataFetching.js";
import { getProducts } from "./getProducts.js";
//Routing

// Both set of different routes and template generation functions
let routes = {};
let templates = {};

// Register a template (this is to mimic a template engine)
function template(name, templateFunction) {
  return (templates[name] = templateFunction);
}

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
function route(path, template) {
  if (typeof template === "function") {
    return (routes[path] = template);
  } else if (typeof template === "string") {
    return (routes[path] = templates[template]);
  } else {
    return;
  }
}

// Register the templates.
template("home", () => {
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
  const divBtn = createElement(
    "div",
    {
      myclass: "title",
    },
    root
  );

  createElement(
    "a",
    {
      text: "Create your own NFT",
      myhref: `#/nftcreator/`,
      myclass: "btn bntnft",
      color: "#627264",
      bgcolor: "#A1CDA8",
      border: "#A1CDA8",
    },
    divBtn
  );
  // Skeleton
	const skeleton = createElement("div", { myclass: "skeletonentities blink_me"}, root);
	//create Card
	for ( let i=0; i < 6; i++) {
		const card = createElement("div", { myclass: "card card-skeleton" }, skeleton);
		//create div header
		const cardHeader = createElement("div", { myclass: "card-header card-header-skeleton" }, card);
		const title = createElement("div", { myclass: "title-skeleton" }, cardHeader);
		const cardImage = createElement("div", { myclass: "card-image card-image-skeleton" }, card);
		const subtitle = createElement("div", { myclass: "card-subtitle-skeleton" }, cardHeader);
		const sale = createElement("div", { myclass: "card-sale-skeleton" }, cardHeader);
		const button = createElement("div", { myclass: "card-button-skeleton" }, cardHeader);
	}

  (async () => {
    //creates filters div
    createElement(
      "div",
      { myclass: "filters", style: { display: "none" } },
      root
    );
    const filterDiv = document.getElementsByClassName("filters")[0];

    //adds filter buttons
    createElement(
      "button",
      { myclass: "btn green select-all", myonclick: "false", text: "Show all" },
      filterDiv
    );
    createElement(
      "button",
      {
        myclass: "btn green show-sales",
        myonclick: "true",
        text: "Sort by Sales",
      },
      filterDiv
    );

    //adds creators selectors
    createElement("div", { myclass: "selectDiv" }, filterDiv);
    const selectDiv = document.getElementsByClassName("selectDiv")[0];
    createElement("label", { myclass: "title", id: "selName" }, selectDiv);
    createElement(
      "select",
      { myclass: "select form-select", id: "creatorName" },
      selectDiv
    );

    //adds searchbar
    createElement("div", { myclass: "searchDiv" }, filterDiv);
    const searchDiv = document.getElementsByClassName("searchDiv")[0];
    createElement(
      "input",
      { myclass: "searchbar", type: "text", placeholder: "Type in anything" },
      searchDiv
    );
    createElement("i", { myclass: "icon icon-cross" }, searchDiv);

    //create my main div
    await getProducts();
    skeleton.remove();
  })();
});

template("product", () => {
  (async () => {
    const root = document.querySelector("body");
    createElement(
      "button",
      {
        text: "Back",
        myonclick: `window.location.href='/'`,
        myclass: "btn ml-2 mt-2",
        color: "#627264",
        bgcolor: "#A1CDA8",
        border: "#A1CDA8",
      },
      root
    );

			// Skeleton
		const skeletonProduct = createElement("div", { myclass: "skeletonentities blink_me"}, root);
		//create Card
		const card = createElement("div", { myclass: "card card-product-skeleton" }, skeletonProduct);
		const titleProduct = createElement("div", { myclass: "title-product-skeleton" }, card);
		const titleProductNft = createElement("div", { myclass: "title-nft-skeleton" }, card);
		const imgProduct = createElement("div", { myclass: "img-skeleton" }, card);


    const id_nft = window.location.hash.slice(10);

    //cr??ation des divs
    createElement(
      "div",
      { myid: "product_detail", myclass: "container" },
      root
    );
    createElement(
      "div",
      { myid: "product_essential", myclass: "product_essential" },
      root
    );
    createElement(
      "div",
      { myid: "product_information", myclass: "product_information" },
      root
    );
    createElement(
      "div",
      {
        myid: "product_information_left",
        myclass: "product_information_child",
      },
      root
    );
    createElement(
      "div",
      {
        myid: "product_information_right",
        myclass: "product_information_child bg_grey",
      },
      root
    );

    try {
      const asset = await dataFetchingSingle(
        `https://awesome-nft-app.herokuapp.com/nft/${id_nft}`
      );
      const { name, description, image_url, collection, creator } = asset;

      const divProductDetail = document.getElementById("product_detail");
      const divProductEssential = document.getElementById("product_essential");
      divProductDetail.append(divProductEssential);

      // Div Product Essential

      createElement(
        "h1",
        { text: "Product sheet", color: "", myclass: "text-center" },
        divProductEssential
      );
      createElement(
        "hr",
        {
          text: "",
          color: "",
          myclass: "text-center hr-horizontal center w-60",
        },
        divProductEssential
      );
      createElement(
        "h2",
        { text: name, color: "", myclass: "text-center" },
        divProductEssential
      );
      createElement(
        "hr",
        {
          text: "",
          color: "",
          myclass: "text-center hr-horizontal center w-60",
        },
        divProductEssential
      );

      if (image_url) {
        createElement(
          "img",
          {
            imgsrc: image_url,
            myclass: "img-responsive img-product js-lazyImg",
          },
          divProductEssential
        );
      }

      // Div Information : coontient 2 div
      // Div Child Information Left : Informations concernant le produit

      const divProductInformation = document.getElementById(
        "product_information"
      );
      divProductDetail.append(divProductInformation);

      const divProductInformationLeft = document.getElementById(
        "product_information_left"
      );
      divProductInformation.append(divProductInformationLeft);
      // Description
      if (description) {
        createElement(
          "h3",
          { text: "Description :", color: "", myclass: "" },
          divProductInformationLeft
        );
        createElement(
          "hr",
          { text: "", color: "", myclass: "ml-0 hr-horizontal w-100" },
          divProductInformationLeft
        );
        createElement(
          "p",
          { text: description, color: "black", myclass: "" },
          divProductInformationLeft
        );
      }
      // Cr??ateur
      if (creator.username) {
        createElement(
          "p",
          { text: creator.username, color: "black", myclass: "creator" },
          divProductInformationLeft
        );
      }

      // Div Child Information Right : informations concernant la collection
      const divProductInformationRight = document.getElementById(
        "product_information_right"
      );
      divProductInformation.append(divProductInformationRight);

      createElement(
        "h3",
        { text: "Collection :", color: "", myclass: "" },
        divProductInformationRight
      );
      createElement(
        "hr",
        { text: "", color: "", myclass: "ml-0 hr-horizontal w-100" },
        divProductInformationRight
      );
      // Nom de la collection
      if (collection.name) {
        createElement(
          "p",
          { text: collection.name, color: "black", myclass: "" },
          divProductInformationRight
        );
      }
      // Image de la collection
      if (collection.banner_image_url) {
        createElement(
          "img",
          {
            imgsrc: collection.banner_image_url,
            myclass: "img-responsive js-lazyImg",
          },
          divProductInformationRight
        );
      }
      // Date de cr??ation
      if (collection.created_at) {
        createElement(
          "p",
          { text: collection.created_at, color: "black", myclass: "date" },
          divProductInformationRight
        );
      }
    } catch (error) {
      console.error(error);
    }
		skeletonProduct.remove();
  })();
});

template("nftcreator", () => {
  (() => {
    const root = document.querySelector("body");
    createElement(
      "button",
      {
        text: "Back",
        myonclick: `window.location.href='/'`,
        myclass: "btn ml-2 mt-2",
        color: "#627264",
        bgcolor: "#A1CDA8",
        border: "#A1CDA8",
      },
      root
    );
    createElement(
      "h1",
      {
        text: "Create your own NFT",
        color: "#627264",
        myclass: "title",
      },
      root
    );
    const size = 20;
    const cellSize = 40;
    let nftSize = size * cellSize;

    let nft = {
      creator: "",
      name: "",
      pattern: {},
      size: size,
    };

    let currentColor = "#123456";
    let showDividers = true;

    let canvas = null;
    let ctx = null;

    const nfts = JSON.parse(localStorage.getItem("nfts")) ?? [];

    const mousemove = new Event("mousemove");
    const updateCanvas = new Event("updateCanvas");

    const container = createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 64px",
        alignItems: "start",
      },
    });

    const makeEditor = () => {
      // Bloc gauche de param??trage du NFT
      const divEditor = createElement(
        "div",
        { myclass: "editor p-2 card" },
        container
      );

      // Charger un NFT existant (si existe)
      if (nfts.length) {
        const blocNft = createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "4px" } },
          divEditor
        );
        const nftLabel = createElement(
          "label",
          { text: "Load an existing NFT", htmlFor: "nft" },
          blocNft
        );
        const nftSelect = createElement("select", {}, blocNft);
        createElement(
          "option",
          { value: "", text: "-- Chose one --" },
          nftSelect
        );
        nfts.forEach((nft, index) => {
          createElement(
            "option",
            { value: `${index}`, text: nft.name },
            nftSelect
          );
        });

        const nftButton = createElement(
          "button",
          {
            type: "button",
            text: "Load",
            myclass: "btn ml-2 mt-2",
            color: "#627264",
            bgcolor: "#A1CDA8",
            border: "#A1CDA8",
          },
          divEditor
        );

        nftButton.addEventListener("click", (e) => {
          nft = nfts[nftSelect.value];
          sizeInput.value = nft.size;
          nameInput.value = nft.name;
          creatorInput.value = nft.creator;
          nftSize = nft.size * cellSize;
          canvas.width = nftSize;
          canvas.height = nftSize;
          canvas.dispatchEvent(updateCanvas);
        });
      }

      // Nom du cr??ateur
      const blocSize = createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        divEditor
      );
      const sizeLabel = createElement(
        "label",
        { text: "Size (number of cells from 1 to 24)", htmlFor: "size" },
        blocSize
      );
      const sizeInput = createElement(
        "input",
        { type: "number", max: 24, min: 1, myid: "size", value: nft.size },
        blocSize
      );

      sizeInput.addEventListener("change", (e) => {
        nft = { ...nft, size: e.target.value };
        nftSize = nft.size * cellSize;
        canvas.width = nftSize;
        canvas.height = nftSize;
        canvas.dispatchEvent(updateCanvas);
      });

      // Nom du cr??ateur
      const blocCreator = createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        divEditor
      );
      const creatorLabel = createElement(
        "label",
        { text: "Creator name", htmlFor: "creator" },
        blocCreator
      );
      const creatorInput = createElement(
        "input",
        { type: "text", myid: "creator", value: nft.creator },
        blocCreator
      );

      creatorInput.addEventListener("change", (e) => {
        nft = { ...nft, creator: e.target.value };
      });

      // Nom du NFT
      const blocName = createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        divEditor
      );
      const nameLabel = createElement(
        "label",
        { text: "NFT name", htmlFor: "name" },
        blocName
      );
      const nameInput = createElement(
        "input",
        { type: "text", myid: "name", value: nft.name },
        blocName
      );

      nameInput.addEventListener("change", (e) => {
        nft = { ...nft, name: e.target.value };
      });

      // Choix de la couleur
      const blocColor = createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        divEditor
      );
      const colorLabel = createElement(
        "label",
        { text: "Color", htmlFor: "color" },
        blocColor
      );
      const colorInput = createElement(
        "input",
        {
          type: "color",
          myid: "color",
          myclass: "col-12",
          value: currentColor,
        },
        blocColor
      );

      colorInput.addEventListener("change", (e) => {
        currentColor = e.target.value;
      });

      // Afficher / masquer le quadrillage
      const blocDividers = createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        divEditor
      );
      const dividerTitle = createElement(
        "label",
        { text: "Display grid on editor ?" },
        blocDividers
      );
      const dividerRadio = createElement(
        "div",
        { style: { display: "flex", gap: "16px" } },
        blocDividers
      );
      const dividersOnBloc = createElement(
        "div",
        { style: { display: "flex", gap: "4px", alignItems: "center" } },
        dividerRadio
      );
      const dividersOnLabel = createElement(
        "label",
        { text: "Yes", htmlFor: "dividersOn" },
        dividersOnBloc
      );
      const dividersOnInput = createElement(
        "input",
        {
          type: "radio",
          name: "dividers",
          value: "1",
          myid: "dividersOn",
          checked: showDividers,
        },
        dividersOnBloc
      );
      const dividersOffBloc = createElement(
        "div",
        { style: { display: "flex", gap: "4px", alignItems: "center" } },
        dividerRadio
      );
      const dividersOffLabel = createElement(
        "label",
        { text: "No", htmlFor: "dividersOff" },
        dividersOffBloc
      );
      const dividersOffInput = createElement(
        "input",
        {
          type: "radio",
          name: "dividers",
          value: "1",
          myid: "dividersOff",
          checked: !showDividers,
        },
        dividersOffBloc
      );

      dividersOnInput.addEventListener("click", (e) => {
        showDividers = true;
        canvas.dispatchEvent(updateCanvas);
      });
      dividersOffInput.addEventListener("click", (e) => {
        showDividers = false;
        canvas.dispatchEvent(updateCanvas);
      });

      const btnBloc = createElement(
        "div",
        {
          style: {
            display: "flex",
            gap: "4px",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        divEditor
      );

      const downloadButton = createElement(
        "button",
        {
          type: "button",
          text: "Download",
          myclass: "btn ml-2 mt-2 col-6",
          color: "#627264",
          bgcolor: "#A1CDA8",
          border: "#A1CDA8",
        },
        btnBloc
      );

      downloadButton.addEventListener("click", (e) => {
        showDividers = false;
        canvas.dispatchEvent(updateCanvas);
        const image = canvas.toDataURL();
        const dl = document.createElement("a");
        dl.download = `${nft.name}.png`;
        dl.href = image;
        dl.click();
        showDividers = true;
        canvas.dispatchEvent(updateCanvas);
      });

      const saveButton = createElement(
        "button",
        {
          type: "button",
          text: "Save",
          myclass: "btn ml-2 mt-2 col-6",
          color: "#627264",
          bgcolor: "#A1CDA8",
          border: "#A1CDA8",
        },
        btnBloc
      );

      saveButton.addEventListener("click", (e) => {
        if (!nft.name.length || !nft.creator.length) {
          window.alert("Creator name and NFT name are required !");
        } else {
          let existingNftId = nfts.findIndex((n) => n.name == nft.name);
          if (existingNftId == -1) {
            nfts.push(nft);
          } else {
            nfts[existingNftId] = nft;
          }
          localStorage.setItem("nfts", JSON.stringify(nfts));
          // location.reload();
        }
      });
    };

    const makeCanvas = () => {
      canvas = createElement(
        "canvas",
        {
          id: "myCanvas",
          width: nftSize,
          height: nftSize,
          style: { border: "solid 1px #000000", margin: "auto" },
        },
        container
      );
      ctx = canvas.getContext("2d");
      for (let x = 0; x < nftSize; x = x + cellSize) {
        nft.pattern[x] = nft.pattern[x] ?? {};
        for (let y = 0; y < nftSize; y = y + cellSize) {
          nft.pattern[x][y] = nft.pattern[x][y] ?? {};
          let color = "#FFFFFF";
          ctx.fillStyle = color;
          ctx.strokeStyle = "#000000";
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeRect(x, y, cellSize, cellSize);
          ctx.fill();

          nft.pattern[x][y] = color;
        }
      }

      const draw = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const baseX = Math.floor(x / cellSize) * cellSize;
        const baseY = Math.floor(y / cellSize) * cellSize;

        ctx.fillStyle = currentColor;
        ctx.fillRect(baseX, baseY, cellSize, cellSize);
        ctx.fill();
        if (showDividers) {
          ctx.strokeRect(baseX, baseY, cellSize, cellSize);
          ctx.strokeStyle = "#000000";
        }

        nft.pattern[baseX][baseY] = currentColor;
      };

      const updateCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let x = 0; x < nftSize; x = x + cellSize) {
          nft.pattern[x] = nft.pattern[x] ?? {};
          for (let y = 0; y < nftSize; y = y + cellSize) {
            nft.pattern[x][y] = nft.pattern[x][y] ?? "#FFFFFF";
            let color = nft.pattern[x][y] ?? "#FFFFFF";
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.fill();
            if (showDividers) {
              ctx.strokeStyle = "#000000";
              ctx.strokeRect(x, y, cellSize, cellSize);
              nft.pattern[x][y] = color;
            }
          }
        }
      };

      canvas.addEventListener("mousedown", (e) => {
        draw(e);
        canvas.addEventListener("mousemove", draw);
      });

      canvas.addEventListener("mouseup", () => {
        canvas.removeEventListener("mousemove", draw);
      });

      canvas.addEventListener("updateCanvas", () => {
        updateCanvas();
      });
    };

    makeEditor();
    makeCanvas();
  })();
});

// Give the correspondent route (template) or fail
function resolveRoute(route) {
  try {
    return routes[route];
  } catch (e) {
    throw new Error(`Route ${route} not found`);
  }
}

// The actual router, get the current URL and generate the corresponding template
function router(evt) {
  const root = document.querySelector("body");
  root.innerHTML = "";
  try {
    let url = window.location.hash.slice(1) || "/";
    const resolvedRoute = resolveRoute(
      url.includes("/product/") ? "/product/" : url
    );
    resolvedRoute && resolvedRoute();
  } catch (error) {
    console.warn(error);
  }
}

export { route, router };

// Lazy Loading

const imageIntersecObserver = new IntersectionObserver(
  (entries, imgObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
      }
    });
  }
);
