const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = async () => {
    try {
        mongoose.set('strictQuery', false)
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database Linked to ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDatabase