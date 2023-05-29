const express = require("express");
const menus = express.Router();

menus.get("/", async (req, res) => {
  const result = await req.menusColl.find().toArray();

  res.send(result);
});

module.exports = menus;
