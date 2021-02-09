const totalCartValue = 0;
const storageArray = JSON.parse(localStorage.getItem('itensOnCart')) || [];

const sum = (price) => {
  if (price) {
    const totalBefore = parseFloat(document.querySelector('.total').innerText.split('$')[1]);
    const totalAfter = price + totalBefore;
    document.querySelector('.total').innerText = `Total: $${totalAfter.toFixed(2)}`;
  }
}

const makeSearchUrl = (string) => {
  return `https://api.mercadolibre.com/sites/MLB/search?q=$${string}`;
}

const createImg = (thumbnail) => {
  const img = document.createElement('img');
  img.src = thumbnail;
  img.className = 'item-image';
  return img;
}

const creatTitle = (title) => {
  const paragraph = document.createElement('p');
  paragraph.innerText = title;
  paragraph.className = 'item-title';
  return paragraph;
}

const createPrice = (price) => {
  const itemPrice = document.createElement('p');
  const floatPrice = parseFloat(price).toFixed(2);
  itemPrice.innerText = `R$ ${floatPrice}`;
  itemPrice.className = 'item-price';
  return itemPrice;
}


const createId = (id) => {
  const idParagraph = document.createElement('p');
  idParagraph.className = 'id-hidden';
  idParagraph.innerText = id;
  idParagraph.style.display = 'none';
  return idParagraph;
}

// Li items Cart

const makeItemhUrl = (string) => {
  return `https://api.mercadolibre.com/items/${string}`;
}

const createLiImg = (thumbnail) => {
  const liImg = document.createElement('img');
  liImg.src = thumbnail;
  liImg.className = 'li-image';
  return liImg;
}

const subtraction = (div) => {
  const totalBefore = parseFloat(document.querySelector('.total').innerText.split('$')[1]);
  const value = parseFloat(div.querySelector('.title-and-price').querySelector('.item-price').innerText.split(' ')[1]);
  const totalAfter = totalBefore - value;
  document.querySelector('.total').innerText = `Total: $${totalAfter.toFixed(2)}`;
}

const removeFromLocalStorage = (string) => {

  for(let index = 0; index < storageArray.length; index += 1) {
    if (storageArray[index].thumbnail === string) {
      storageArray.splice(index, 1);
      localStorage.setItem('itensOnCart', JSON.stringify(storageArray));
      break;
    }
  }
}

const removeLi = (event) => {
  const liElement = event.target.parentNode;
  if(liElement.className === 'li-item') {
    removeFromLocalStorage(liElement.querySelector('.li-image').getAttribute("src"));
    console.log(liElement.querySelector('.li-image').getAttribute("src"));
    subtraction(liElement);
    liElement.remove();
  } else if (liElement.className === 'title-and-price') {
    removeFromLocalStorage(liElement.parentNode.querySelector('.li-image').getAttribute("src"));
    subtraction(liElement.parentNode);
    liElement.parentNode.remove();
  }
}

const saveOnLocalStorage = (thumbnail, title, price) => {
  const obj = {};
  obj['thumbnail'] = thumbnail;
  obj['title'] = title;
  obj['price'] = price;
  storageArray.push(obj);
  localStorage.setItem('itensOnCart', JSON.stringify(storageArray));
}

// Fiz essas duas cópias para evitar duplicação no local storage devido a FN saveOnLocalStorage()
const createLi2 = (thumbnail, title, price) => {
  sum(price);
  const liItem = document.createElement('li');
  liItem.className = 'li-item';
  const liDiv = document.createElement('div');
  liDiv.className = 'title-and-price';
  liDiv.appendChild(creatTitle(title));
  liDiv.appendChild(createPrice(price));
  liItem.appendChild(createLiImg(thumbnail));
  liItem.appendChild(liDiv);
  liItem.addEventListener('click', removeLi);
  return liItem;
}

const appendLi2 = (object) => {
  const ol = document.querySelector('ul');
  const { thumbnail, title, price } = object;
  const li = createLi2(thumbnail, title, price);
  ol.appendChild(li)
}


const createLi = (thumbnail, title, price) => {
  saveOnLocalStorage(thumbnail, title, price);
  sum(price);
  const liItem = document.createElement('li');
  liItem.className = 'li-item';
  const liDiv = document.createElement('div');
  liDiv.className = 'title-and-price';
  liDiv.appendChild(creatTitle(title));
  liDiv.appendChild(createPrice(price));
  liItem.appendChild(createLiImg(thumbnail));
  liItem.appendChild(liDiv);
  liItem.addEventListener('click', removeLi);
  return liItem;
}

const appendLi = (object) => {
  const ol = document.querySelector('ul');
  const { thumbnail, title, price } = object;
  const li = createLi(thumbnail, title, price);
  ol.appendChild(li)
}

const selectProductToBuy = () => {
  const arrayOfProducts = document.querySelectorAll('.item-box');
  arrayOfProducts.forEach(item => {
    item.addEventListener('click', function() {
      fetch(makeItemhUrl(item.querySelector('.id-hidden').innerText))
      .then(result => result.json())
      .then(result => appendLi(result));
    });
  });
}

const createItemDiv = (id, thumbnail, title, price) => {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item-box';
  itemDiv.appendChild(createImg(thumbnail));
  itemDiv.appendChild(createPrice(price));
  itemDiv.appendChild(creatTitle(title));
  itemDiv.appendChild(createId(id));
  return itemDiv;
}

const appendItem = (object) => {
  const { id, thumbnail, title, price } = object;
  const itemSection = document.querySelector('.items');
  const item = createItemDiv(id, thumbnail, title, price);
  itemSection.appendChild(item);
}

const itemstLoop = (arrayOfItems) => {
  arrayOfItems.forEach(element => {
    appendItem(element);
  });
}

const appendLoading = () => {
  const loadingParent = document.querySelector('.items');
  const loadingGif = document.createElement('img');
  loadingGif.className = 'loading';
  loadingGif.src = 'loading.gif';
  loadingParent.appendChild(loadingGif);
}

const searchFetch = async () => {
  clearFoundItens();
  appendLoading();
  const arrayOfItems = await fetch(makeSearchUrl(document.querySelector('.search-field').value))
  .then(result => result.json())
  .then(result => result.results);
  clearFoundItens();
  itemstLoop(arrayOfItems);
  selectProductToBuy();
}

const clearFoundItens = () => {
  const itensDiv = document.querySelector('.items');
  while(itensDiv.hasChildNodes()) {
    itensDiv.removeChild(itensDiv.lastChild);
  }
}

const search = () => {
  const searchBtn = document.querySelector('.fa-search');
  searchBtn.addEventListener('click', function() {
    searchFetch();
  });
}

const clearCart = () => {
  const clearBtn = document.querySelector('.clear-cart');
  clearBtn.addEventListener('click', function() {
    const ulElement = document.querySelector('.itens-list');
    console.log('aqui');
    while (ulElement.hasChildNodes()) {
      ulElement.removeChild(ulElement.lastChild);
    }
    localStorage.removeItem('itensOnCart');
    document.querySelector('.total').innerText = 'Total: $0.00'
  });
}

const loadCartItensFromLocalStorage = () => {
  storageArray.forEach(element => {
    appendLi2(element);
  });
}

window.onload = function onload() {
  search();
  clearCart();
  loadCartItensFromLocalStorage();
}
