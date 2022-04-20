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
    height,
    value,
    name,
    checked,
    type,
    htmlFor,
    min,
    max,
    style, 
    width,
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

  if (height) {
    element.setAttribute('height', height);
  }

  if (value) {
    element.setAttribute('value', value);
  }

  if (name) {
    element.setAttribute('name', name);
  }

  if (checked == true) {
    element.setAttribute('checked', 'checked');
  }

  if (width) {
    element.setAttribute('width', width);
  }

  if (min) {
    element.setAttribute('min', min);
  }

  if (max) {
    element.setAttribute('max', max);
  }

  if (style) {
    Object.keys(style).forEach((prop) => {
      element.style[prop] = style[prop]
    })
  }

  if (type) {
    element.setAttribute('type', type)
  }

  if (htmlFor) {
    element.setAttribute('for', htmlFor)
  }

  if (!parent) {
    root.appendChild(element);
  } else {
    parent.appendChild(element);
  }
  return element;
}

export default createElement;