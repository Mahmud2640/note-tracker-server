const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@note-tracker.9x9smn0.mongodb.net/note-tracker?retryWrites=true&w=majority`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//  function run
async function run() {
  try {
    await client.connect();
    const database = client.db("note-tracker");
    const notesCollection = database.collection("notes");

    // get all notes
    // http://localhost:5000/notes
    // http://localhost:5000/notes?name=mahmud

    app.get("/notes", async (req, res) => {
      const query = req.query;
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // create
    // http://localhost:5000/note

    app.post("/note", async (req, res) => {
      const note = req.body;

      const result = await notesCollection.insertOne(note);

      res.send(result);
    });

    // update
    // http://localhost:5000/note/:id

    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const note = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...note,
        },
      };
      const result = await notesCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // delete
    // http://localhost:5000/note/:id
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await notesCollection.deleteOne(filter);

      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

// api end point
// http://localhost:5000
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// server port listen
app.listen(port, () => {
  console.log(`Note-Tracker app listening on port ${port}`);
});
