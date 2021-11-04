const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json())


// database connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4tdkj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const pakageCollection = client.db('tourAgency').collection("tourPakage");
    const bookingCollection = client.db('tourAgency').collection("booking");

    // post data from client
    app.post('/addPakage', async (req, res) => {
        const pakage = req.body;
        const result = await pakageCollection.insertOne(pakage);
        res.json(result)
    })

    // all pagake get
    app.get('/allPakage', async (req, res) => {
        const result = await pakageCollection.find({}).toArray();
        res.json(result)
    })

    // get single item
    app.get('/singlePakage/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await pakageCollection.findOne(query);
        res.json(result)
    })

    // receieve order 
    app.post('/orderBook', async (req, res) => {
        const result = await bookingCollection.insertOne(req.body);
        console.log(result)
        res.json(result);
    })

    // get all order
    app.get('/myorder', async (req, res) => {

        const cursor = bookingCollection.find({});
        const orders = await cursor.toArray();
        res.json(orders)

    })

    // delete order

    app.delete('/deleteOrder/:id', async(req,res)=>{

       // const id = req.params.id;
       // const query = {_id:ObjectId(id)}
        const result = await pakageCollection.deleteOne({_id:ObjectId(req.params.id)})
        console.log(result)
        res.json(result)

    })
    // delete product

    app.delete('/deleteProduct/:id', async(req,res)=>{

       // const id = req.params.id;
       // const query = {_id:ObjectId(id)}
        const result = await bookingCollection.deleteOne({_id:ObjectId(req.params.id)})
        console.log(result)
        res.json(result)

    })


      
});


// root api
app.get('/', (req, res) => {
    res.send('Hello world.')
})

// listenting port
app.listen(port, () => {
    console.log('it is working');
})