// ===============================
// HARSHUU – Menu Page Logic
// ===============================

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("rid");

const menuBox = document.getElementById("menu");
const bannerImg = document.getElementById("banner");
const restNameBox = document.getElementById("restaurantName");
const statusBox = document.getElementById("restaurantStatus");

// ===============================
// LOAD RESTAURANT + MENU
// ===============================
async function loadMenu() {
  if (!restaurantId) {
    menuBox.innerHTML = "Restaurant not found";
    return;
  }

  try {
    // 1️⃣ Fetch restaurant list
    const restRes = await apiGet("/restaurants");
    const restaurant = restRes.data.find(r => r._id === restaurantId);

    if (!restaurant) {
      menuBox.innerHTML = "Restaurant not found";
      return;
    }

    // 2️⃣ Set banner & details
    bannerImg.src = restaurant.image;
    restNameBox.innerText = restaurant.name;
    statusBox.innerText = restaurant.status === "OPEN" ? "OPEN" : "CLOSED";
    statusBox.className =
      restaurant.status === "OPEN" ? "open-badge" : "closed-badge";

    // 3️⃣ Fetch dishes
    const dishRes = await apiGet(
      "/dishes/restaurant/" + restaurantId
    );

    menuBox.innerHTML = "";

    if (!dishRes.data || dishRes.data.length === 0) {
      menuBox.innerHTML = "No dishes available";
      return;
    }

    // 4️⃣ Render dishes
    dishRes.data.forEach(d => {
      menuBox.innerHTML += `
        <div class="dish-card">
          <img src="${d.image}" alt="${d.name}">

          <div class="dish-info">
            <div class="dish-name">${d.name}</div>

            <div class="dish-meta">
              <span class="${
                d.type === "VEG" ? "veg-badge" : "nonveg-badge"
              }">
                ${d.type}
              </span>
              <span class="price">₹${d.price}</span>
            </div>

            <button
              class="add-btn"
              onclick="addToCart(
                '${d._id}',
                '${d.name}',
                ${d.price},
                '${restaurantId}'
              )"
            >
              ADD
            </button>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("MENU LOAD ERROR:", err);
    menuBox.innerHTML = "Server error";
  }
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(dishId, name, price, restaurantId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // ❗ Only one restaurant allowed in cart
  if (cart.length && cart[0].restaurantId !== restaurantId) {
    if (!confirm("Cart contains items from another restaurant. Clear cart?")) {
      return;
    }
    cart = [];
  }

  const existing = cart.find(i => i.dishId === dishId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      dishId,
      name,
      price,
      qty: 1,
      restaurantId
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

// ===============================
// INIT
// ===============================
loadMenu();
