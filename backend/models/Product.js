const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  badge: {
    type: String,
    default: "",
  },

  rating: {
    type: String,
    default: "★★★★★",
  },

  desc: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("Product", productSchema);