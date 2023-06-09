const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");

// routes import
const menus = require("./routes/menus");
const carts = require("./routes/carts");
const users = require("./routes/users");

const app = express();
const port = process.env.PORT || 3500;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("bistros boss (not boss, server) running...");
});

// mongodb start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5ku26o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // menu collection
    app.use((req, res, next) => {
      req.menusColl = client.db("bistroBossDB").collection("menus");

      next();
    });

    // cart collection
    app.use((req, res, next) => {
      req.cartsColl = client.db("bistroBossDB").collection("carts");

      next();
    });

    // users collection
    app.use((req, res, next) => {
      req.usersColl = client.db("bistroBossDB").collection("users");

      next();
    });

    // routes
    app.use("/menus", menus);
    app.use("/carts", carts);
    app.use("/users", users);

    // generate jwt
    app.post("/jwt", (req, res) => {
      const token = jwt.sign(req.body, process.env.SECRET_SIGNATURE, {
        expiresIn: "1h",
      });

      res.send({ token });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb end

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
