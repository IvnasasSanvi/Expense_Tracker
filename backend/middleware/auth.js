// import User from '../models/userModel.js'
// import jwt from 'jsonwebtoken'
// import dotenv from "dotenv";

// export default async function authMiddleware(req,res,next) {
//     //grab the token
//     const authHeader = req.headers.authorization;
//     if(!authHeader || !authHeader.startsWith("Bearer ")){
//         return res.status(401).json({
//             success: false,
//             message: "Not authorized or token missing"
//         });
//     }
//     const token = authHeader.split(" ")[1];

//     //to verify the token
//     try {
//         const payload = jwt.verify(token, process.env.JWT_SECRET);
//         if (!process.env.JWT_SECRET) {
//         return res.status(500).json({
//             success: false,
//             message: "JWT_SECRET not configured"
//         });
//         }
//         const user = await User.findById(payload.id ).select("-password");
//         if(!user){
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//         req.user = user;
//         next();    
//     } 
    
//     catch (err) {
//         console.error("JWT verification failed: ",err);
//         return res.status(401).json({
//             success: false,
//             message: "Token invalid or expired"
//         }); 
//     }
// }   




import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not authorized or token missing"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET not configured"
            });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = { id: user._id }; // cleaner
        next();

    } catch (err) {
        console.error("JWT verification failed:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}