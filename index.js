const express = require("express");
const route = require("./router/userRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const port = process.env.port;
app.use(express.json()); //Body Parser
app.use(
  cors({
    origin: "*",
  })
);
//this is used for application level middleware where it will validate on whole application level

app.get("/", (req, res) => {
  //   res.send("This is the Home Page. Please Route to /api/main for more details");
  res.send(
    "<html><body><h1>This is the Home Page of Ecommerce Server.</h1></body></html>"
  );
});

app.use("/api", route);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
