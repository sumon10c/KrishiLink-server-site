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
        const productsCollection = db.collection('products');
        const userCollection = db.collection('user');
        const interestCollection = db.collection('interest')


        app.post('/user',async(req,res)=>{
            const newUser = req.body;

            const email = req.body.email;
            const query = {email:email}
            const existingUser = await userCollection.findOne(query);
            if(existingUser) {
                 res.send({message: "User already registered"})
            }
            else{
                const result = await userCollection.insertOne(newUser);
                res.send(result);
            }

            
        })


   app.get('/recent-products',async(req,res)=>{
    const cursor = productsCollection.find().sort({postDate: -1}).limit(6);
    const result = await cursor.toArray();
    res.send(result)

   }) 

   app.get("/user/:email", async (req, res) => {
    const email = req.params.email;
    const result = await userCollection.findOne({ email: email });
    res.send(result);
  });
          
   app.patch("/user/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        name: updatedData.name,
        photo: updatedData.photo,
        phone: updatedData.phone,
      }
    };
  
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

     


        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: (id)} 
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.post('/interest',async(req,res)=>{
        const newInterest = req.body;
        const result = await interestCollection.insertOne(newInterest);
        res.send(result);
        })

        app.get("/interest/:email", async (req, res) => {
        const email = req.params.email;
        const result = await interestCollection.find({ buyer_email: email }).toArray();
        res.send(result);
        });

        app.post('/products',async(req,res)=>{
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result);
        })

       


        // app.delete('/products/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     const query = {_id:new ObjectId(id)}
        //     const result = await productsCollection.deleteOne(query)
        //     res.send(result)
        // })




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