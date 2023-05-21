const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ezafyme.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();


    const productCollection = client.db('toybuzz').collection('product');

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    // get email all data....//

    app.get('/my-products', async (req, res) => {
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
     const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/my-products/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // post operation....//

    app.post('/product', async (req, res) => {
      const addProduct = req.body;
      const result = await productCollection.insertOne(addProduct);
      res.send(result);
    })

    // put operation....//

    app.put('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateToy = req.body;
      const toy ={
        $set: {
          price: updateToy.price,
          available_quantity: updateToy.available_quantity,
          details: updateToy.details
        }
      } 

      const result = await productCollection.updateOne(filter, toy, options)
      res.send(result);
    })

    // delete operation....//

    app.delete('/my-products/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Assignment-11 update......')
})

app.listen(port, () => {
  console.log(`Assignment-11 Server is running port:${port}`)
})