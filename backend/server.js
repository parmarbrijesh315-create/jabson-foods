require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dns").setDefaultResultOrder("ipv4first");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const Razorpay = require("razorpay");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("Mongo Error ❌", err);
});
app.get("/", (req, res) => {
    res.send("Jabson Backend Running 🚀");
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/add-product", async (req, res) => {
  const product = new Product({
    name: "Peanut Butter Crunchy",
    price: 199,
    category: "Peanuts",
    image: "https://www.bbassets.com/media/uploads/p/l/40309031_2-jabsons-peanut-butter-crunchy-26-protein.jpg",
    badge: "20% OFF",
    rating: "★★★★★",
    desc: "Healthy peanut butter spread."
  });

  await product.save();

  res.send("Product Added ✅");
});

app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});
app.get("/seed-products", async (req, res) => {
  try {

    await Product.deleteMany({});

    await Product.insertMany([
      {
        name:'Peanut Butter Crunchy',
        price:199,
        category:'Peanuts',
        badge:'20% OFF',
        rating:'★★★★★',
        image:'https://www.bbassets.com/media/uploads/p/l/40309031_2-jabsons-peanut-butter-crunchy-26-protein.jpg',
        desc:'Healthy peanut butter spread.'
      },

      {
        name:'Namkeen Mix',
        price:149,
        category:'Snacks',
        badge:'BESTSELLER',
        rating:'★★★★☆',
        image:'https://www.bbassets.com/media/uploads/p/l/40353357_1-jabsons-party-snacks.jpg',
        desc:'Crunchy spicy Indian mix.'
      },

      {
        name:'Khakhra Methi',
        price:99,
        category:'Khakhra',
        badge:'HEALTHY',
        rating:'★★★★★',
        image:'https://www.bbassets.com/media/uploads/p/l/40012950_5-jabsons-khakhra-methi-roasted-wheat-papads-crisps.jpg',
        desc:'Crispy methi khakhra.'
      },

      {
        name:'Chikki Special',
        price:120,
        category:'Sweets',
        badge:'HOT',
        rating:'★★★★★',
        image:'https://m.media-amazon.com/images/I/41ObNeVsTNL._SY300_SX300_QL70_FMwebp_.jpg',
        desc:'Traditional peanut chikki.'
      },

      {
        name:'Roasted Chana',
        price:80,
        category:'Snacks',
        badge:'NEW',
        rating:'★★★★☆',
        image:'https://www.bbassets.com/media/uploads/p/l/40079659_2-jabsons-chana-mahabaleshwar-black.jpg',
        desc:'Protein rich roasted chana.'
      },

      {
        name:'Salted Peanuts',
        price:90,
        category:'Peanuts',
        badge:'CLASSIC',
        rating:'★★★★★',
        image:'https://www.bbassets.com/media/uploads/p/l/40012957_2-jabsons-roasted-peanuts-classic-salted.jpg',
        desc:'Classic salted peanuts.'
      },

      {
        name:'Chilli Garlic Peanuts',
        price:110,
        category:'Peanuts',
        badge:'SPICY',
        rating:'★★★★☆',
        image:'https://www.bbassets.com/media/uploads/p/l/30005624_2-jabson-roasted-peanut-chilly-garlic.jpg',
        desc:'Spicy garlic peanuts.'
      },

      {
        name:'Unsalted Peanuts',
        price:95,
        category:'Peanuts',
        badge:'HEALTHY',
        rating:'★★★★★',
        image:'https://www.bbassets.com/media/uploads/p/l/40255546_1-jabsons-roasted-unsalted-peanuts-protein-rich-no-artificial-colours-traditional-flavour.jpg',
        desc:'Healthy unsalted peanuts.'
      },

      {
        name:'Black Pepper Peanuts',
        price:115,
        category:'Peanuts',
        badge:'TRENDING',
        rating:'★★★★☆',
        image:'https://jabsons.com/cdn/shop/files/140g_Black_Pepper_Front.png',
        desc:'Pepper flavored peanuts.'
      },

      {
        name:'Hand Roasted Peanuts',
        price:100,
        category:'Peanuts',
        badge:'TOP',
        rating:'★★★★★',
        image:'https://jabsons.com/cdn/shop/files/WhatsAppImage2025-07-04at14.51.56.jpg',
        desc:'Traditional roasted peanuts.'
      },

      {
        name:'Peanut Combo Pack',
        price:250,
        category:'Peanuts',
        badge:'COMBO',
        rating:'★★★★★',
        image:'https://jabsons.com/cdn/shop/files/WhatsApp_Image_2024-10-25_at_14.44.42.webp',
        desc:'Mixed peanut flavors pack.'
      },

      {
        name:'Bajra Khakhra',
        price:85,
        category:'Khakhra',
        badge:'FITNESS',
        rating:'★★★★☆',
        image:'https://www.bbassets.com/media/uploads/p/l/40018623_2-jabsons-khakhra-bajra-methi.jpg',
        desc:'Healthy bajra khakhra.'
      },

      {
        name:'Jeera Khakhra',
        price:89,
        category:'Khakhra',
        badge:'CRISPY',
        rating:'★★★★★',
        image:'https://m.media-amazon.com/images/S/aplus-media-library-service-media/b944d307-e8b5-4131-8e65-12f9b642386f.__CR0,0,970,600_PT0_SX970_V1___.jpg',
        desc:'Jeera flavored crispy khakhra.'
      },

      {
        name:'Pudina Chana',
        price:90,
        category:'Snacks',
        badge:'FRESH',
        rating:'★★★★☆',
        image:'https://m.media-amazon.com/images/I/51bppjvFoWL.jpg',
        desc:'Mint flavored chana.'
      },

      {
        name:'Til Gud Laddu',
        price:130,
        category:'Sweets',
        badge:'SPECIAL',
        rating:'★★★★★',
        image:'https://m.media-amazon.com/images/I/514BPfj78PL.jpg',
        desc:'Sesame jaggery laddu.'
      },

      {
        name:'Peanut Chikki',
        price:180,
        category:'Sweets',
        badge:'FESTIVAL',
        rating:'★★★★★',
        image:'https://m.media-amazon.com/images/I/41ObNeVsTNL.jpg',
        desc:'Crunchy peanut chikki.'
      }
    ]);

    res.send("16 Products Added ✅");

  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

app.post("/place-order", async (req, res) => {

  console.log("ORDER RECEIVED =", req.body);
  console.log("PAYMENT METHOD =", req.body.paymentMethod);

  try {

  const order = new Order({
  customerName: req.body.customerName,
  customerAddress: req.body.customerAddress,
  userEmail: req.body.userEmail,
  items: req.body.items,
  totalAmount: req.body.totalAmount,
  paymentMethod: req.body.paymentMethod
});

    await order.save();

    res.json({
      success: true,
      message: "Order Saved Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });

  }

});

app.get("/orders", async (req, res) => {

  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching orders"
    });

  }

});

app.get("/admin/orders", async (req, res) => {

  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Error"
    });

  }

});

