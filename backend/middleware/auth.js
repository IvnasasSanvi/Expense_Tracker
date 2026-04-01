import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

export default async function authMiddleware(req,res,next) {
    //grab the token
    const authHeader = req.headers.authoriztion;
    
}