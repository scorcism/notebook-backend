const jwt = require('jsonwebtoken')
const SECRET = 'abhishekisnotscor32k';

const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, SECRET);
        req.id = data;
        next();
    } catch (err) {
        res.status(401).send({ error: "Please  using a valid token" })
    }
}


module.exports = fetchUser;