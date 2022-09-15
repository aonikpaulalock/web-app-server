const { MongoClient, ServerApiVersion} = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000
require('dotenv').config()

// Middletare
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.2j2my5l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const blogsCollection = client.db("Posts").collection("blogs");

    // Get Blogs Data
    app.get("/posts", async (req, res) => {
      const result = await blogsCollection.find().toArray()
      res.send(result)
    })

    app.post("/post", async (req, res) => {
      const blogs = req.body;
      const result = await blogsCollection.insertOne(blogs)
      res.send(result)
    })

    app.get("/post", async (req, res) => {
      const email = req.query?.email;
      const filter = { email: email };
      const result = await blogsCollection.find(filter).toArray();
      res.send(result)
    })


    // Delete Blogs
    app.delete("/post/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(filter);
      res.send(result)
    })

  }
  catch {

  }

}

run()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
