const express = require("express"); // express package
const app = express(); // create server

const fruits = require("./fruits.json");

// endpoint - route - an endpoint is an url to make a request
app.get('/"=', (req, res) => {
  res.send("Hello Avni!");
});

app.get("/chickens", (req, res) => {
  res.send("hello, chickens!");
});

// app.get('/chickens/:id', (req, res) => {
//   res.send(req.params); // params are the variable part of the resource
// });
app.get("/chickens/:id", (req, res) => {
  res.send(req.query); // query - likely data that will come from a form
});

app.get("/fruits", (req, res) => {
  res.send(fruits);
});

module.exports = app;
