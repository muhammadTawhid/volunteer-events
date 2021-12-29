const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const ObjectID = require("mongodb").ObjectId
require("dotenv").config();


const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const dbName = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;


const uri = `mongodb+srv://${user}:${password}@cluster0.pp5w4.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(dbName).collection("48-5events");

  app.post("/addEvent", (req, res) =>{
      const newEvent = req.body;
      console.log(newEvent, "postd");
      collection.insertOne(newEvent)
      .then(result => {
          console.log(result);
      })
  })

  app.get("/events", (req, res) =>{
    collection.find()
    .toArray((err, documents) =>{
        res.send(documents);
    })
    // console.log(collection.find());
  })

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id)
    collection.findOneAndDelete({_id: id})
    .then(document => console.log("deleted"))
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)
