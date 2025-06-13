const mongoose=require("mongoose")
const customerSchema=mongoose.Schema({
    customerId:{type:Number, default:0},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"userModel", default:null},
    
    status:{type:Boolean,default:true},
    createdAt:{type:Date, default:Date.now()}
})
module.exports=mongoose.model("customerModel", customerSchema)