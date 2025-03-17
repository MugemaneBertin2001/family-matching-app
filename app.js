// app.js - Main application file

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { FamilyMatcher } = require('./familyMatcher');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Sample data
const samplePeople = [
    { id: 1, firstName: 'John', lastName: 'Smith', age: 45, location: 'New York' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 42, location: 'New York' },
    { id: 3, firstName: 'Michael', lastName: 'Smith', age: 15, location: 'New York' },
    { id: 4, firstName: 'Emily', lastName: 'Smith', age: 13, location: 'New York' },
    { id: 5, firstName: 'Robert', lastName: 'Johnson', age: 70, location: 'Chicago' },
    { id: 6, firstName: 'Susan', lastName: 'Johnson', age: 68, location: 'Chicago' },
    { id: 7, firstName: 'David', lastName: 'Smith', age: 72, location: 'Boston' },
    { id: 8, firstName: 'Maria', lastName: 'Garcia', age: 35, location: 'Miami' },
    { id: 9, firstName: 'James', lastName: 'Smithe', age: 40, location: 'New York' }, // Note the surname typo
    { id: 10, firstName: 'Michael', lastName: 'Johnson', age: 38, location: 'Chicago' }
];

// Initialize family matcher
const matcher = new FamilyMatcher();

// Routes
app.get('/', (req, res) => {
    res.render('index', { people: samplePeople });
});

app.get('/match/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    const targetPerson = samplePeople.find(p => p.id === targetId);

    if (!targetPerson) {
        return res.status(404).send('Person not found');
    }

    const peoplePool = samplePeople.filter(p => p.id !== targetId);
    const matches = matcher.findFamilyMatches(targetPerson, peoplePool);

    res.render('match', {
        targetPerson,
        matches,
        formatScore: (score) => (score * 100).toFixed(0) + '%'
    });
});

// Advanced comparison between two approaches
app.get('/compare', (req, res) => {
    // For now, we'll just show the rule-based approach
    // This could be expanded to compare with ML approach later
    res.render('compare', {
        approaches: [
            {
                name: 'Rule-Based Matching',
                pros: [
                    'Simple to implement and understand',
                    'Predictable results',
                    'Low computational requirements',
                    'No training data needed',
                    'Transparent decision-making'
                ],
                cons: [
                    'Limited to predefined rules',
                    'May miss non-obvious relationships',
                    'Manual threshold tuning required',
                    'Difficulty handling edge cases'
                ]
            },
            {
                name: 'ML-Based Matching',
                pros: [
                    'Can discover non-obvious patterns',
                    'Better handling of name variations',
                    'Improves over time with more data',
                    'Adapts to different cultures and naming conventions',
                    'Can process more complex relationships'
                ],
                cons: [
                    'Higher computational requirements',
                    'Requires training data',
                    'More complex to implement',
                    '"Black box" decisions harder to explain',
                    'May need retraining as data changes'
                ]
            }
        ]
    });
});

// API endpoint for programmatic access
app.post('/api/match', (req, res) => {
    const { targetPerson, peoplePool } = req.body;

    if (!targetPerson || !peoplePool) {
        return res.status(400).json({ error: 'Missing required data' });
    }

    const matches = matcher.findFamilyMatches(targetPerson, peoplePool);
    res.json({ matches });
});

// Start server
app.listen(port, () => {
    console.log(`Family matching app listening at http://localhost:${port}`);
});