const express = require('express')
const router = express.Router()
const post = require('../models/post')


router.get('', async (req, res) => {
    const locals = {
        title: "EA Codes",
        description: "EA Blog with Node, Express and Mongo"
    }

    try {
        const data = await post.find()
        res.render('home', { locals, data })
    } catch (error) {
        console.log(error);
    }
})

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id

        const data = await post.findById({ _id: slug })

        const locals = {
            title: data.title ,
            description: "EA Blog with Node, Express and Mongo"
        }
        res.render('post', { locals, data })
    } catch (error) {
        console.log(error);
    }
})

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "EA Blog with Node, Express and Mongo"
        }

        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        
        const data = await post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        })
        res.render('search', { data, locals })
    } catch (error) {
        console.log(error);
    }
})

router.get('/content', async(req, res) => {
    const locals = {
        title: "EA Codes",
        description: "EA Blog with Node, Express and Mongo"
    }

    try {
        const data = await post.find()
        res.render('content', { locals, data })
    } catch (error) {
        console.log(error);
    }
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.get('/about', (req, res) => {
    res.render('about')
})



module.exports = router