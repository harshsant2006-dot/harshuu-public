// ===============================
// HARSHUU – MENU JS
// ===============================

const restaurantId = localStorage.getItem("harshuu_restaurant_id");

const restaurantName = document.getElementById("restaurantName");
const restaurantImage = document.getElementById("restaurantImage");
const dishList = document.getElementById("dishList");

const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

if (!restaurantId) {
  alert("Restaurant not selected");
  window.location.href = "index.html";
}

// ===============================
// LOAD DATA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadRestaurant();
  loadDishes();
  updateCartBar();
});

// ===============================
// LOAD RESTAURANT
// ===============================
async function loadRestaurant() {
  try {
    const res = await fetch(API_BASE + `/restaurants/${restaurantId}`);
    const json = await res.json();

    if (!json.success) return;

    restaurantName.innerText = json.data.name;
    restaurantImage.src = json.data.image;
  } catch (e) {
    console.error(e);
  }
}

// ===============================
// LOAD DISHES
// ===============================
async function loadDishes() {
  try {
    const res = await fetch(
      API_BASE + `/dishes/restaurant/${restaurantId}`
    );
    const json = await res.json();

    if (!json.success || !json.data.length) {
      dishList.innerHTML =
        "<p style='padding:16px;color:#aaa'>No dishes available</p>";
      return;
    }

    renderDishes(json.data);
  } catch (e) {
    console.error(e);
    dishList.innerHTML =
      "<p style='padding:16px;color:red'>Failed to load dishes</p>";
  }
}

// ===============================
// RENDER DISHES
// ===============================
function renderDishes(dishes) {
  const cart = getCart();

  dishList.innerHTML = dishes
    .map(dish => {
      const itemInCart = cart.find(i => i.dishId === dish._id);

      return `
        <div class="dish-card">
          <img src="${dish.image}" alt="${dish.name}">

          <div class="dish-info">
            <h4>${dish.name}</h4>
            <p class="${dish.type === "VEG" ? "veg" : "nonveg"}">
              ${dish.type}
            </p>
            <strong>₹${dish.price}</strong>
          </div>

          <div class="dish-action">
            ${
              itemInCart
                ? `<button onclick="removeFromCart('${dish._id}')">−</button>
                   <span>${itemInCart.quantity}</span>
                   <button onclick="addToCart('${dish._id}','${dish.name}',${dish.price},'${dish.image}')">+</button>`
                : `<button onclick="addToCart('${dish._id}','${dish.name}',${dish.price},'${dish.image}')">
                     ADD
                   </button>`
            }
          </div>
        </div>
      `;
    })
    .join("");
}

// ===============================
// CART LOGIC
// ===============================
function getCart() {
  return JSON.parse(localStorage.getItem("harshuu_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("harshuu_cart", JSON.stringify(cart));
  updateCartBar();
}

function addToCart(id, name, price, image) {
  let cart = getCart();
  const item = cart.find(i => i.dishId === id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      dishId: id,
      name,
      price,
      image,
      quantity: 1
    });
  }

  saveCart(cart);
  loadDishes();
}

function removeFromCart(id) {
  let cart = getCart();
  const item = cart.find(i => i.dishId === id);

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.dishId !== id);
  }

  saveCart(cart);
  loadDishes();
}

// ===============================
// CART BAR
// ===============================
function updateCartBar() {
  const cart = getCart();

  if (cart.length > 0) {
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartBar.style.display = "flex";
    cartCount.innerText = `${totalQty} item`;
  } else {
    cartBar.style.display = "none";
  }
}
