var express = require('express');
var router = express.Router();
var db = require('../helpers/MongoDbHelper').default;

router.get('/', function (req, res) {
    db.findDocuments({}, "products", function (result) {
        res.json({
            success: true,
            message: "OK",
            token: "",
            data: result
        });
    })
});

router.get('/get/:id', function (req, res) {
    db.findDocument(req.params.id, "products", function (result) {
        console.log(result);
        res.json({
            success: true,
            message: "OK",
            token: "",
            data: result
        });
    })
});

router.post('/add/', function (req, res) {
    var data = req.body;
    console.log(data);
    db.insertDocument(data, "products", function (result) {
        console.log(result);
        res.json({
            success: true,
            message: "OK",
            token: "",
            data: result
        });
    })
});


module.exports = router;