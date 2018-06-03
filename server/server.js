/*require modules*/
const express = require('express');
const path = require('path');
const cabs = require('./routes/cab');

/*initiate express*/
const app = express();

/*view engine specs for server-side rendering */
app.set("view engine", "jade");
app.set("views", "./views");

/*middlewares*/
app.use(express.json());
app.use('/',cabs);

/*initiate server listening*/
app.listen(3000,()=>{console.log('Server running on port 3000')});