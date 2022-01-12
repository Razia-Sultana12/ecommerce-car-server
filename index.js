const express = require('express')
const app = express()
const cors = require('cors');
//const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6goi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
   try{
    await client.connect();
    console.log('connected successfuly');
    const database = client.db('car_planet');
    const carsCollection = database.collection('cars');
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection('reviews');

    //GET Orders API 
    app.get('/orders',async(req,res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
  })
  //GET Cars API 
  app.get('/cars',async(req,res) => {
    const cursor = carsCollection.find({});
    const cars = await cursor.toArray();
    res.send(cars);
})
//GET Reviews API 
app.get('/reviews',async(req,res) => {
  const cursor = reviewCollection.find({});
  const reviews = await cursor.toArray();
  res.send(reviews);
})

  //GET SINGLE Car 
  app.get('/cars/:id',async(req,res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const car = await carsCollection.findOne(query);
    res.json(car);
    console.log(car);
})

//POST Car API 
app.post('/cars',async(req,res) => {
  const car = req.body;
  console.log('hit the post api',car);

  const result = await carsCollection.insertOne(car);
  console.log(result);
res.json(result);
});
//post order api
app.post('/orders', async (req, res) => {
  const orders = req.body;
  const result = await ordersCollection.insertOne(orders)
  res.send(result);
  console.log(result);
});
// 
// DELETE API
app.delete('/cars/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await carsCollection.deleteOne(query);
  res.json(result);
})

//GET SINGLE Order 
app.get('/orders/:id',async(req,res) => {
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const order = await ordersCollection.findOne(query);
  res.json(order);
  console.log(order);
})

//POST Review API 
app.post('/reviews',async(req,res) => {
  const review = req.body;
  console.log('hit the post api',review);

  const result = await reviewCollection.insertOne(review);
  console.log(result);
res.json(result);
});
//Post users api
app.post('/users',async(req,res) => {
  const user = req.body;
  console.log('hit the post api',user);

  const result = await usersCollection.insertOne(user);
  console.log(result);
res.json(result);
});
//GET
app.get('/users/:email',async(req,res)=>{
  const email = req.params.email;
  const query ={email: email};
  const  user = await usersCollection.findOne(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
     isAdmin = true;
  }
  res.json({admin: isAdmin})
})
//put admin
app.put('/users/admin', async (req, res) => {
  const user = req.body;
  console.log('put',user);
          const filter = { email: user.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
      })
 


    }
   finally{
    //await client.close();

   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From CarPlanet')
})

app.listen(port, () => {
  console.log(`listening at:${port}`)
})



