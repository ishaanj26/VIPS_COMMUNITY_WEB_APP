const User = require('../models/User');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const { EMAIL_VERIFY_TEMPLATE } = require('../config/emailTemplates');
const { default: transporter } = require('../config/nodemailer');

// Send OTP to email for password reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 10 * 60 * 1000; // 10 min expiry
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = expires;
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'VIPS Community Password Reset OTP',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        });
        res.json({ message: 'OTP sent to email.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required.' });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        if (!user.verifyOtp || !user.verifyOtpExpireAt) return res.status(400).json({ message: 'No OTP requested for this email.' });
        if (Date.now() > user.verifyOtpExpireAt) return res.status(400).json({ message: 'OTP expired.' });
        if (user.verifyOtp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
        res.json({ message: 'OTP verified.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email  || !password) return res.status(400).json({ message: 'All fields required.' });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        user.password = await bcrypt.hash(password, 10);
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        res.json({ message: 'Password reset successful.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists.' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Signup successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email does not exist.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password.' });
        res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
