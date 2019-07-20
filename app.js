let productContainer = document.querySelector(".products-container");
let cartBtn = document.querySelector(".cart-btn");
let cartCloseBtn = document.querySelector(".close-cart");
let cartDOM = document.querySelector(".cart");
let overlay = document.querySelector(".overlay");
let cartContainer = document.querySelector(".cart-container");

let addToCartBtns = [];
let products = [];
let cart = [];
// Cart opening and closing management
cartBtn.addEventListener("click",() => {
  cartDOM.style.transform = "translateX(1%)";
  overlay.style.display = "block"
})

cartCloseBtn.addEventListener("click", () =>{
  cartDOM.style.transform = "translateX(101%)";
  overlay.style.display = "none";
});

// Getting data from JSON file 
async function getProducts(url) {
  try {
    let result = await fetch(url);
    let data = await result.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// rendering products 
function renderProducts(arr) {
  let result = "";
  arr.forEach(product => {
    result +=
      `
        <article class="product" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}">
          </div>
          <div class="product-info">
            <h5 class="product-name">${product.name}</h5>
            <h6 class="product-price">$${product.price.toFixed(2)}</h6>
          </div>
          <button class="add-item" data-id="${product.id}"><i class="material-icons"> add_shopping_cart </i> Add to cart</button>
        </article>
        `;
  });
  productContainer.innerHTML = result;
}

// Render Cart Items

function renderCartItem(obj) {
  let result = "";
  result += `
      <div class="cart-item">
      <div class="thumbnail">
        <img src="${obj.image}" />
      </div>
      <div class="cart-item-infos">
        <h4 class="cart-item-title">${obj.name}</h4>
        <p class="cart-item-price">$${obj.price.toFixed(2)}</p>
        <a href="#" class="remove" data-id="${obj.id}">remove</a>
      </div>
      <div class="cart-item-counter">
        <i class="material-icons increase" data-id="${obj.id}"> keyboard_arrow_up </i>
        <span class="count">1</span>
        <i class="material-icons decrease" data-id="${obj.id}"> keyboard_arrow_down </i>
      </div>
    </div>
    `;
    cartContainer.innerHTML += result;
}

// Manage add to cart Buttons
function addToCartBtnsManager(arr) {
  arr.forEach(btn => {
    let id = parseInt(btn.getAttribute("data-id"));
    // Disabling buttons for items already in cart
    if (cart.find(e => e.id === id)) {
      btn.innerHTML = "In Cart";
      btn.setAttribute("disabled", "true");
    }
    // Adding products to cart onclick and disabling button
    btn.addEventListener("click", () => {
      if (cart.find(e => e.id === id) === undefined) {
        let currentProduct = products.find(e => e.id === id);
        cart.push(currentProduct);
        btn.innerHTML = "In Cart";
        btn.setAttribute("disabled", "true");
        renderCartItem(currentProduct)
      }
    });

  })
}
getProducts("products.json").then(data => {
  products = data.products;
  renderProducts(products);
  addToCartBtns = document.querySelectorAll(".add-item");
  addToCartBtnsManager(addToCartBtns);
});