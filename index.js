const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.Krishi_User}:${process.env.Krishi_pss}@cluster0.uufcxef.mongodb.net/?appName=Cluster0`;


app.get('/',(req,res)=>{
    res.send('server is running')
});



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  


async function run(){
    try{
        await client.connect();


        const db = client.db('KrishiLink')
        const productsCollection = db.collection('products')


        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await productsCollection.findOne(query)
            res.send(result)
        })


        app.post('/products',async(req,res)=>{
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result);
        })


        app.delete('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)}
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}

run().catch(console.dir)


app.listen(port,()=>{
    console.log(`server is running now on ${port}`)
})