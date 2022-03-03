const express = require('express');
const app = express();
const port = process.env.port || 8080;
const fs = require('fs');
require('dotenv').config();

const dbfile = require('./db.json');

console.clear();

app.get("/", async function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/:id", async function(req, res) {
    if(dbfile[req.params.id]) {
        res.redirect(dbfile[req.params.id].url);
    }else {
        res.redirect("/");
    }
});

app.get("*", async function(req, res) {
    res.redirect("/");
});

app.listen(port, function() {
    console.log(`App started on port ${port}`);
});

async function addURL(url) {

    var id = getRandomString();

    if(!dbfile[id]) {
        dbfile[id] = {
            identifyer: id,
            url: url,
            created: Date.now(),
        }
    }
    console.log(dbfile);
    fs.writeFile("./src/db.json", JSON.stringify(dbfile), err =>{
        if(err){
            console.log(err);
        }
    })
}

function getRandomString() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}