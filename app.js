const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.set('view engine','ejs');

app.listen(3000);


app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'gameboard.html'));
})