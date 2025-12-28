const rid = new URLSearchParams(location.search).get("rid");
const menuBox = document.getElementById("menu");
const banner = document.getElementById("banner");

async function loadMenu() {
  const dishes = await apiGet("/dishes/restaurant/" + rid);
  const rest = await apiGet("/restaurants");

  const r = rest.data.find(x => x._id === rid);
  banner.src = r.image;

  menuBox.innerHTML = "";

  dishes.data.forEach(d => {
    menuBox.innerHTML += `
      <div class="dish-card">
        <img src="${d.image}">
        <div>
          <div class="dish-name">${d.name}</div>
          <div class="${d.type === 'VEG' ? 'veg' : 'nonveg'}">${d.type}</div>
          <div>₹${d.price}</div>
          <button class="add-btn" onclick="addToCart('${d._id}', '${d.name}', ${d.price})">
            ADD
          </button>
        </div>
      </div>
    `;
  });
}

function addToCart(id, name, price) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

loadMenu();
