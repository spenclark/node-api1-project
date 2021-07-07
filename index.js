// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

// needed to parse json  with express (cant do it without)
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Alive!");
});

// returning list of users

server.get('/api/users', (req, res) => {
    // list of users from DB
    db.find()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
        console.log('error on GET /api/users', err)
        res.status(500).json({errorMessage: 'Database could not not get list of hubs'})
    })
})


//  add user 
server.post('/api/users', (req, res) => {
    // get data from userData
    const userData = req.body
    // call database
    db.insert(userData)
        .then( data => {
            res.status(201).json(data)
        })
        .catch(err => {
            console.log('failed to POST /api/users', err)
            res.status(500).json({errorMessage: 'Could not add new User to Database'})
        })
})

// see user by ID

server.get(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user =>{
            if(user) {
                res.json(user)
            } else {
                res.status(404).json({error: "that user ID can not be found"})
            }
        })
        .catch(err => {
            console.log('server failed with GET rq to api/user/id', err)
            res.status(500).json({errorMessage: 'Could not find user'})
        })
})



// remove User


server.delete(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            // no user with id
            if (!removed) {
                res.status(404).json({ error: 'could not find ID', removed} )
            } else {
                res.status(200).json({errorMessage: 'user removed'})
            }
        })
        .catch( err => {
            console.log('eror on delete hubs/:id', err)
            res.status(500).json({errorMessage: "Could not Delete Database"})
        })
})



//edit user

  server.put(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    const modify = req.body;
    db.findById(id).then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "That user ID doesn't exist on this server."});
      } else {
        db
          .update(id, modify)
          .then(data => {
            console.log("Item has been updated")
            res.status(200).json(data);
          })
          .catch(error => {
            res.status(500).json({ message: "That user was not modified!"});
          });
      }
    });
  });

const port = 6000;
server.listen(port, () => console.log(`Your server is running on port ${port}.`)); 