const bcrypt=require("bcryptjs")
const userModel = require('../server/User/UserModel');
userModel.findOne({email:"admin@gmail.com"})
.then((userData)=>{
    if(!userData){
        let userObj=new userModel()
        userObj.name="admin"
        userObj.email="admin@gmail.com"
        userObj.password=bcrypt.hashSync("123", 10)
        userObj.userType=1
        userObj.save()
        .then((userData)=>{
            console.log("Admin created successfully");
        })
        .catch((err)=>{
            console.log("Error while registering admin");
        })
    }else{
        console.log("Admin already exists");
    }
})
.catch((err)=>{
    console.log("Error while finding user");
    
})
userModel.findOne({ email: "user@gmail.com" })   //  use a real email
    .then((userData) => {
        if (!userData) {
            let userObj = new userModel();
            userObj.name = "user";
            userObj.email = "user@gmail.com";            // ✅ valid email
            userObj.password = bcrypt.hashSync("123", 10); // ✅ non-empty password
            userObj.userType = 2;

            userObj.save()
                .then(() => {
                    console.log("user created successfully");
                })
                .catch(() => {
                    console.log("Error while registering user");
                });
        } else {
            console.log("user already exists");
        }
    })
    .catch(() => {
        console.log("Error while finding  user");
    });
