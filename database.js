
const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB_URI || 'mongodb+srv://ericksonk:bark4927@cluster0.kdvtw.mongodb.net/final?retryWrites=true&w=majority'

mongoose
    .connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('DB Connected!');
    })
    .catch(error => {
        console.log('Connection Error: ${err.message}');
    });

const db = mongoose.connection;

// Bind the console to errors, to show them on console
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

module.exports = db;