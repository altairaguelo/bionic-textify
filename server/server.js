const cors = require('cors');
const express = require('express')
const path = require('path');
const app = express()
app.use(cors());
app.use(express.json());

//test push

//testing out example backend db, works!
// app.get("/api", (req, res) => {
//     res.json({"users": ['u1', 'u2', 'u3', 'u4', 'pluh', 'wuh']})
// })

//testing actual text saving
const savedTexts = [];

app.post('/api/save', (req, res) => {
    const { inputText, bionicText } = req.body;
    const newEntry = {
        id: Date.now().toString(),
        inputText,
        bionicText,
        createdAt: new Date().toISOString()
    };
    savedTexts.push(newEntry);
    res.status(201).json(newEntry);
});

app.get('/api/saved', (req, res) => {
    res.json(savedTexts);
});

app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = savedTexts.findIndex(entry => entry.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Entry not found' });
    }

    savedTexts.splice(index, 1);
    res.json({ success: true });
})

//app.listen(5000, () => { console.log("Server started on port 5000")})

//production deployment code
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});