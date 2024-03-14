const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
  text: {
    type: String,
  },
});

const Text = mongoose.model("text", textSchema);

module.exports = Text;
