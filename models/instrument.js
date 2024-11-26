const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema({
    name: String,
    canIplaythis: Boolean,
  });

  const instrument = mongoose.model("instrument", instrumentSchema);





  module.exports = instrument;