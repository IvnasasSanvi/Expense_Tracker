import User from '../models/userModel.js';
import validator from "validator"
import bcrypt from 'bcryptjs'

//Register a user
export async function registerUser(req, res){
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Invaild email"
        })
    }
    if(password.length < 8){
        return res.status(400).json({
            success: false,
            message: "Password must be atleast of 8 character"
        })
    }

    

}