const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const route = require('./routes.js');
const app = express();
app.use(express.json()) ;

require('dotenv').config();

// console.log("MongoDB URL:", process.env.mongourl); 

mongoose.connect("mongodb+srv://anusoni252006:anuMern-Practice25.@cluster0.hn79e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Connection Error:", err.message));

const port = 3010;

app.use(express.static('static'));
app.use("/api" , route) ;
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
// port = 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
