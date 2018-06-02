/*require modules*/
const express = require('express');
const cabs = require('./routes/cab');

/*initiate express*/
const app = express();

/*middlewares*/
app.use(express.json());
app.use('/',cabs);

/*initiate server listening*/
app.listen(3000,()=>{console.log('Server running on port 3000')});