const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./db/db')
const port = process.env.PORT || 5000;


connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).json({ "message": "hello from the server side" });
})

app.use('/user', require('./routes/userRoutes'))
app.use('/datas', require('./routes/dataRoutes'))
 
app.listen(port, console.log(`server started on port: ${port}`)); 