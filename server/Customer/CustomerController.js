const customerModel=require("./CustomerModel")
const userModel=require("../User/UserModel")
const bcrypt=require("bcryptjs")
const mongoose = require("mongoose");


const register = async (req, res) => {
let validation=[];
if(!req.body.name){
  validation.push("name is required");
}
if(!req.body.email){
  validation.push("email is required");
}
if(!req.body.password){
  validation.push("passwordis required");
}
if (validation.length>0) {
return res.status(422).json({
  success:false,
  status:422,
  message:validation
})

}else{
  userModel.findOne({email:req.body.email})
  .then((userData) => {
            if (!userData) {
                let userObj = new userModel();
                userObj.name = req.body.name;
                userObj.email = req.body.email;
                userObj.password = bcrypt.hashSync(req.body.password, 10);
                userObj.userType = 2;
                userObj.save()
                    .then((userData) => {
                        let customerObj = new customerModel();
                        customerObj.name = req.body.name; // Corrected casing
                        customerObj.email = req.body.email;
                        customerObj.password = req.body.password;
                       
                        customerObj.userId = userData._id;
                        customerObj.save()
                            .then((customerData) => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "customer added",
                                    userData: userData,
                                    customerData: customerData,
                                });
                            })
                            .catch((err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error",
                                    error: err,
                                });
                            });
                    })
                    .catch((error) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Internal server error!!",
                            error: error,
                        });
                    });
            } else {
                res.status(200).json({
                    success: false,
                    status: 200,
                    message: "customer already exists!",
                    data: userData,
                });
            }
        }).catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error!",
                error: err,
            });
        });
    }
};

//get all api
allcustomer=async(req,res)=>{
let limit=req.body.limit  ||null
let currentPage=req.body.currentPage-1 ||null
delete req.body.limit
delete req.body.currentPage
let total = await customerModel.countDocuments().exec()


  customerModel.find()
  .sort({createdAt:-1})
  .limit(limit)
  .skip(currentPage*limit)
  .populate("userId")
    .then((customerData)=>{
      if(customerData.length>0){
        res.json({
          success:true,
          status:200,
          message:"customer loaded successfully",
          total:total,
          data:customerData
        })
      }else{
        res.json({
          success:false,
          status:200,
          message:"No data found"
        })
      }
    })
    .catch((err)=>{
        res.json({
          success:false,
          status:500,
          message:"Internal server error ",
          error:err
        })
    })
}
getSinglecustomer = (req, res) => {
  const { userId } = req.body;

  console.log("Requested userId:", userId);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.json({
      status: 422,
      success: false,
      message: "Valid userId is required",
    });
  }

  customerModel
    .findOne({ userId: userId })
    .populate("userId")
    .then((customerData) => {
      if (!customerData) {
        console.log("Customer not found for userId:", userId);
        return res.json({
          status: 404,
          success: false,
          message: "customer not found on given Id",
        });
      }

      return res.json({
        status: 200,
        success: true,
        message: "customer exists",
        data: customerData,
      });
    })
    .catch((err) => {
      console.error("DB Error:", err);
      res.json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    });
};

//update api
update = (req, res) => {
  if (!req.body.userId) {
    return res.status(422).json({
      status: 422,
      success: false,
      message: "User ID is required",
    });
  }

  customerModel.findOne({ userId: req.body.userId })
    .then((customerData) => {
      if (!customerData) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "customer does not exist",
        });
      }

      if (!!req.body.userId)
         customerData.course = req.body.course;
      if (!!req.body.userId.rollNo)
        customerData.rollNo=req.body.rollNo;
      customerData.save()
        .then(() => {
          userModel
            .findOne(customerData.userId)
            .then((userData) => {
              if (!!req.body.name) 
                userData.name = req.body.name;
               

              userData.save()
                .then(() => {
                  res.json({
                    status: 200,
                    success: true,
                    message: "customer updated successfully",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Failed to update user data",
                    error: err,
                  });
                });
            })
            .catch((err) => {
              res.status(500).json({
                status: 500,
                success: false,
                message: "User data not found",
                error: err,
              });
            });
        })
        .catch((err) => {
            console.log(err);
          res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update customer data",
            error: err,
          });
        });
    })
    .catch((err) => {
        console.log(err);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: err,
      });
    });
};

//status api

changeStatus=(req,res)=>{
    let validation=[]
    if(!req.body.userId){
        validation.push("userId is required")
    }
    if(validation.length>0){
        res.status(422).json({
            status:422,
            success:false,
            message:validation
        })
    }else{
       customerModel.findOne({userId:req.body.userId})
        .then((customerData)=>{
            if(!customerData){
                res.json({
                    status:404,
                    success:false,
                    message:"customer does not exist at given id"
                })
            }else{
                // if(!!req.body.status){
                    customerData.status=req.body.status
                // }
                customerData.save()
                .then((updatedcustomer)=>{

                    userModel.findOne({_id:req.body.userId})
                    .then((userData)=>{
                    userData.status=req.body.status   
                    userData.save()
                    .then((userData)=>{
                      res.json({
                        status:200,
                        success:true,
                        message:"User data already exists",
                        data:userData
                      })
                    })
                    .catch((err)=>{
                      console.log(err);
                        res.status(500).json({
                            status:500,
                            success:false,
                            message:"Internal server error"
                        })
                    })

                    })
                    .catch((err)=>{
                      console.log(err);
                        res.status(500).json({
                            status:500,
                            success:false,
                            message:"Internal server error"
                        })
                    })
                })
                .catch((err)=>{
                  console.log(err);
                    res.status(500).json({
                        status:500,
                        success:false,
                        message:"Internal server error"
                    })
                })
            }       
        })
        .catch((err)=>{
            res.status(500).json({
                status:500,
                success:false,
                message:"Internal server error"
            })
            console.log(err);
        })
    }
}




module.exports = { register,allcustomer,getSinglecustomer,update,changeStatus};