app.post("/admin/add-product", async (req,res)=>{

  try{

    const product = new Product({

      name:req.body.name,
      price:req.body.price,
      image:req.body.image,

      category:"Admin",
      badge:"NEW",
      rating:"★★★★★",
      desc:"Added From Admin"

    });

    await product.save();

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json({
      success:false
    });

  }

});

app.delete("/admin/delete-product/:id", async (req,res)=>{

  try{

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json({
      success:false
    });

  }

});

app.put("/admin/edit-product/:id", async (req,res)=>{

try{

```
await Product.findByIdAndUpdate(
  req.params.id,
  {
    name:req.body.name,
    price:req.body.price,
    image:req.body.image
  }
);

res.json({
  success:true
});
```

}catch(error){

```
res.status(500).json({
  success:false
});
```

}

});


app.put("/admin/update-status/:id", async (req,res)=>{

  try{

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        status:req.body.status
      }
    );

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json({
      success:false
    });

  }

});

app.post("/register", async (req,res)=>{

try{

const user = new User({

name:req.body.name,
email:req.body.email,
password:req.body.password

});

await user.save();

res.json({
success:true
});

}catch(error){

res.json({
success:false,
message:error.message
});

}

});

app.post("/login", async (req,res)=>{

try{

const user = await User.findOne({

email:req.body.email,
password:req.body.password

});

if(user){

res.json({
success:true,
user
});

}else{

res.json({
success:false
});

}

}catch(error){

console.log(error);

}

});

