const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://neettkaur123:123@cluster0.0k93tzy.mongodb.net/feedback")
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log("Database not connected", err);
})