const express = require("express");
const carts = express.Router();

// get all carts
carts.get("/", async (req, res) => {
  const result = await req.cartsColl.find().toArray();

  res.send(result);
});

// post a cart
carts.post("/", async (req, res) => {
  const result = await req.cartsColl.insertOne(req.body);

  res.send(result);
});

module.exports = carts;
