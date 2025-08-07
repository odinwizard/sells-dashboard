const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const salesRoute = require("./routes/sales.route");

const app = express();

connectDB();

// app.use(cors({
//          origin:"http://localhost:3000",
//          credentials:true,
// }))

app.use(express.json());

app.use("api/v1/sales", salesRoute);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK'});
})

module.exports = app;

