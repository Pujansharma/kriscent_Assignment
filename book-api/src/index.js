
// require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const {connection}=require("./config");
const { errorHandler, requestLogger } = require('./middleware');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cors=require("cors");
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api', routes);
app.use(errorHandler);



app.listen(PORT||4600,async()=>{
  try {
      await connection
      console.log("connected to database")
  } catch (error) {
      console.log(error.message)
  }
  console.log(`Server is running on port ${PORT}`);
})