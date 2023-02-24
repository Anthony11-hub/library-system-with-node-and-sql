const express = require('express');
const router = express.Router();
const userModel = require.main.require('./models/user');
const validationRules = require.main.require('./validation_rules/rules');
const asyncValidator = require('async-validator-2');

router.get('/', (req, res) => {
    res.render('signup.ejs', {errs: []});
});


router.post('/', (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password,
        gender: req.body.gender
    };

    const rules = validationRules.users.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields) => {
        if(!errors) {
            userModel.createUser(data, function(result){
                if(result){
                    console.log(result);
                    res.redirect('/login');
                }
                else {
                    res.send('Invalid');
                }
            });
        }
        else {
            console.log(fields);
            res.render('signup', {errs: errors});
        }
    });
});

module.exports = router;

