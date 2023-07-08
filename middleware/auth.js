const { Password } = require("../config/db");

const authenticate = async (req, res, next) => {
  var { password } = req.body;

  try {
    const foundPassword = await Password.findOne({ password });
    let state;
    if (foundPassword) {
      if (foundPassword.isValid) {
        // foundPassword.isValid = false;
        // await foundPassword.save();
        next();
      } else {
        state = "used";
        res.render("login", { state });
      }
    } else {
      state = "invalid";
      res.render("login", { state });
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = authenticate;
