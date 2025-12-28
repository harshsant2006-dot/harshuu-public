const dishList = document.getElementById("dishList");
const restaurantName = document.getElementById("restaurantName");
const restaurantImage = document.getElementById("restaurantImage");
const restaurantAddress = document.getElementById("restaurantAddress");

const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("restaurantId");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================================
   LOAD RESTAURANT INFO
================================ */
async function loadRestaurant() {
  const res = await fetch(API_BASE + `/restaurants/${restaurantId}`);
  const json = await res.json();

  if (!json.success) return;

  restaurantName.innerText = json.data.name;
  restaurantImage.src = json.data.image;
  restaurantAddress.innerText = json.data.address || "";
}

/* ================================
   LOAD DISHES
================================ */
async function loadDishes() {
  const res = await fetch(
    API_BASE + `/dishes/restaurant/${restaurantId}`
  );
  const json = await res.json();

  if (!json.success) return;

  dishList.innerHTML = json.data.map(d => `
    <div class="dish-card">
      <img src="${d.image}" />
      <div class="dish-info">
        <h4>${d.name}</h4>
        <span class="type ${d.type === "VEG" ? "veg" : "nonveg"}">
          ${d.type}
        </span>
        <p>₹${d.price}</p>
      </div>
      <button onclick="addToCart('${d._id}','${d.name}',${d.price},'${d.image}')">
        ADD
      </button>
    </div>
  `).join("");
}

/* ================================
   CART LOGIC
================================ */
function addToCart(id, name, price, image) {
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBar();
}

function updateCartBar() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  if (totalQty > 0) {
    cartBar.classList.remove("hidden");
    cartCount.innerText = `${totalQty} item${totalQty > 1 ? "s" : ""}`;
  } else {
    cartBar.classList.add("hidden");
  }
}

function goToCart() {
  window.location.href = "cart.html";
}

/* INIT */
loadRestaurant();
loadDishes();
updateCartBar();
