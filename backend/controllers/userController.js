import User from '../models/userModel.js';
import validator from "validator"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.controllersDotenv()

const TOKEN_EXPIRES = '24h'

const createToken = (userId) =>
    jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: TOKEN_EXPIRES});

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

    try {
        if(await User.findOne({email})){
            return res.status(400).json({
                success: false,
                message: "User already present"
            });
        }
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name, email, password: hashed});
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        })

    }

    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

//to login a user
export async function loginUser(req,res) {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Both fields are required."
        });
    }

    try {
        const user =  await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
    
}

//to get login user details
export async function getCurrentUser(req, res) {
    try {
        const user =  await User.findById(req.user.id).select("name email");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.json({success: true, user});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}