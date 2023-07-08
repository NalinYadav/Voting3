const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
dotenv.config();
connectDB();
app.use(express.json());
const auth = require("./middleware/auth");

const People = require("./models/People");
const Votes = require("./models/Votes");

const { Password } = require("./config/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

app.get("/", async (req, res) => {
  let state = "ok";
  res.render("login", { state });
});

app.get("/home", async (req, res) => {
  let state = "ok";
  res.render("login", { state });
});

app.post("/home", auth, async (req, res) => {
  const images = await People.find();
  res.render("home", { images: images, password: req.body.password });
});

app.get("/thanks", async (req, res) => {
  res.render("thanks");
});

app.get("/votes", async (req, res) => {
  const images = await People.find();
  const votes = await Votes.countDocuments();
  res.render("result", { images: images, votes: votes });
});

app.get("/count", async (req, res) => {
  const votes = await Votes.countDocuments();
  res.render("count", { votes: votes });
});

app.post("/people", async (req, res) => {
  const data = req.body;
  try {
    const people = await People.create(data);
    res.status(200).json(people);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/submit", async (req, res) => {
  const { id, userId } = req.body;
  if (typeof id == "object") {
    await People.updateMany({ id: { $in: id } }, { $push: { votes: userId } });
    await Votes.create({ id: userId, votes: id });
    console.log({ password: userId }, { $set: { isValid: false } });
    await Password.updateOne(
      { password: userId },
      { $set: { isValid: false } }
    );
  } else {
    await Votes.create({ id: userId, votes: id });
    await People.findOneAndUpdate(
      { id },
      { $push: { votes: userId } },
      { new: true }
    );
    await Password.updateOne(
      { password: userId },
      { $set: { isValid: false } }
    );
  }
  res.redirect("/thanks");
});
app.listen(3000, () => console.log("port running at server 3000"));