app.post("/forgot-password", async (req,res)=>{

try{

const user = await User.findOne({
email:req.body.email
});

if(!user){

return res.json({
success:false,
message:"Email Not Found"
});

}

res.json({
success:true,
message:"Account Found"
});

}catch(error){

res.status(500).json({
success:false,
message:"Server Error"
});

}

});

app.post("/reset-password", async (req,res)=>{

try{

const user = await User.findOne({
email:req.body.email
});

if(!user){

return res.json({
success:false,
message:"Email Not Found"
});

}

user.password = req.body.newPassword;

await user.save();

res.json({
success:true,
message:"Password Updated Successfully"
});

}catch(error){

res.status(500).json({
success:false,
message:"Server Error"
});

}

});

app.post("/add-review", async (req, res) => {

try {

const review = new Review({

productId: req.body.productId,
userName: req.body.userName,
rating: req.body.rating,
comment: req.body.comment

});

await review.save();

res.json({
success: true,
message: "Review Added Successfully"
});

} catch (error) {

res.status(500).json({
success: false,
message: "Error Adding Review"
});

}

});

app.get("/reviews/:productId", async (req, res) => {

try {

const reviews = await Review.find({
productId: req.params.productId
});

res.json(reviews);

} catch (error) {

res.status(500).json([]);

}

});

app.put("/cancel-order/:id", async (req,res)=>{

try{

await Order.findByIdAndUpdate(
req.params.id,
{
status:"Cancelled"
}
);

res.json({
success:true
});

}catch(error){

res.status(500).json({
success:false
});

}

});


app.get("/admin/analytics", async (req, res) => {

  try {

    const orders = await Order.find();
    const products = await Product.find();

    const totalOrders = orders.length;
    const totalProducts = products.length;

    const totalRevenue = orders
      .filter(order => order.status !== "Cancelled")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const deliveredOrders = orders.filter(order => order.status === "Delivered").length;
    const pendingOrders = orders.filter(order => order.status === "Pending").length;
    const packedOrders = orders.filter(order => order.status === "Packed").length;
    const shippedOrders = orders.filter(order => order.status === "Shipped").length;
    const cancelledOrders = orders.filter(order => order.status === "Cancelled").length;

    const onlineOrders = orders.filter(order => order.paymentMethod === "ONLINE").length;
    const codOrders = orders.filter(order => order.paymentMethod === "COD").length;

    res.json({
      totalOrders,
      totalProducts,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
      packedOrders,
      shippedOrders,
      cancelledOrders,
      onlineOrders,
      codOrders
    });

  } catch (error) {

    res.status(500).json({
      message: "Analytics Error"
    });

  }

});

app.get("/invoice/:id", async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if(!order){
      return res.status(404).send("Order Not Found");
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(26)
      .text("Jabson Foods", { align: "center" });

    doc
      .fontSize(18)
      .text("Invoice", { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${order._id}`);
    doc.text(`Customer: ${order.customerName || "Guest"}`);
    doc.text(`Address: ${order.customerAddress || "Not Provided"}`);
    doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`);
    doc.text(`Status: ${order.status || "Pending"}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

    doc.moveDown();

    doc.fontSize(16).text("Items");
    doc.moveDown(0.5);

    order.items.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ₹${item.price}`
        );
    });

    doc.moveDown();

    doc
      .fontSize(16)
      .text(`Total Amount: ₹${Number(order.totalAmount || 0).toFixed(2)}`);

    doc.moveDown();

    doc
      .fontSize(12)
      .text("Thank you for shopping with Jabson Foods!", {
        align: "center"
      });

    doc.end();

  } catch (error) {

    console.log(error);
    res.status(500).send("Invoice Error");

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});