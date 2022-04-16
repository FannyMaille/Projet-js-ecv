function createElement(tag, config, parent = null) {
  const {
    text,
    imgsrc,
    myclass,
    color,
    bgcolor,
    border,
    myid,
    myhref,
    myonclick,
    dataFavorite,
    dataFavoriteText,
    dataFavoriteRemoveText,
    dataFavoriteAddClass,
    dataFavoriteRemoveClass,
  } = config || {};
  const root = document.querySelector('body');
  const element = document.createElement(tag);

  if (color) {
    element.style.color = color;
  }

  if (bgcolor) {
    element.style.backgroundColor = bgcolor;
  }

  if (myhref) {
    element.href = myhref;
  }

  if (border) {
    element.style.borderColor = border;
  }

  if (dataFavorite) {
    element.setAttribute("data-favorite", dataFavorite);
  }

  if (dataFavoriteText) {
    element.setAttribute("data-favorite-add-text", dataFavoriteText);
  }

  if (dataFavoriteRemoveText) {
    element.setAttribute("data-favorite-remove-text", dataFavoriteRemoveText);
  }

  if (dataFavoriteAddClass) {
    element.setAttribute("data-favorite-added-classes", dataFavoriteAddClass);
  }

  if (dataFavoriteRemoveClass) {
    element.setAttribute(
      "data-favorite-removed-classes",
      dataFavoriteRemoveClass
    );
  }

  if (imgsrc) {
    element.setAttribute("src", imgsrc);
  }

  if (myclass) {
    element.setAttribute("class", myclass);
  }

  if (myid) {
    element.setAttribute("id", myid);
  }

  if (myonclick) {
    element.setAttribute("onclick", myonclick);
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

export default createElement;