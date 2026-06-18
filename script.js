let products = [];

async function loadProducts() {
  try {
const res = await fetch("http://localhost:5000/products");
  products = await res.json();

renderProducts(products);
renderHomeSections();

  } catch (err) {
    console.error("Error loading products:", err);
  }
}



/* =========================
   ELEMENTS
========================= */

const productContainer =
document.getElementById('productContainer');

const cartItems =
document.getElementById('cartItems');

const totalPrice =
document.getElementById('totalPrice');

const cartCount =
document.getElementById('cartCount');

/* =========================
   CART STORAGE
========================= */

let cart =
JSON.parse(localStorage.getItem('cart')) || [];

let discount = 0;

let wishlist =
JSON.parse(localStorage.getItem('wishlist')) || [];

/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price){

return new Intl.NumberFormat(
'en-IN',
{
style:'currency',
currency:'INR'
}
).format(price);

}

/* =========================
   SAVE CART
========================= */

function saveCart(){

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

}

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(items){

if(!productContainer) return;

if(items.length === 0){

productContainer.innerHTML =
`
<h2 style="
text-align:center;
padding:40px;
color:#666;
">
No Products Found 😔
</h2>
`;

return;
}

let html = '';

items.forEach(product=>{

html += `

<div class="card">

<div class="badge">
${product.badge}
</div>

<img
class="product-image"
src="${product.image}"
alt="${product.name}"
loading="lazy"
>

<div class="card-content">

<p>${product.desc}</p>

<div style="
color:#ff9800;
font-size:20px;
margin:10px 0;
">
${product.rating}
</div>

<div class="price">
${formatPrice(product.price)}
</div>

<button
class="wishlist-btn"
onclick='addToWishlist(
${JSON.stringify(product.name)},
${JSON.stringify(product.image)},
${product.price}
)'
>
❤️ Wishlist
</button>

<button
class="add-to-cart"
onclick='addToCart(
${JSON.stringify(product.name)},
${product.price},
${JSON.stringify(product.image)}
)'
>
Add To Cart
</button>

<button
class="buy-now"
onclick='buyNow(
${JSON.stringify(product.name)},
${product.price},
${JSON.stringify(product.image)}
)'
>
Buy Now
</button>

<button
onclick='openReview(
"${product._id}",
"${product.name}"
)'
>
⭐ Review
</button>

</div>
</div>

`;

});

productContainer.innerHTML = html;
}


function renderSection(id,data){

const container =
document.getElementById(id);

if(!container) return;

let html = "";

data.forEach(product=>{

html += `
<div class="home-card">
<img
src="${product.image}"
style="
width:100%;
height:180px;
object-fit:contain;
"
>

<h3>${product.name}</h3>

<p>${formatPrice(product.price)}</p>

<button onclick='addToCart(
"${product.name}",
${product.price},
"${product.image}"
)'>
Add To Cart
</button>

</div>
`;

});

container.innerHTML = html;

}

function renderHomeSections(){

renderSection(
"bestSellerContainer",
products.slice(0,4)
);

renderSection(
"newArrivalContainer",
products.slice(4,8)
);

renderSection(
"recommendedContainer",
products.slice(8,12)
);

}

/* =========================
   ADD TO CART
========================= */

function addToCart(name,price,image){

const item =
cart.find(i => i.name === name);

if(item){

item.quantity++;

}else{

cart.push({
name,
price,
image,
quantity:1
});

}

saveCart();

updateCart();

showToast('✅ Product Added');

}

/* =========================
   BUY NOW
========================= */

async function buyNow(name, price, image) {

  cart = [{
    name,
    price,
    image,
    quantity: 1
  }];

  updateCart();

  openCheckout();
}

/* =========================
   UPDATE CART
========================= */

