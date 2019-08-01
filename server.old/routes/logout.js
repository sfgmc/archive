let express = require('express');
let router = express.Router();
let {User} = require('../db/models/UserSchema');
let passport = require('passport');


/* GET users listing. */
router.post('/', function(req, res) {
    User.findOneAndUpdate(
        {username: req.body.username}, 
        {login:false},
        {new:true},
        (err, userAcc) => {
            if (err) {
                res.send(err)
            } else {
                //req.logout();
                res.send({msg:'logged out', user:''})
            }
        });
    
    //res.send('logged out')
});

module.exports = router;