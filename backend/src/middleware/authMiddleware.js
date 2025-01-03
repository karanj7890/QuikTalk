import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


export const protectRoute= async (req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized- Invalaid Token"});
        }

        // we are using select because we do not want our client to see his/her password
        const user= await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({message:"Unauthorized- User not found"});
        }

        req.user= user;

        next()
    } catch (error) {
        if (error.code === 'ECONNRESET') {
            console.error("Connection was reset", error.message);
            return res.status(503).json({ message: "Service Unavailable" });
        }else{
            console.log("Error in protect middleware", error.message);
            return res.status(500).json({message:"Internal server error"})
        }
    }

}