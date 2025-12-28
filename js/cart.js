const cartBox = document.getElementById("cart");
const billBox = document.getElementById("bill");
const qrBox = document.getElementById("qrBox");

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

if (!cart.length) {
  cartBox.innerHTML = "Cart is empty";
  throw new Error("Empty cart");
}

let foodTotal = 0;

cart.forEach(i => {
  foodTotal += i.price;
  cartBox.innerHTML += `
    <div class="cart-item">
      <b>${i.name}</b>
      <div>₹${i.price}</div>
    </div>
  `;
});

const platformFee = 5;
const handling = 5;
const gst = Math.round(foodTotal * 0.05);
const grandTotal = foodTotal + platformFee + handling + gst;

billBox.innerHTML = `
  <div class="bill-row"><span>Food Total</span><span>₹${foodTotal}</span></div>
  <div class="bill-row"><span>Platform Fee</span><span>₹${platformFee}</span></div>
  <div class="bill-row"><span>Handling</span><span>₹${handling}</span></div>
  <div class="bill-row"><span>GST</span><span>₹${gst}</span></div>
  <hr>
  <div class="bill-row total"><span>Total</span><span>₹${grandTotal}</span></div>
`;

async function placeOrder() {
  const name = document.getElementById("custName").value.trim();
  const mobile = document.getElementById("custMobile").value.trim();

  if (!name || !mobile) {
    alert("Enter name & mobile");
    return;
  }

  const orderPayload = {
    restaurantId: cart[0].restaurantId || cart[0].rid,
    items: cart.map(i => ({
      dishId: i.id,
      quantity: 1
    })),
    customer: {
      name,
      mobile
    }
  };

  const orderRes = await apiPost("/orders", orderPayload);

  if (!orderRes.success) {
    alert("Order failed");
    return;
  }

  // Load Payment QR
  const qrRes = await apiGet("/settings/qr");

  qrBox.innerHTML = `
    <h3>Scan & Pay</h3>
    <img src="${qrRes.data.upiQrImage}" style="width:200px">
    <p>Amount: ₹${grandTotal}</p>
    <p>Order ID: ${orderRes.data.orderId}</p>
  `;

  localStorage.removeItem("cart");
}
