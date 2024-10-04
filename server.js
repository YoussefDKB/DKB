// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to get grades
app.get('/grades', (req, res) => {
    fs.readFile('grades.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Endpoint to save grades
app.post('/grades', (req, res) => {
    const newGrade = req.body;

    fs.readFile('grades.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        const grades = JSON.parse(data || '[]');
        grades.push(newGrade);

        fs.writeFile('grades.json', JSON.stringify(grades, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing file' });
            }
            res.json(newGrade);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
