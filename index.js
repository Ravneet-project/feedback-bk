// index.js
const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const db=require("./config/db")
const seed=require("./config/seed")
const cors = require("cors");
const path = require('path');
require("dotenv").config();
const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/adminRoutes');



// Use this *before* defining any routes
app.use(cors());

app.use('/pdf', express.static(path.join(__dirname, 'public/pdf')));

app.use(express.json()); // for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded



// Use relative path for mounting your API routes (NO full URLs)


// Mount them under appropriate base path

app.use("/api", userRoutes);



// Badal do
app.use('/api', adminRoutes);
// Default route to test server is working
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
