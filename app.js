const express = require("express"); // express package
const cors = require("cors"); // cors package

const logger = require("./logger");
const fruits = require("./fruits.json");
const { capitalise } = require("./helpers");

const app = express(); // create server

app.use(cors()); // using cors middleware
app.use(express.json()); // <==== parse request body as JSON
app.use(logger)

// endpoint - route - an endpoint is an url to make a request
app.get("/", (req, res) => {
  res.send("Welcome to the Fruit API");
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

app.get("/fruits/:name", (req, res) => {
  const name = req.params.name.toLowerCase();

  const fruit = fruits.find((fruit) => fruit.name.toLowerCase() === name);
  //console.log(fruit);

  //   if(fruit === undefined){
  //     res.status(404).send({ error: ` fruit ${name} not found :( ` }) // .send can be replace with .json
  //   }
  //  res.send(fruit);

  fruit === undefined
    ? res.status(404).send({ error: ` fruit ${name} not found :( ` })
    : res.send(fruit);
});

app.post("/fruits", (req, res) => {
  console.log("line 48:", req.body.name);
  // debugger; // debugger to chrome dev tool
  // iterating though the ids in the fruit json file
  const ids = fruits.map((fruit) => fruit.id);
  console.log("line 49:", ids);

  // looking to find last id  for the last object in the fruit json file
  //let maxId2 = Math.max(...ids);

  let maxId = fruits.reduce((fruit1, fruit2) =>
    fruit1.id > fruit2.id ? fruit1 : fruit2
  ).id;

  console.log("line 57;", maxId);

  // check that the fruit input is not already in the fruit json file.
  const fruit = fruits.find((fruit) => fruit.name === req.body.name); // <==== req.body will be a parsed JSON object
  console.log("line 62:", fruit);

  if (fruit !== undefined) {
    res.status(409).send({ error: "fruit already exists" });
  } else {
    maxId += 1;
    const newFruit = req.body;
    newFruit.id = maxId;

    fruits.push(newFruit); // JSON FILE NOT UPDATED AND WOULD NEED TO BE IMPLEMENTED

    res.status(201).send(newFruit);
  }
});

app.patch("/fruits/:name", (req, res) => {
  const fruit = fruits.find(
    (fruit) => fruit.name.toLowerCase() === req.params.name.toLowerCase()
  );
  console.log("line 83:", fruit);
  if (fruit === undefined) {
    return res.status(404).send({ error: "fruit does not exist" });
  }
  try {
    console.log("line 89:", req.body);
    const updatedFruit = {
      ...req.body,
      name: capitalise(req.body.name),
      id: fruit.id,
    };
    console.log("line 96", updatedFruit);

    const idx = fruits.findIndex((fruitIem) => fruitIem.id === fruit.id);
    console.log("line 97:", idx);

    fruits[idx] = updatedFruit;

    console.log(fruits[idx]);

    res.send(updatedFruit);
  } catch (error) {
    res.send(400).send(error.message);
  }
});

app.delete("/fruits/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const fruitIndex = fruits.findIndex(
    (fruit) => fruit.name.toLowerCase() === name
  );
// why -1? if the Index is not found then -1 will return (if no data is found then the value of -1 is returned.) 
  if (fruitIndex === -1) {
    res.status(404).send({ error: "fruit does not exist" });
  } else {
    fruits.splice(fruitIndex, 1);

    res.status(204).send();
  }
});

module.exports = app;
