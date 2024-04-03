const mongoose = require('mongoose');
const dotenv = require('dotenv')

async function connect() {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect("mongodb://127.0.0.1:27017/shop", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('kết nối thành côngggg');
    } catch (error) {
        console.log('kết nối ko thành công', error.message);
    }
}

module.exports = { connect };