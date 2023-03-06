const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3003;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});
  
app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    // Reads the db.json file and return the contents
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // Read the existing notes from the db.json file
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));

    // Assign a unique id to the new note
    newNote.id = notes.length + 1;

    // Add the new note to the array of notes
    notes.push(newNote);

    // Write the updated notes back to the db.json file
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

    // Return the new note
    res.json(newNote);
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));