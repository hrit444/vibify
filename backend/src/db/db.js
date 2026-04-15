const mongoose = require("mongoose")

async function connectDB(){
  await mongoose.connect(process.env.MONGODB_URL)
  .then(()=>{
    console.log("Connected to db");
  })
  .catch((err)=>{
    console.error(err)
  })
}

module.exports = connectDB