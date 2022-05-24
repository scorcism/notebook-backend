const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
const fetchUser = require('../middleware/fetchUser');
const SECRET = 'abhishekisnotscor32k';


router.get('/', (req, res) => {
    res.send('Auth Endpoint')
})

router.get('/createuser',
    [body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password  of length 8').isLength({ min: 8 })
    ], async (req, res) => {
        // If there are errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const email = req.body.email
            const name = req.body.name
            const password = req.body.password

            const salt = bcrypt.genSaltSync(10);
            const securedPassword = bcrypt.hashSync(password, salt);
            let selectQuery = `select * from users where email='${email}';`;
            db.query(selectQuery, function (err, result) {
                if (err) {
                    return res.status(400).json({ errors: errors.array() });
                }
                if (result.length === 0) {
                    let insertQuery = `insert into users(email,password,date_created,name) VALUES ('${email}','${securedPassword}',curdate(),'${name}');`;
                    db.query(insertQuery, function (err, result) {
                        if (err) {
                            return res.status(400).json({ errors: errors.array() });
                        }
                    })
                    // This is used to fetch user specific data - we can use session or cookie also here
                    let data = email;
                    const authtoken = jwt.sign(data, SECRET);

                    return res.status(200).json({ authtoken }) // send the auth token for urther refrence

                } else {
                    console.log("Error occured :")
                    return res.status(400).json({ error: "Email is taken" });
                }
            })

        } catch (error) {
            // console.log(error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    })

router.get('/login',
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password filed cannot be empty').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // const { email, password } = req.body;
        let userEmail = req.body.email;
        let userPassword = req.body.password;
        try {
            let selectQuery = `select * from users where email='${userEmail}';`;
            let securedPassword;
            db.query(selectQuery, function (err, result) {
                if (err) console.log(err);
                // console.log(result.length)
                if (result.length === 0) {
                    console.log("Login error :")
                    return res.status(403).json({ error: "Login with the correct credentail" })
                } else {
                    securedPassword = result[0].password
                    userEmail = result[0].email
                    // console.log(securedPassword)
                    const check = async () => {
                        let checkPassword = await bcrypt.compare(userPassword, securedPassword)
                        if (!checkPassword) {
                            return res.status(400).json("Please try to login with correct credentials");
                        }
                        const authtoken = jwt.sign(userEmail, SECRET);
                        res.json({ authtoken })
                    }
                    check();
                }
            })
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server Error");
        }
    })

// Here we will use middlewere which will first fetch the auth jwt token from the header
// Also this will verify if the token is correct or not. using jwt.verify
router.get('/getuser', fetchUser, (req, res) => {
    const email = req.email;
    try {
        let getDataStatement = `SELECT * FROM users WHERE email='${email}'`;
        db.query(getDataStatement, (err, result) => {
            if (err) console.log(err)
            else {
                console.log(result)
                res.status(200).json({ result })
            }
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
    }

})

module.exports = router