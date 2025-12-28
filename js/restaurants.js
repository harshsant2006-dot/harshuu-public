// ===============================
// HARSHUU – Home Restaurants JS
// ===============================

const restaurantList = document.getElementById("restaurantList");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

// Load restaurants on page load
document.addEventListener("DOMContentLoaded", loadRestaurants);

// ===============================
// FETCH & RENDER RESTAURANTS
// ===============================
async function loadRestaurants() {
  try {
    const res = await fetch(API_BASE + "/restaurants");
    const json = await res.json();

    if (!json.success || !json.data.length) {
      restaurantList.innerHTML =
        "<p style='padding:16px;color:#aaa'>No restaurants available</p>";
      return;
    }

    renderRestaurants(json.data);
  } catch (err) {
    console.error(err);
    restaurantList.innerHTML =
      "<p style='padding:16px;color:red'>Failed to load restaurants</p>";
  }
}

// ===============================
// RENDER CARDS
// ===============================
function renderRestaurants(restaurants) {
  restaurantList.innerHTML = restaurants
    .filter(r => r.isActive) // only active restaurants
    .map(r => `
      <div class="restaurant-card" onclick="openMenu('${r._id}')">

        <img src="${r.image}" alt="${r.name}">

        <div class="offer">FLAT ₹100 OFF</div>

        <div class="restaurant-info">
          <h4>${r.name}</h4>

          <div class="meta">
            <span class="rating">★ 4.1</span>
            <span>25–30 mins</span>
          </div>
        </div>

      </div>
    `)
    .join("");
}

// ===============================
// OPEN MENU PAGE
// ===============================
function openMenu(restaurantId) {
  localStorage.setItem("harshuu_restaurant_id", restaurantId);
  window.location.href = "menu.html";
}

// ===============================
// CART BAR (BASIC)
// ===============================
function updateCartBar() {
  const cart = JSON.parse(localStorage.getItem("harshuu_cart") || "[]");

  if (cart.length > 0) {
    cartBar.style.display = "flex";
    cartCount.innerText = `${cart.length} item`;
  } else {
    cartBar.style.display = "none";
  }
}

updateCartBar();
