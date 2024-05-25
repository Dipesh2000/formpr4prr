// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/bookstore');

// const db = mongoose.connection;

// db.on('connected', (err) => {
//     if (err) {
//         console.log("database is not connecetd.");
//         return false;
//     }
//     console.log("database connected succesfully");
// })


// module.exports = db;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dipeshmehta2000:12345@cluster0.zitud03.mongodb.net/', {
    
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Database connected successfully");
});

db.on('error', (err) => {
    console.log("Database connection error:", err);
});

module.exports = db;
