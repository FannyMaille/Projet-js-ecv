import {dataFetching} from './dataFetching.js';
import createElement from "./createElement.js";

export async function getProducts( data = false ) {
    const root = document.querySelector('body');
    let allentities = document.getElementsByClassName('allentities')[0]; 
    if ( !allentities ) {
        allentities = createElement("div", { myclass: "allentities" }, root);
    }

    allentities.innerHTML = "";

    let i;
    let maxI = 6;
    if ( data instanceof Object ) {
        maxI = 2;
    }
    for ( i = 1; i < maxI ; i++) {
        try {
            const assets = data !== false ?
                data :
                await dataFetching(
                `https://awesome-nft-app.herokuapp.com/?page=${i}`
                );

            assets.map(({ name, image_url, id, creator, collection, sales }) => {
            //create Card
            const card = createElement("div", { myclass: "card", customatributes:{ 'data-sales': sales ?? 0} }, allentities);
    
            //create div header
            const cardHeader = createElement(
                "div",
                { myclass: "card-header" },
                card
            );
    
            //Create title and heart
            const titlenft = createElement(
                "div",
                { myclass: "titlenft" },
                cardHeader
            );
            if (name) {
                createElement(
                "h2",
                { text: name, color: "#627264", myclass: "namenft" },
                titlenft
                );
            } else {
                createElement(
                "h2",
                {
                    text: "No Title Available",
                    color: "#627264",
                    myclass: "namenft",
                },
                titlenft
                );
            }
    
            createElement(
                "a",
                {
                myclass: "favorite",
                dataFavorite: id,
                dataFavoriteAddClass: "favoriteadd",
                dataFavoriteRemoveClass: "favoriteremove",
                },
                titlenft
            );
    
            //create p username
            if (creator.username) {
                createElement(
                "p",
                {
                    text: `Created by ${
                    creator.username
                    } <br> On the ${collection.created_at.slice(0, 10)}`,
                    myclass: "card-subtitle text-gray",
                },
                cardHeader
                );
            } else {
                createElement(
                "p",
                {
                    text: `Created by unknown Creator <br> On the ${collection.created_at.slice(
                    0,
                    10
                    )}`,
                    myclass: "card-subtitle text-gray",
                },
                cardHeader
                );
            }
    
            //create p sales
            if (sales) {
                createElement(
                "p",
                {
                    text: `${sales} sales`,
                    color: "#627264",
                    myclass: "card-subtitle",
                },
                cardHeader
                );
            } else {
                createElement(
                "p",
                { text: `0 sales`, color: "#627264", myclass: "card-subtitle" },
                cardHeader
                );
            }
    
            //create image
            const cardImage = createElement(
                "DIV",
                { myclass: "card-image" },
                card
            );
            if (image_url) {
                createElement(
                "img",
                { imgsrc: image_url, myclass: "img-responsive image" },
                cardImage
                );
            } else {
                createElement(
                "img",
                {
                    imgsrc: "./assets/noImage.png",
                    myclass: "img-responsive image",
                },
                cardImage
                );
            }
    
            //create btn
            const cardFooter = createElement(
                "div",
                { myclass: "card-footer" },
                cardHeader
            );
            createElement(
                "a",
                {
                text: "See details",
                myhref: `#/product/${id}`,
                myclass: "btn",
                color: "#627264",
                bgcolor: "#A1CDA8",
                border: "#A1CDA8",
                },
                cardFooter
            );
            });
            
        } catch (error) {
            console.log(error);
        }
    }
    const datasLoadedEvent = new Event("datasLoaded");
    document.dispatchEvent(datasLoadedEvent);
}