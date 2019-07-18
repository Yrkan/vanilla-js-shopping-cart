let productContainer = document.querySelector(".products-container");
let cartBtn = document.querySelector(".cart-btn");
let cartCloseBtn = document.querySelector(".close-cart");
let cart = document.querySelector(".cart");
let overlay = document.querySelector(".overlay");


// Cart opening and closing management
cartBtn.onclick = function() {
  cart.style.transform = "translateX(1%)";
  overlay.style.display = "block"
}

cartCloseBtn.onclick = function() {
  cart.style.transform = "translateX(101%)";
  overlay.style.display = "none"; 
}

// Getting data from JSON file 
async function getProducts(url) {
    try {
        let result = await fetch(url);
        let data = await result.json();
        return data;
    }
    catch (err) {
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
          <div class="add-item">Add to cart</div>
        </article>
        `
    });
    productContainer.innerHTML = result;
}


getProducts("products.json").then(data => renderProducts(data.products));
