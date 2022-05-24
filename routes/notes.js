const express = require('express');
const db = require('../db');
const router = express.Router();
const app = express();
const fetchUser = require('../middleware/fetchUser');

// will fetch email form the header and on the bases of email will fetch all the datas
router.get('/',(req, res) => {
    
    res.send('Hello this is notes.js!')
  })

router.get('/fetchnotes',fetchUser, (req,res)=>{
  try{
    let id = req.id;
    console.log("Email: ",id);
    let fetchQuery = `SELECT * FROM notes WHERE id=${id};`;
    console.log("Query: ", fetchQuery)
    db.query(fetchQuery,(err,result)=>{
      if(err){
        return res.status(500).json({erorr:"Internal server error"})
      }
      if(result){
        console.log(result);
      }
    })
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Internal server error"})
  }
})

router.post('/addnote',(req,res)=>{
  res.send("This is add note");
})

router.put('/updatenote/:id',(req,res)=>{
  res.send("This is update note");
})

router.delete('/deletenote/:id',(req,res)=>{
  res.send("This is delete note");
})



module.exports = router