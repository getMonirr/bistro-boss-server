const express = require("express");
const { ObjectId } = require("mongodb");
const authGuard = require("../middleware/authGuard");
const users = express.Router();

// verify admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decode.email;
  const user = await req.usersColl.findOne({ email: email });
  if (user?.role !== "admin") {
    return res.status(403).send({ error: true, message: "unauthorize access" });
  }

  next();
};

// get all users
users.get("/", authGuard, verifyAdmin, async (req, res) => {
  const result = await req.usersColl.find().toArray();

  res.send(result);
});

// post a user
users.post("/", async (req, res) => {
  const isExist = await req.usersColl.findOne({ email: req.body.email });
  if (isExist) {
    return res.send({ message: "user exist" });
  }

  const result = await req.usersColl.insertOne(req.body);

  res.send(result);
});

// check admin
users.get("/admin/:email", authGuard, async (req, res) => {
  const userEmail = req.params.email;

  if (req.decode.email !== userEmail) {
    return res.send({ admin: false });
  }

  const query = { email: userEmail };
  const user = await req.usersColl.findOne(query);
  const result = { admin: user?.role === "admin" };

  res.send(result);
});

// update a user to admin
users.patch("/admin/:id", async (req, res) => {
  const filter = { _id: new ObjectId(req.params.id) };
  const updateDoc = {
    $set: {
      role: "admin",
    },
  };

  const result = await req.usersColl.updateOne(filter, updateDoc);

  res.send(result);
});

module.exports = users;
