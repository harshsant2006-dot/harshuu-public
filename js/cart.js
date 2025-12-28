const cartBox = document.getElementById("cart");
const billBox = document.getElementById("bill");

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

let total = 0;

cart.forEach(i => {
  total += i.price;
  cartBox.innerHTML += `
    <div class="cart-item">
      <b>${i.name}</b>
      <div>₹${i.price}</div>
    </div>
  `;
});

const platform = 5;
const gst = Math.round(total * 0.05);

billBox.innerHTML = `
  <div class="bill-row"><span>Food Total</span><span>₹${total}</span></div>
  <div class="bill-row"><span>Platform Fee</span><span>₹${platform}</span></div>
  <div class="bill-row"><span>GST</span><span>₹${gst}</span></div>
  <hr>
  <div class="bill-row total"><span>Total</span><span>₹${total + platform + gst}</span></div>
`;
