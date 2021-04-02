const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqdtk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("conc error", err)
  const productCollection = client.db("finestFoods").collection("products");
  const OrderCollection = client.db("finestFoods").collection("orders");

  app.post('/addOrder', (req, res) => {

    const newOrder = req.body;
    OrderCollection.insertOne(newOrder)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
    console.log(newOrder)

  })


  app.get('/orders', (req, res) => {
    // console.log(req.query.email);
    OrderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })





  
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) =>{
      res.send(items)
      
    })
  })



  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('add new Product',newProduct)
    productCollection.insertOne(newProduct)
    .then(result =>{
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0 )
    })


  })

//   client.close();
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})