const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new


const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the instrument model
const instrument = require("./models/instrument.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

// GET *landing page
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// GET /instruments
app.get("/instruments", async (req, res) => {
  const allInstruments = await instrument.find();
  //console.log(allInstruments); // log the instruments!
  res.render("instruments/index.ejs", {instruments: allInstruments});
});

// GET /instruments/new
app.get("/instruments/new", (req, res) => {
  res.render("instruments/new.ejs");
});

// GET show route 
app.get("/instruments/:instrumentId", async (req, res) => {
  const foundInstrument = await instrument.findById(req.params.instrumentId);
  res.render(
    "instruments/show.ejs", { instrument: foundInstrument});
});

// POST /Instruments
app.post("/instruments", async (req, res) => {
  if (req.body.canIplaythis=== "on") {
    req.body.canIplaythis = true;
  } else {
    req.body.canIplaythis = false;
  }
  await instrument.create(req.body);
  res.redirect("/instruments");
});

app.delete("/instruments/:instrumentId", async (req, res) => {
  await instrument.findByIdAndDelete(req.params.instrumentId);
  res.redirect("/instruments");
});

app.get("/instruments/:instrumentId/edit", async (req, res) => {
  const foundInstrument = await instrument.findById(req.params.instrumentId);
  res.render("instruments/edit.ejs", {
    instrument: foundInstrument,
  });
});

// server.js

app.put("/instruments/:instrumentId", async (req, res) => {
  // Handle the 'canIplaythis' checkbox data
  if (req.body.canIplaythis === "on") {
    console.log(req.body)
    req.body.canIplaythis = true;
  } else {
    req.body.canIplaythis = false;
  }
   // Update the fruit in the database
  await instrument.findByIdAndUpdate(req.params.instrumentId, req.body);
  // Redirect to the fruit's show page to see the updates
  res.redirect(`/instruments/${req.params.instrumentId}`);
});


// Start the Server
//const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Listening on port 3000");
});


//localhost:3000/instruments/new


