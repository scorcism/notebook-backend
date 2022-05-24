const express = require('express');
const path = require('path');
var cors = require('cors')
const app = express()
const port = 3001
app.use(cors())
app.use(express.json()) // this is used to parse all the incoming data 
const db = require('./db')

app.get('/sqlcommands', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`notebook backend listening at http://localhost:${port}`)
})
