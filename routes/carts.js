const express = require("express");
const { ObjectId } = require("mongodb");
const carts = express.Router();
const authGuard = require("../middleware/authGuard");

// get all carts
carts.get("/", authGuard, async (req, res) => {
  const result = await req.cartsColl.find({ email: req.query.email }).toArray();

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
