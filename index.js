const express = require('express');
const path = require('path')
const mongoose = require('mongoose');

const db = require('./config/database');
const userDB = require('./models/userTbl');

const port = 5500;
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log("Server running at http://localhost:" + port);
    }
});

app.get('/', async (req, res) => {
    try {
        const results = await db.collection('books').find({}).toArray();
        res.render('Cart', { bookstore: results });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching books");
    }
});

// Route to delete a book by ID
app.post('/deleteData', (req, res) => {
    let id = req.query.id;
    console.log('===============', id);
    userDB.findByIdAndDelete(id)
        .then(() => {
            console.log("Data has been deleted successfully");
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to render edit form for a book by ID
app.get('/editData', async (req, res) => {
    try {
        let id = req.query.id;
        const getData = await db.collection('books').findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (getData) {
            res.render('Edit', { data: getData });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle editing a book by ID
app.post('/editData/:id', async (req, res) => {
    try {
        const { title, author, price } = req.body;
        const { id } = req.params;
        const updateData = { title, author, price };
        await db.collection('books').updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: updateData });
        console.log("Data Updated");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// Route to render delete confirmation page
app.post('/deleteData', async (req, res) => {
    try {
        const id = req.query.id;
        // Assuming `userDB` is your Mongoose model
        await userDB.findByIdAndDelete(id);
        console.log("Data has been deleted successfully");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle inserting a new book
app.post('/insertdata', async (req, res) => {
    const { image, title, author, ISBN, price } = req.body;
    try {
        await db.collection('books').insertOne({ image, title, author, ISBN, price })
        console.log("Data successfully Inserted");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});