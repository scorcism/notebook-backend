const express = require('express');
const router = express.Router();
const app = express();

router.get('/', (req, res) => {
    res.send('Hello this is notes.js!')
  })

module.exports = router