const express = require("express");
const router = express.Router();
const userModel = require.main.require('./models/user');
const validationRules = require.main.require('./validation_rules/rules');
const asyncValidator = require('async-validator-2');
// const session = require('express-session');

router.get('/', (req, res) => {
    res.render('login.ejs', {errs: []});
});

router.post('/', (req, res)=>{

    const data = {
        email: req.body.email,
        password: req.body.password
    };

    const rules = validationRules.users.login;
    const validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=>{
        if(!errors){
            userModel.validateUser(req.body.email, req.body.password, function(result){
                if(!result){
                  res.render('login', {errs: [{message: 'Invalid email or password'}]});
                }
                else{
                  console.log(result);
                  if(result.is_admin == 1){
                      req.session.admin = result.user_id;
                      res.redirect('/admin/home');
                  }
                  else{
                      req.session.student = result.user_id;
                      res.redirect('/student/home');
                  }
                }
            });
        }
        else {
            console.log(fields);
            res.render('login', {errs: errors});
        }
    });

});


module.exports = router;