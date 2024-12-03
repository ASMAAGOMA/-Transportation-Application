const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


// Existing functions (login, refresh, logout, register)

// @desc Get current authenticated user data
// @route GET /auth/me
// @access Private
const getCurrentUser = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const foundUser = await User.findById(decoded.UserInfo.id).select('-password').exec()

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json(foundUser)
    })
})



// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log('Login attempt details:', {
        emailProvided: email,
        passwordProvided: !!password
    });

    if (!email || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()
    console.log('Database query result:', {
        userFound: !!foundUser,
        userDetails: foundUser ? {
            id: foundUser._id,
            email: foundUser.email,
            active: foundUser.active,
            roles: foundUser.roles
        } : null
    });

    if (!foundUser || !foundUser.active) {
        console.log('User validation failed:', { exists: !!foundUser, active: foundUser?.active });
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    console.log('Password verification:', { matches: match });

    if (!match) return res.status(401).json({ message: 'Invalid Email or Password' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "email": foundUser.email,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    console.log('Login successful:', { userId: foundUser._id });
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '7d' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    console.log('Registration payload:', { name, email, hasPassword: !!password });

    if (!name || !email || !password) {
        console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            roles: ["Customer"],
            active: true
        });

        const savedUser = await newUser.save();
        console.log('User saved:', {
            success: !!savedUser,
            id: savedUser._id,
            email: savedUser.email
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: savedUser._id
        })
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message })
    }
});
module.exports = {
    login,
    refresh,
    logout,
    register,
    getCurrentUser
}