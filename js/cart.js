const cartItemsEl = document.getElementById("cartItems");

const foodTotalEl = document.getElementById("foodTotal");
const platformFeeEl = document.getElementById("platformFee");
const handlingChargeEl = document.getElementById("handlingCharge");
const deliveryChargeEl = document.getElementById("deliveryCharge");
const gstAmountEl = document.getElementById("gstAmount");
const grandTotalEl = document.getElementById("grandTotal");

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let restaurantId = localStorage.getItem("restaurantId");

/* ===============================
   LOAD PAYMENT SETTINGS
================================ */
let SETTINGS = {
  PLATFORM_FEE: 0,
  HANDLING_CHARGE: 0,
  DELIVERY_PER_KM: 0,
  GST_PERCENT: 0
};

async function loadSettings() {
  const res = await fetch(API_BASE + "/settings");
  const json = await res.json();
  if (!json.success) return;

  SETTINGS.PLATFORM_FEE = json.data.platformFee;
  SETTINGS.HANDLING_CHARGE = json.data.handlingCharge;
  SETTINGS.DELIVERY_PER_KM = json.data.deliveryFeePerKm;
  SETTINGS.GST_PERCENT = json.data.gstPercentage;

  renderCart();
}

/* ===============================
   RENDER CART
================================ */
function renderCart() {
  let foodTotal = 0;

  cartItemsEl.innerHTML = cart.map(item => {
    foodTotal += item.price * item.qty;
    return `
      <div class="cart-row">
        <img src="${item.image}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price} × ${item.qty}</p>
        </div>
      </div>
    `;
  }).join("");

  const gst = Number(((foodTotal * SETTINGS.GST_PERCENT) / 100).toFixed(2));
  const delivery = SETTINGS.DELIVERY_PER_KM;
  const grand =
    foodTotal +
    gst +
    SETTINGS.PLATFORM_FEE +
    SETTINGS.HANDLING_CHARGE +
    delivery;

  foodTotalEl.innerText = "₹" + foodTotal;
  platformFeeEl.innerText = "₹" + SETTINGS.PLATFORM_FEE;
  handlingChargeEl.innerText = "₹" + SETTINGS.HANDLING_CHARGE;
  deliveryChargeEl.innerText = "₹" + delivery;
  gstAmountEl.innerText = "₹" + gst;
  grandTotalEl.innerText = "₹" + grand;
}

/* ===============================
   PLACE ORDER
================================ */
async function placeOrder() {
  if (!custName.value || !custPhone.value || !custAddress.value) {
    alert("Please fill all customer details");
    return;
  }

  const items = cart.map(i => ({
    dishId: i.id,
    quantity: i.qty
  }));

  const payload = {
    restaurantId,
    items,
    customer: {
      name: custName.value,
      phone: custPhone.value,
      address: custAddress.value
    },
    distanceKm: 1
  };

  const res = await fetch(API_BASE + "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!json.success) {
    alert(json.message || "Order failed");
    return;
  }

  // ===============================
  // WHATSAPP MESSAGE
  // ===============================
  let msg = `*HARSHUU ORDER*\n\n`;
  cart.forEach(i => {
    msg += `${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`;
  });
  msg += `\n*Total Payable: ${grandTotalEl.innerText}*\n`;
  msg += `\nName: ${custName.value}\nPhone: ${custPhone.value}\nAddress: ${custAddress.value}`;

  window.location.href =
    `https://wa.me/8390454553?text=` + encodeURIComponent(msg);

  localStorage.removeItem("cart");
}

/* INIT */
loadSettings();
