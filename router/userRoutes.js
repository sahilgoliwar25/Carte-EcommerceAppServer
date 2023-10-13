const route = require("express").Router();
const {
  register,
  login,
  data,
  dashboard,
  filteredData,
  profile,
} = require("../controller/userController");
const authMiddleware = require("../middleware/userMiddleware");

//data route
route.get("/products", data);
route.get("/products/:prodCat", filteredData);

// signup and login
route.post("/register", register);
route.post("/login", login);

//dashboard and profile route
route.get("/dashboard", authMiddleware, dashboard);
route.get("/profile", authMiddleware, profile);

module.exports = route;
