const express = require('express');
const app = express();
const bodyParser = require('body-parser');



let server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


let router = require('./router/rest')(app);


