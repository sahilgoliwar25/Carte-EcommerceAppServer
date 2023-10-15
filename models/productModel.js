const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  heading: {
    type: String,
    required: [true, "you forgot to enter this field"],
  },
  image: {
    type: String,
    required: [true, "you forgot to enter this field"],
  },
  description: {
    type: String,
  },
  highlights: [],
  price: {
    type: String,
    required: [true, "you forgot to enter this field"],
  },
  discount: {
    type: String,
  },
  ratings: {
    type: String,
  },
  percent: {
    type: String,
  },
  cat: {
    type: String,
    required: [true, "you forgot to enter this field"],
  },
});

module.exports = mongoose.model("Product", productSchema);
