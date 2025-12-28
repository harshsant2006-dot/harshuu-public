const box = document.getElementById("restaurants");

async function loadRestaurants() {
  const data = await apiGet("/restaurants");

  box.innerHTML = "";

  data.data.forEach(r => {
    box.innerHTML += `
      <div class="restaurant-card" onclick="openMenu('${r._id}')">
        <img src="${r.image}">
        <div class="restaurant-info">
          <div class="restaurant-name">${r.name}</div>
          <span class="badge ${r.isOpen ? 'open' : 'closed'}">
            ${r.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>
    `;
  });
}

function openMenu(id) {
  location.href = "menu.html?rid=" + id;
}

loadRestaurants();
