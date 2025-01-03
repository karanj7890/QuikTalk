import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const signup= async (req,res)=>{
    const {fullName,email,password}= req.body
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please fill in all fields"})
        }
        //we will hash the password
        if(password.length < 6){
            return res.status(400).json({message:"Password must be of length 6"})
        }
        if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({message:"Invalid email format. Backend validation failed"});
        const user= await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exist"});

        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        const newUser= new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            // now we will generate jwt token here 
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
        else{
            return res.status(400).json({message:"Failed to create new user"})
        }
    } catch (error) {
        console.log("Error in signup", error.message);
        return res.status(500).json({message:"Internal server error"})
        
    }
}


export const login= async (req,res)=>{
    const {email,password}= req.body;
    try {
        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const isPasswordCorrect= await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        generateToken(user._id,res)
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login", error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}


export const logout= (req,res)=>{
    // in this we only clear the cookies that are present
    try {
        res.cookie("jwt", "",{maxAge:0})
        res.status(200).json({message:"Logged Out Succesfully"})
    } catch (error) {
        console.log("Error in logout", error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}


export const updateProfile= async (req,res)=>{
    try {
        const userId = req.user._id;
        let profilePicUrl = null;

        if (req.file) {
            // Upload image to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                    reject(new Error('Image upload failed'));
                    } else {
                    resolve(result);
                    }
                }
                );
                stream.end(req.file.buffer);
        });
        profilePicUrl = result.secure_url;
        } else {
        return res.status(400).json({ message: "Please add a profile picture" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl },
            { new: true }
        );

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update Profile", error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const checkAuth= (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth", error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}