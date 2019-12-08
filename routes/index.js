const {getAuth} = require("../functions/gmailApiAuth");
const {getMessages} = require("../functions/gmailApiRequests");

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gmail Api' });
});

router.get('/messages', function (req, res, next) {
  getAuth()
      .then(auth => {
        getMessages(auth)
            .then(messages => {
              //console.log(messages);
              return res.status(200).json(messages);
            })
            .catch(error => {
              console.log(error);
              return res.status(500).json("Something went wrong");
            });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json("Something went wrong");
      });
});

module.exports = router;
