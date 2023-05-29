const express = require("express");
const { ObjectId } = require("mongodb");
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

// delete a cart item
carts.delete("/:id", async (req, res) => {
  const result = await req.cartsColl.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.send(result);
});

module.exports = carts;
