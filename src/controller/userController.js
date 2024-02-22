const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

// sign up controller 
// which take name, username, email, and password
// return email, password, and token

const signup = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        const existingUser = await userModel.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "user Already exist"});
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            username: username,
            email: email,
            password: hashPassword
        });

        const token = jwt.sign({email: result.email, id: result._id}, "SECRET_KEY");
        res.status(201).json({createdUser: result, token: token})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }
}

// sign in controller 
// which take email, and password
// return email, password, and token

const signin = async (req, res) => {
    const {email, password} = req.body;
    try{

        const existingUser = await userModel.findOne({email: email});
        if(!existingUser){
            return res.status(400).json({message: "user Not found"});
        }
    
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(400).json({message: "Invalid Credentail"})
        }
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, "SECRET_KEY");
        res.status(201).json({token: token, createdUser: {username: existingUser.username,email: existingUser.email, password: existingUser.password}})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something is wrong"})
    }


}

module.exports = {signin, signup};