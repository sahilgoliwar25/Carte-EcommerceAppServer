const route = require("express").Router();
const {
  register,
  login,
  data,
  dashboard,
  filteredData,
  profile,
  resetPassword,
  changePassword,
  addNewProduct,
  filteredSubData,
} = require("../controller/userController");
const authMiddleware = require("../middleware/userMiddleware");

//data route
route.get("/products", data);
route.get("/products/:prodCat", filteredData);
route.get("/products/:prodCat/:prodSubCat", filteredSubData);

// signup and login
route.post("/register", register);
route.post("/login", login);

//forgot password and reset
route.post("/forgotpassword", resetPassword);
route.post("/resetpassword/:token", changePassword);

//dashboard and profile route
route.get("/dashboard", authMiddleware, dashboard);
route.get("/profile", authMiddleware, profile);

//products add
route.post("/addproduct", addNewProduct);

module.exports = route;
