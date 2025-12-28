const restaurantList = document.getElementById("restaurantList");
const searchInput = document.getElementById("searchInput");

let allRestaurants = [];

/* ===============================
   LOAD RESTAURANTS
================================ */
async function loadRestaurants() {
  try {
    const res = await fetch(API_BASE + "/restaurants");
    const json = await res.json();

    if (!json.success) return;

    // only ACTIVE restaurants for customers
    allRestaurants = json.data.filter(r => r.isActive);
    renderRestaurants(allRestaurants);
  } catch (err) {
    console.error("RESTAURANT LOAD ERROR:", err);
  }
}

/* ===============================
   RENDER UI
================================ */
function renderRestaurants(list) {
  restaurantList.innerHTML = list.map(r => `
    <div class="restaurant-card" onclick="openMenu('${r._id}')">
      <img src="${r.image}" />
      
      <div class="card-body">
        <h4>${r.name}</h4>
        <div class="meta">
          <span class="rating">⭐ 4.${Math.floor(Math.random()*5)}</span>
          <span class="time">${20 + Math.floor(Math.random()*15)}–${30 + Math.floor(Math.random()*20)} mins</span>
        </div>
      </div>
    </div>
  `).join("");
}

/* ===============================
   SEARCH
================================ */
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = allRestaurants.filter(r =>
    r.name.toLowerCase().includes(value)
  );
  renderRestaurants(filtered);
});

/* ===============================
   OPEN MENU PAGE
================================ */
function openMenu(id) {
  window.location.href = `menu.html?restaurantId=${id}`;
}

/* INIT */
loadRestaurants();
