const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.session.destroy();
    res.redirect('/login');
});

module.exports = router;