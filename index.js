const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");


const data = require("./data.json");




const app = express();

app.use(express.static(path.join(__dirname, "frontend/build")));

app.use(bodyParser.json(), cors());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
})

mongoose.connect("mongodb://localhost/react-shopping-cart-db", {
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology: true
})



const Product = mongoose.model("product", new mongoose.Schema({
    _id: {type: String, default: shortid.generate},
    title: String,
    image: String,
    description: String,
    price: Number,
    availableSizes: [String]
}));


app.get("/api/products", async (req, res) => {
    //const products = await Product.find({});
    res.send(data.products);
});

app.post("/api/products", async (req, res) => {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);

});

app.delete("/api/products/:id", async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
});


//Create a model and implement post method

const Order = mongoose.model("order", new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    email: String,
    name: String,
    address: String,
    total: Number,
    cartProducts: [
        {
            _id: String,
            title: String,
            price: Number,
            count: Number
        }
    ]
    },
    {
        timestamps: true
    }
));

app.get("/api/orders", async (req, res) => {
    const orders = await Order.find({});
    res.send(orders)
});

app.post("/api/orders", async (req, res) => {
    console.log(req.body);
    if(!req.body.name || !req.body.email || !req.body.address || !req.body.total || !req.body.cartProducts){
        return res.send({message: "Data is required.."});
    }else{
        const newProduct = new Order(req.body);
        const savedProduct = await newProduct.save();
        res.send(savedProduct);
    }
    
});

//Implement delete endpoint



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Port 3000 is listening...")
});
