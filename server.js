const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Qaran Mobile Repair & Accessories - Home',
        currentPage: 'home'
    });
});

app.get('/services', (req, res) => {
    res.render('services', { 
        title: 'Our Services - Qaran Mobile Repair',
        currentPage: 'services'
    });
});

app.get('/accessories', (req, res) => {
    res.render('accessories', { 
        title: 'Mobile Accessories - Qaran',
        currentPage: 'accessories'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - Qaran Mobile Repair',
        currentPage: 'contact'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Qaran Mobile Repair website running at http://localhost:${port}`);
});