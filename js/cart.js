// ===============================
// HARSHUU – CART JS
// ===============================

const cartItemsDiv = document.getElementById("cartItems");

const itemTotalEl = document.getElementById("itemTotal");
const gstEl = document.getElementById("gstAmount");
const deliveryEl = document.getElementById("deliveryCharge");
const platformFeeEl = document.getElementById("platformFee");
const grandTotalEl = document.getElementById("grandTotal");

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");

const restaurantId = localStorage.getItem("harshuu_restaurant_id");

const GST_PERCENT = 5;
const DELIVERY_CHARGE = 30;
const PLATFORM_FEE = 10;

// ===============================
// LOAD CART
// ===============================
document.addEventListener("DOMContentLoaded", loadCart);

function getCart() {
  return JSON.parse(localStorage.getItem("harshuu_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("harshuu_cart", JSON.stringify(cart));
  loadCart();
}

// ===============================
// RENDER CART
// ===============================
function loadCart() {
  const cart = getCart();

  if (!cart.length) {
    cartItemsDiv.innerHTML =
      "<p style='padding:16px;color:#aaa'>Cart is empty</p>";
    return;
  }

  let itemTotal = 0;

  cartItemsDiv.innerHTML = cart
    .map(item => {
      const total = item.price * item.quantity;
      itemTotal += total;

      return `
        <div class="cart-row">
          <img src="${item.image}">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price} × ${item.quantity}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const gst = +(itemTotal * GST_PERCENT / 100).toFixed(2);
  const grand =
    itemTotal + gst + DELIVERY_CHARGE + PLATFORM_FEE;

  itemTotalEl.innerText = `₹${itemTotal}`;
  gstEl.innerText = `₹${gst}`;
  deliveryEl.innerText = `₹${DELIVERY_CHARGE}`;
  platformFeeEl.innerText = `₹${PLATFORM_FEE}`;
  grandTotalEl.innerText = `₹${grand}`;
}

// ===============================
// PLACE ORDER
// ===============================
async function placeOrder() {
  const cart = getCart();

  if (!cart.length) {
    alert("Cart empty");
    return;
  }

  if (!custName.value || !custPhone.value || !custAddress.value) {
    alert("Please fill all details");
    return;
  }

  const items = cart.map(i => ({
    dishId: i.dishId,
    quantity: i.quantity
  }));

  const payload = {
    restaurantId,
    items,
    customer: {
      name: custName.value,
      phone: custPhone.value,
      address: custAddress.value
    },
    distanceKm: 2
  };

  try {
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

    sendWhatsAppMessage(json.data.invoice.grandTotal);

    localStorage.removeItem("harshuu_cart");
    alert("Order placed successfully");
    window.location.href = "index.html";

  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

// ===============================
// WHATSAPP MESSAGE
// ===============================
function sendWhatsAppMessage(total) {
  const text =
`HARSHUU ORDER
Name: ${custName.value}
Phone: ${custPhone.value}
Address: ${custAddress.value}
Total Amount: ₹${total}`;

  const url =
    "https://wa.me/8390454553?text=" +
    encodeURIComponent(text);

  window.open(url, "_blank");
}
