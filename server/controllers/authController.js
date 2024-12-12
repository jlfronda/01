import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

import { User } from "../models/userModel.js";
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js'

export const signup = async (req, res) => {
    const { email, password, name} = req.body;
    try{
        if(!email || !password || !name){
            console.error("All fields are required!");
            hasEmptyField = true;
        }

        const userAlreadyExists = await User.findOne({email});
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();;

        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })

        await user.save();

        // jsonwebtoken (jwt)
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: {
                ...user._doc, 
                password: undefined,
            }
        });

    }catch(err){
        res.status(500).json({success: false, message: err.message});
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        console.log('Looking for user with verification token...');
        console.log(code)
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            console.log('Invalid or expired verification code.');
            return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
        }

        console.log('Verification token is valid. Updating user status...');
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        console.log('Sending welcome email...');
        await sendWelcomeEmail(user.email, user.name);
        console.log('Welcome email sent successfully.');

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (err) {
        console.error('Error in verifyEmail:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    console.log('do you run?')
    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({success: false, message: "Email does not exist."})
        }
        
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Incorrect password."})
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    }catch(err){
        console.error('Error in logging in', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        sucess: true,
        message: "Logged out successfully",
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ success: false, message: "Email does not exist!" })
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    
        res.status(200).json({success: true, message: "password reset link sent to your email."});
    }catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

export const resetPassword = async (req, res) => {
    try{
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            res.status(400).json({success: false, message: "Invalid or expired reset token"});
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({success: true, message: "password reset successful."});
    }catch(err){
        console.log(`Error in reseting password ${err}`)
        res.status(400).json({successful: false, message: err.message})
    }
}

export const checkAuth = async (req, res) => {
    try{
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }

        res.status(200).json({success:true, user: {
            ...user._doc,
            password: undefined,
        }});
    }catch(err){
        console.log("Error in checkAuth", err);
        res.status(400).json({success: false, message: err.message})
    }
};