function updateCart(){

if(!cartItems) return;

cartItems.innerHTML = '';

let total = 0;
let count = 0;

let gst = 0;
let delivery = 40;
grandTotal = 0;

if(cart.length === 0){

cartItems.innerHTML =
`
<p style="
text-align:center;
padding:30px;
font-size:18px;
">
Cart Empty 🛒
</p>
`;

totalPrice.innerText =
'Total: ₹0';

cartCount.innerText = '0';

return;

}

let html = '';

cart.forEach((item,index)=>{

const itemTotal =
Number(item.price || 0) *
Number(item.quantity || 1);

total += itemTotal;

count += Number(item.quantity || 1);


html += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:15px;
box-shadow:0 4px 15px rgba(0,0,0,0.1);
border:1px solid #eee;
">

<img
src="${item.image}"
alt="${item.name}"
style="
width:100%;
height:120px;
object-fit:contain;
background:#fff;
border-radius:10px;
padding:5px;
"
>

<h4>${item.name}</h4>

<p>Qty: ${item.quantity}</p>

<p>Total: ${formatPrice(itemTotal)}</p>

<div style="
display:flex;
gap:10px;
margin-top:10px;
flex-wrap:wrap;
">

<button onclick="increaseQty(${index})">
+
</button>

<button onclick="decreaseQty(${index})">
-
</button>

<button onclick="removeItem(${index})">
Remove
</button>

</div>

</div>

`;

});

cartItems.innerHTML = html;

cartCount.innerText = count;

if(total >= 499){
   delivery = 0;
}if(total >= 499){
   delivery = 0;
}

gst = total * 0.18;
let discountAmount =
(total * discount) / 100;

grandTotal =
total + gst + delivery - discountAmount;

totalPrice.innerHTML = `
Subtotal: ${formatPrice(total)} <br>
GST (18%): ${formatPrice(gst)} <br>
Discount: ₹${discountAmount.toFixed(2)} <br>
Delivery: ${
  delivery === 0
  ? 'FREE DELIVERY 🎉'
  : formatPrice(delivery)
}
<br><br>
<strong>Grand Total: ${formatPrice(grandTotal)}</strong>
`;

saveCart();

}

/* =========================
   INCREASE QTY
========================= */

function increaseQty(index){

if(!cart[index]) return;

cart[index].quantity++;

updateCart();

}

/* =========================
   DECREASE QTY
========================= */

function decreaseQty(index){

if(!cart[index]) return;

if(cart[index].quantity > 1){

cart[index].quantity--;

}else{

cart.splice(index,1);

}

updateCart();

}

/* =========================
   REMOVE ITEM
========================= */

function removeItem(index){

if(!cart[index]) return;

cart.splice(index,1);

updateCart();

showToast('❌ Item Removed');

}

/* =========================
   OPEN CART
========================= */

function openCart(){

document
.getElementById('cartSidebar')
.classList.add('active');

document
.getElementById('overlay')
.classList.add('active');

}

/* =========================
   CLOSE CART
========================= */

function closeCart(){

document
.getElementById('cartSidebar')
.classList.remove('active');

document
.getElementById('overlay')
.classList.remove('active');

}

/* =========================
   OPEN CHECKOUT
========================= */

function openCheckout(){

if(cart.length === 0){

showToast('🛒 Cart Empty');

return;

}

document
.getElementById('checkoutModal')
.classList.add('active');

document
.getElementById('overlay')
.classList.add('active');

}

/* =========================
   CLOSE CHECKOUT
========================= */

function closeCheckout(){

document
.getElementById('checkoutModal')
.classList.remove('active');

document
.getElementById('overlay')
.classList.remove('active');

}

/* =========================
   GET PAYMENT METHOD
========================= */

function getSelectedPayment(){

const selected =
document.querySelector(
'input[name="payment"]:checked'
);

return selected
? selected.value
: 'COD';

}

async function placeOrder(){

console.log("Checkout Clicked");

const customerName =
document.getElementById("name").value;

const customerAddress =
document.getElementById("address").value;

alert("Name Value = " + customerName);
alert("Address Value = " + customerAddress);

console.log(customerName);
console.log(customerAddress);

  if(!customerName || !customerAddress){
    showToast("Enter Name & Address");
    return;
  }

const paymentMethod =
document.querySelector(
'input[name="payment"]:checked'
)?.value;

alert("Payment Method = " + paymentMethod);
console.log(paymentMethod);

if(paymentMethod === "UPI"){
  alert("Pehle Open Google Pay par click karo");
  return;
}

  try{

    if(!localStorage.getItem("userLoggedIn")){

alert("Please Login First");

window.location.href = "login.html";

return;

}

const response = await fetch(
  "http://localhost:5000/place-order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
   body: JSON.stringify({
  customerName,
  customerAddress,
  userEmail: localStorage.getItem("userEmail"),
  items: cart,
  totalAmount: grandTotal,
  paymentMethod: paymentMethod
})
  }
);

    const data = await response.json();

    if(data.success){

      showToast("✅ Order Placed Successfully");

      cart = [];
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      updateCart();

      setTimeout(()=>{
        window.location.href="orders.html";
      },1000);

    }else{

      showToast("❌ Order Failed");

    }

  }catch(error){

    console.log(error);

    showToast("❌ Server Error");

  }

}
/* =========================
   TOAST
========================= */

function showToast(message){

const toast =
document.getElementById('toast');

if(!toast) return;

toast.innerText = message;

toast.classList.add('show');

setTimeout(()=>{

toast.classList.remove('show');

},2000);

}

/* =========================
   SEARCH
========================= */

const searchInput =
document.getElementById('searchInput');

if(searchInput){

searchInput.addEventListener(
'keyup',
function(){

const value =
this.value.toLowerCase();

const filtered =
products.filter(product =>

product.name
.toLowerCase()
.includes(value)

);

renderProducts(filtered);

});

}

/* =========================
   FILTER CATEGORY
========================= */

function filterCategory(category){

if(category === 'All'){

renderProducts(products);

return;

}

const filtered =
products.filter(product =>
product.category === category
);

renderProducts(filtered);

}

/* =========================
   OVERLAY CLICK
========================= */

const overlay =
document.getElementById('overlay');

if(overlay){

overlay.addEventListener(
'click',
function(){

closeCart();

closeCheckout();

});

}

/* =========================
   PAYMENT SWITCH
========================= */

const paymentRadios =
document.querySelectorAll(
'input[name="payment"]'
);

paymentRadios.forEach(radio=>{

radio.addEventListener('change',()=>{

document
.querySelectorAll('.payment-card')
.forEach(card=>{

card.classList.remove(
'active-payment'
);

});

radio
.closest('.payment-card')
.classList.add(
'active-payment'
);

const value = radio.value;

const cardBox =
document.getElementById('cardBox');

const upiBox =
document.getElementById('upiBox');

if(value === 'CARD'){

cardBox.style.display =
'block';

upiBox.style.display =
'none';

}
else if(value === 'UPI'){

upiBox.style.display =
'block';

cardBox.style.display =
'none';

}
else{

upiBox.style.display =
'none';

cardBox.style.display =
'none';

}

});

});

updateCart();
loadProducts();

async function openGPay() {

  const amount = grandTotal;

  const res = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amount
    })
  });

  const order = await res.json();

  const options = {
    key: "rzp_test_SwfPYz2MyJmpWA",
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    name: "Jabson Foods",

    handler: async function(response) {

      alert("Payment Successful ✅");

      const customerName =
        document.getElementById("name").value || "Guest";

      const customerAddress =
        document.getElementById("address").value || "Not Provided";

      try {

        const saveOrder = await fetch("http://localhost:5000/place-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
 body: JSON.stringify({
    customerName,
    customerAddress,
    userEmail: localStorage.getItem("userEmail"),
    items: cart,
    totalAmount: grandTotal,
    paymentMethod: "ONLINE"
})
});

        const data = await saveOrder.json();

        console.log(data);

        alert("Order Saved Successfully ✅");

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();

        window.location.href = "orders.html";

      } catch(err) {
        console.log(err);
        alert("Server Error ❌");
      }

    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}


function applyCoupon() {

  const code =
  document.getElementById("couponCode").value;

  if(code === "WELCOME10"){

    discount = 10;

    updateCart();

    showToast("🎉 10% Discount Applied");

  } else {

    showToast("❌ Invalid Coupon");

  }

}

function addToWishlist(name, image, price) {

  const exists = wishlist.find(
    item => item.name === name
  );

  if(exists){

    showToast("❤️ Already in Wishlist");
    return;

  }

 wishlist.push({
   name,
   image,
   price
});

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );

  showToast("❤️ Added to Wishlist");

}

async function updateStatus(id,status){

  await fetch(
    `http://localhost:5000/admin/update-status/${id}`,
    {
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        status
      })
    }
  );

  loadOrders();

}

