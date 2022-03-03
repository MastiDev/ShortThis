const express = require('express');
const app = express();
const port = process.env.port || 80;
const fs = require('fs');
require('dotenv').config();

var dbfile = require('./db.json');

console.clear();

app.use(express.json());
app.get("/", async function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/:id", async function(req, res) {
    if(dbfile[req.params.id]) {
        var url = dbfile[req.params.id].url;
        if(!url.startsWith("https://")) {
            res.redirect("https://" + url);
        } else res.redirect(url);
    }else {
        res.redirect("/");
    }
});

app.post("/create", async function(req, res) {
    var url = req.body.url;
    var id = addURL(url);
    var response = {
        id: id,
    }
    res.send(JSON.stringify(response));
})

app.get("*", async function(req, res) {
    res.redirect("/");
});

app.listen(port, function() {
    console.log(`App started on port ${port}`);
});

function addURL(url) {
    var id = getRandomString();
    if(!dbfile[id]) {
        dbfile[id] = {
            identifyer: id,
            url: url,
            created: Date.now(),
        }
    }
    fs.writeFile("./src/db.json", JSON.stringify(dbfile), err =>{
        if(err){
            console.log(err);
        }
    })
    return id;
}

async function checkValidURLS() {
    var data = JSON.parse(fs.readFileSync("./src/db.json"));

    for(var i in data) {
        var time = Date.now()
        var unix = data[i].created / 1000; 
        var validdate = unix + 604800;
        var datenowunix = time / 1000;

        if(validdate < datenowunix) {
            delete dbfile[data[i].identifyer];
            fs.writeFile("./src/db.json", JSON.stringify(dbfile), err =>{
                if(err){
                    console.log(err);
                }
            })
        }
    }
}

var CronJob = require('cron').CronJob;
var job = new CronJob('0 * * * *', async function() {
    await checkValidURLS();
}, null, true, 'Europe/Amsterdam');
job.start();

function getRandomString() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}