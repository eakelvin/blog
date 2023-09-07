const express = require('express')
const router = express.Router()
const post = require('../models/post')
const User = require('../models/User')
const adminLayout = '../views/layouts/admin'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId
        next()
    } catch(error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
}

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "EA Dashboard",
            description: "EA Blog with Node, Express and Mongo"
        }
        const isHomePage = false
        res.render('admin/home', { locals, layout: adminLayout, isHomePage })
    } catch (error) {
        console.log(error);
    }
})

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret)
        res.cookie('token', token, { httpOnly: true })

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
})

router.get('/dashboard', authMiddleware, async(req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'EA-Blog'
        }
        const isHomePage = false

        const data = await post.find()
        res.render('admin/dashboard', { isHomePage, data, locals, layout: adminLayout }) 
    } catch (error) {
        console.log(error);
    }
})

router.get('/add-post', authMiddleware, async(req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'EA-Blog'
        }

        const data = await post.find()
        res.render('admin/add-post', { locals, layout: adminLayout }) 
    } catch (error) {
        console.log(error);
    }
})

router.post('/add-post', authMiddleware, async(req, res) => {
    try {

        try {
            const newPost = new post({
                title: req.body.title,
                body: req.body.body
            })
            await post.create(newPost)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
})

router.get('/edit-post/:id', authMiddleware, async(req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'EA-Blog'
        }

       const data = await post.findOne({ _id: req.params.id })

       res.render('admin/edit-post', {locals, data, layout: adminLayout })
    } catch (error) {
        console.log(error);
    }
})

router.put('/edit-post/:id', authMiddleware, async(req, res) => {
    try {
        await post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })

        res.redirect(`/edit-post/${req.params.id}`)

    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await post.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    // res.json({ message: 'Logout Successful' })
    res.redirect('/')
})

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({ email, username, password: hashedPassword})
            res.status(201).json({ message: 'User Created', user })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already exists'})
            }
            res.status(500).json({ message: 'Internal Server Error'})
        }

    } catch (error) {
        console.log(error);
    }
})



module.exports = router