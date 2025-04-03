const express = require('express');
const router = express.Router();
const User = require('./schema.js');  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();   
router.get("/", async (req, res) => {
    try {
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(400).send("No users found");
        }
        res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});

 
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).send("Please enter all fields");
        }
 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }
 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

 
        const token = jwt.sign(
            { id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token, user: { id: savedUser._id, email: savedUser.email } });

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send("Please enter all fields");
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

       
        const token = jwt.sign(
            { id: userData._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, user: { id: userData._id, email: userData.email } });

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
