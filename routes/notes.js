const express = require('express');
const db = require('../db');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

// will fetch email form the header and on the bases of email will fetch all the datas
router.get('/', (req, res) => {

  res.send('Hello this is notes.js!')
})

router.get('/fetchnotes', fetchUser, (req, res) => {
  try {
    let userId = req.id;
    console.log("Email: ", userId);
    let fetchQuery = `SELECT * FROM notes WHERE user_id=${userId};`;
    console.log("Query: ", fetchQuery)
    db.query(fetchQuery, (err, result) => {
      if (err) {
        return res.status(500).json({ erorr: "Internal server error" })
      }
      if (result) {
        return res.status(200).json({ result })
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post('/addnote', fetchUser, [
  body('title', "Title length > 3").isLength({ min: 3 }),
  body('description', "Description length > 3").isLength({ min: 3 }),
  body('tag', "Tag length > 3").isLength({ min: 2 })
], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty) {
    return res.status(400).json({ error: error.array() })
  }
  let userId = req.id;
  const { title, description, tag } = req.body;

  try {

    let insertQuery = `INSERT INTO notes (title, description, tag, date, user_id) VALUES ("${title}","${description}","${tag}",curdate(), ${userId});`;
    db.query(insertQuery, (err, result) => {
      if (err) {
        return res.status("500").json({ error: "Internal server error :( " });
      }
      if (result) {
        res.status(200).json("Note Inserted successfully")
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error :(");
  }

})

router.put('/updatenote/:id', fetchUser, (req, res) => {
  const { title, description, tag } = req.body;

  // 1: Check if the id provider in params exists or not 
  try {
    // if user exists or not
    let updateNoteId = req.params.id;
    let updateQuery = `select id from notes where id='${updateNoteId}';`;
    // console.log(updateQuery)
    db.query(updateQuery, function (err, result) {
      if (err) {
        return res.status(404).json({ errors: "Notes not Found pal" });
      }
      console.log(result)
      if (result.length == 0) {
        return res.status(200).json("Doesn't exists")
      } else {
        // 2: Check if the user id in the request is same as the new note user id 
        // As we have auth-token in the request header
        let reqUserId = req.id;
        console.log("reqUserId: ", reqUserId)
        // for new not euser id will check with the dp
        try {
          let updateQuery = `select user_id from notes where id='${updateNoteId}';`;
          console.log(updateQuery)
          db.query(updateQuery, (err, result) => {
            if (err) {
              return res.status(404).json({ errors: "Notes not Found pal" });
            }
            if (result) {
              // console.log(result)
              let reqNoteUserId = result[0].user_id
              console.log("reqNoteUserId: ", reqNoteUserId)
              // comparing both requestUserId and reqNoteUserId
              if (reqNoteUserId == reqUserId) {
                console.log("Same same")
                // 3: If 1 and 2 fails means the user is a valid user
                // Updating the existing data
                try {

                  let updateStatement = `UPDATE notes SET title="${title}", description="${description}", tag="${tag}" WHERE id=${updateNoteId};`;
                  console.log(updateStatement)
                  db.query(updateStatement, (err, result) => {
                    if (err) {
                      return res.status(500).json({ error: "Internal Server Error" });
                    }
                    if (result) {
                      res.status(200).json("Note Updated")
                    }
                  })
                } catch (err) {
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              } else {
                return res.status(401).json({ error: "Not Allowed" });
              }
            }
          })
        } catch (err) {
          //  console.log(error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    })
  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }


})

router.delete('/deletenote/:id', fetchUser, (req, res) => {
  // 1: Check if the id provider in params exists or not 
  try {
    // if user exists or not
    let deleteNoteId = req.params.id;
    let checkIdQuery = `select id from notes where id='${deleteNoteId}';`;
    // console.log(updateQuery)
    db.query(checkIdQuery, function (err, result) {
      if (err) {
        return res.status(404).json({ errors: "Notes not Found pal" });
      }
      console.log(result)
      if (result.length == 0) {
        return res.status(200).json("Doesn't exists")
      } else {
        // 2: Check if the user id in the request is same as the new note user id 
        // As we have auth-token in the request header
        let reqUserId = req.id;
        console.log("reqUserId: ", reqUserId)
        // for new not euser id will check with the dp
        try {
          let checkUserIdQuery = `select user_id from notes where id='${deleteNoteId}';`;
          console.log(checkUserIdQuery)
          db.query(checkUserIdQuery, (err, result) => {
            if (err) {
              return res.status(404).json({ errors: "Notes not Found pal" });
            }
            if (result) {
              // console.log(result)
              let reqNoteUserId = result[0].user_id
              console.log("reqNoteUserId: ", reqNoteUserId)
              // comparing both requestUserId and reqNoteUserId
              if (reqNoteUserId == reqUserId) {
                console.log("Same same")
                // 3: If 1 and 2 fails means the user is a valid user
                // deleteing the existing data
                try {

                  let deleteStatement = `DELETE FROM notes WHERE id=${deleteNoteId};`;
                  console.log(deleteStatement)
                  db.query(deleteStatement, (err, result) => {
                    if (err) {
                      return res.status(500).json({ error: "Internal Server Error" });
                    }
                    if (result) {
                      res.status(200).json("Note Deleted")
                    }
                  })
                } catch (err) {
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              } else {
                return res.status(401).json({ error: "Not Allowed" });
              }
            }
          })
        } catch (err) {
          //  console.log(error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    })
  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})



module.exports = router