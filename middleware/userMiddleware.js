const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const bearer = req.headers["authorization"];
  if (bearer === undefined) {
    return res.send({ msg: "Not OK" });
  }
  const token = bearer.split(" ")[1];
  console.log(token);
  console.log(bearer);
  // const token = req.headers["authorization"];
  if (token === undefined) {
    return res.send({ msg: "User not authorized person or session expired" });
  }
  const valid = jwt.verify(token, process.env.secretkey);
  if (valid) {
    return next();
  }
  return res.send({ msg: "not authorized for the particular resources" });
};
module.exports = authMiddleware;