function openReview(productId, productName){

const comment =
prompt("Write Your Review");

if(!comment) return;

const rating =
prompt("Give Rating (1-5)");

if(!rating) return;

submitReview(
productId,
productName,
rating,
comment
);

}

async function submitReview(
productId,
productName,
rating,
comment
){

try{

const response = await fetch(
"http://localhost:5000/add-review",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

productId,

userName:
localStorage.getItem("userName")
|| "Guest",

rating:Number(rating),

comment

})
}
);

const data =
await response.json();

if(data.success){

alert(
"Review Added Successfully ⭐"
);

}else{

alert(
"Review Save Failed ❌"
);

}

}catch(error){

console.log(error);

alert(
"Server Error ❌"
);

}

}
async function loadReviews(productId){

try{

const response = await fetch(
`http://localhost:5000/reviews/${productId}`
);

const reviews = await response.json();

const box =
document.getElementById(
`reviews-${productId}`
);

if(!box) return;

if(reviews.length === 0){

box.innerHTML =
"No Reviews Yet";

return;

}

box.innerHTML =
`Reviews: ${reviews.length}`;

}catch(error){

console.log(error);
}
}

const navPic =
document.getElementById(
"navProfilePic"
);

if(navPic){

const savedPhoto =
localStorage.getItem(
"profilePhoto"
);

if(savedPhoto){

navPic.src = savedPhoto;

}

}


function prevSlide(){

currentSlide--;

if(currentSlide < 0){
currentSlide = 2;
}

updateSlider();

}
