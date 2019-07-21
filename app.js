const productContainer = document.querySelector(".products-container");
const cartBtn = document.querySelector(".cart-btn");
const cartCloseBtn = document.querySelector(".close-cart");
const cartDOM = document.querySelector(".cart");
const overlay = document.querySelector(".overlay");
const cartContainer = document.querySelector(".cart-container");
const cartItemCountDOM = document.querySelector(".items-count");
const clearCartBtnDOM = document.querySelector(".clear-cart");

let addToCartBtns = [];
let products = [];
let cart = [];

// Cart opening and closing management
function openCart() {
  cartDOM.style.transform = "translateX(1%)";
  overlay.style.display = "block"
}
function closeCart() {
  cartDOM.style.transform = "translateX(101%)";
  overlay.style.display = "none";
}
cartBtn.addEventListener("click",() => {
  openCart();
})

cartCloseBtn.addEventListener("click", () =>{
  closeCart();
});


// Getting data from JSON file 
async function getProducts(url) {
  try {
    const result = await fetch(url);
    const data = await result.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//Local storage functions
function setCartLocal(arr) {
  localStorage.setItem("cart", JSON.stringify(arr));
}
function getCartLocal() {
  return JSON.parse(localStorage.getItem("cart"));
}

//Manage cart items count
function cartItemCount(arr) {
  cartItemCountDOM.innerHTML = arr.length;
}
// Rendering products 
function renderProducts(arr) {
  let result = "";
  arr.forEach(product => {
    const {image, name, price,id} = product;
    result +=
      `
        <article class="product" data-id="${id}">
          <div class="product-image">
            <img src="${image}">
          </div>
          <div class="product-info">
            <h5 class="product-name">${name}</h5>
            <h6 class="product-price">$${price.toFixed(2)}</h6>
          </div>
          <button class="add-item" data-id="${id}"><i class="material-icons"> add_shopping_cart </i> Add to cart</button>
        </article>
        `;
  });
  productContainer.innerHTML = result;
}

// Rendering Cart Items
function renderCartItem(obj) {
  let result = "";
  const {image, name, price,id} = obj;
  result += `
      <div class="cart-item">
      <div class="thumbnail">
        <img src="${image}" />
      </div>
      <div class="cart-item-infos">
        <h4 class="cart-item-title">${name}</h4>
        <p class="cart-item-price">$${price.toFixed(2)}</p>
        <a href="#" class="remove" data-id="${id}">remove</a>
      </div>
      <div class="cart-item-counter">
        <i class="material-icons increase" data-id="${id}"> keyboard_arrow_up </i>
        <span class="count">1</span>
        <i class="material-icons decrease" data-id="${id}"> keyboard_arrow_down </i>
      </div>
    </div>
    `;
    cartContainer.innerHTML += result;
}

// Managing clear cart button
clearCartBtnDOM.addEventListener("click", () => {
  // clearing the cart variable
  cart = [];
  // clearing the local storage cart value
  setCartLocal(cart);
  // clearing the cart DOM
  cartContainer.innerHTML = "";
  // updating the cart Item count to zero
  cartItemCount(cart);
  // reseting all add to cart buttons
  addToCartBtns.forEach(btn => {
    btn.innerHTML = '<i class="material-icons"> add_shopping_cart </i> Add to cart';
    btn.removeAttribute("disabled");

  })
  // closing the cart
  closeCart();
})
// Managing add to cart Buttons
function addToCartBtnsManager(arr) {
  arr.forEach(btn => {
    const id = parseInt(btn.getAttribute("data-id"));
    const currentProduct = products.find(e => e.id === id);
    // Disabling buttons for items already in cart
    if (cart.find(e => e.id === id)) {
      btn.innerHTML = "In Cart";
      btn.setAttribute("disabled", "true");
      renderCartItem(currentProduct);
    }
    // Adding products to cart onclick and disabling button
    btn.addEventListener("click", () => {
      if (cart.find(e => e.id === id) === undefined) {
        cart = [...cart, currentProduct];
        btn.innerHTML = "In Cart";
        btn.setAttribute("disabled", "disabled");
        renderCartItem(currentProduct);
        //update the local storage cart value
        setCartLocal(cart);
        // update the item count value
        cartItemCount(cart);
        //opening the cart
        openCart();
      }
    });

  })
}
getProducts("products.json").then(data => {
  // Setting up the cart from local storage
  cart = getCartLocal() || [];
  // Setting up the cart items count value
  cartItemCount(cart);
  // Getting products from JSON file
  products = data.products;
  // Rendering the products to the DOM
  renderProducts(products);
  // Adding "add to cart Buttons" to the a vairable
  addToCartBtns = document.querySelectorAll(".add-item");
  // Setting up each button with an event listener
  addToCartBtnsManager(addToCartBtns);
});