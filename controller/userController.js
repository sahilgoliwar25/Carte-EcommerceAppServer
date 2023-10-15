const bcrypt = require("bcryptjs");
// const saltround = 10;
const jwt = require("jsonwebtoken");
const arr = require("../dummydata");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//node mailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
    pass: "XXXXXXXX",
  },
});

const register = async (req, res) => {
  try {
    const userdata = req.body;
    let { name, contact, email, password } = userdata;
    // console.log(userdata);

    //bcrypt
    const salt = await bcrypt.genSalt(10);
    const found = await User.findOne({ email: email });
    console.log(found);
    //find user
    if (found) {
      //if found then return
      return res.send({ msg: "User already exist" });
    }

    //password encryption
    const hashpassword = bcrypt.hashSync(userdata.password, salt);
    const temp = {
      name: name,
      contact: contact,
      email: email,
      password: hashpassword,
    };
    try {
      const user = await User.create(temp);
      // console.log(user);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ msg: "not created ", err: e });
    }
    const token = jwt.sign({ email: userdata.email }, process.env.secretkey, {
      expiresIn: "36000",
    });
    res.status(200).send({
      msg: "User is registered successfully",
      result: temp,
      token: token,
    });
    console.log(temp);
  } catch (e) {
    console.log(e);
    res.status(500).send({ msg: "not created ", err: e });
  }
};

const login = async (req, res) => {
  const userdata = req.body;
  const { email, password } = userdata;
  console.log(userdata);

  const found = await User.findOne({ email: email });
  console.log(found);
  //checking if email is present in data or not
  if (!found) {
    return res.send({ msg: "User not registered" });
  }

  //checking if password is correct or not
  const validate = await bcrypt.compare(userdata.password, found.password);
  if (!validate) {
    return res.send({ msg: "user password is wrong" });
  }

  const token = jwt.sign({ email: userdata.email }, process.env.secretkey, {
    expiresIn: "36000",
  });
  res.send({ msg: "User is LoggedIn successfully", userdata, token: token });
};

// find  user
async function resetPassword(req, res) {
  try {
    const { email } = req.body;

    const result = await User.findOne({ email: email });
    if (!result) {
      return res.status(404).send({ msg: "user not found" });
    }

    jwt.sign(
      { _id: result._id },
      "secret",
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          res.status(500).send({ msg: "internal server error" });
        }

        //setup the mail info
        const mailOptions = {
          from: "your@gmail.com",
          to: email,
          subject: "Reset your password",
          text: `To reset your password, please click the link below: http://localhost:3000/resetpassword/${token}`,
        };

        //send email
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            res.status(500).send({ msg: "error sending the email " });
          } else {
            res.status(200).send({ user: "Email sent successfully" });
          }
        });
      }
    );
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

// change password of user
async function changePassword(req, res) {
  try {
    const { token } = req.params;
    const { newpassword } = req.body;

    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        return res.status(400).send({ msg: "invalid token" });
      }

      const hashedPassword = await bcrypt.hash(newpassword, 10);

      await User.findByIdAndUpdate(decoded._id, { password: hashedPassword });

      res.status(200).send({ msg: "password updated successfully" });
    });
  } catch (e) {
    res.status(500).send("error occured", e);
  }
}

//data functions
const data = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).send(products);
  } catch (e) {
    res.status(500).send({ msg: e });
  }
};
const filteredData = async (req, res) => {
  try {
    const category = req.params;
    // const datatemp = arr.filter((item) => item.cat === cat.prodCat);
    const products = await Product.find({ cat: `${category.prodCat}` });
    // console.log(products);
    return res.send(products);
  } catch (e) {
    res.status(500).send({ msg: e });
  }
};
//dashboard and profile functions
const dashboard = (req, res) => {
  return res.send([
    {
      randomArticle: "random",
    },
  ]);
};
const profile = (req, res) => {
  return res.send([
    {
      name: "Sahil Goliwar",
      email: "test@gmail.com",
      profileimg: "ifhuyfhgiaf",
    },
  ]);
};

// add a new Product
async function addNewProduct(req, res) {
  try {
    const dataEntry = req.body;
    const product = await Product.create(dataEntry);
    res.status(200).send({ product: product });
  } catch (e) {
    console.log(e);
    res.status(500).send({ msg: "not created ", err: e });
  }
}

module.exports = {
  register,
  login,
  data,
  dashboard,
  profile,
  filteredData,
  resetPassword,
  changePassword,
  addNewProduct,
};
