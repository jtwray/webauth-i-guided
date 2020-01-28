const router = require('express').Router();
const bc = require("bcryptjs")
const Users = require('../users/users-model.js');

router.get('/secret', (req, res, next) => {
  req.headers.authorization ?
    bc.hash(req.headers.authorization, 10, (err, hash) => {//2^10 is the number of rounds to slow it down 2^10 times to hash and rehash the number you pass in 
      err ?
        res.status(500).res({ oops: "it broke on the server side" })
        :
        res.status(200).json({ hash })
    })
    :
    res.status(400).json({ error: "missing header" })

})

router.post('/register', (req, res) => {
  let user = req.body;
  const hash=
  bc.hashSync(req.body.password,8)
user.password=hash;
//hash password before saving user
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
