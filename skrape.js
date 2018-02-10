var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var app     = express();


app.get('/scrape/', function(req, res) {
console.log(req.query.name);
  url = 'https://www.onthesnow.com/colorado/skireport.html';

request(url, function(error, response, html) {
    if(!error) {
      var $ = cheerio.load(html);

      var resortName = [];
      var dailySnow = [];
      var lastThreeSnow = [];

    $('tbody').find('tr').next().next().each(function(i, elem){
      resortName[i] = $(this).children().eq(0).children().first().text()
      console.log(resortName[i])
    });

    $('tbody').find('tr').next().next().each(function (i, elem) {
      dailySnow[i] = $(this).children().eq(2).children().eq(1).text()
      dailySnow[i] = dailySnow[i].substring(0, dailySnow[i].length - 1);
      });

    $('tbody').find('tr').next().next().each(function (i, elem) {
      lastThreeSnow[i] = $(this).children().eq(2).children().eq(3).text()
      if (lastThreeSnow[i].endsWith('"')) {
        console.log(lastThreeSnow[i]);
        lastThreeSnow[i] = lastThreeSnow[i].substring(0, lastThreeSnow[i].length - 1);
        console.log("sans quote mark", lastThreeSnow[i]);
      } else {
        console.log("poop");
      }
      })

    var json = {

    }
    for (var i = 0; i < resortName.length -1; i++) {
      json[i] = {};
      json[i].resortKey = {}
      json[i].name = resortName[i];
      json[i].dailySnow = dailySnow[i];
      json[i].lastThreeSnow = lastThreeSnow[i];
    }

    }

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
})

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send(json)

    }) ;
})
app.listen('4000')
console.log('Listening on 4000');
exports = module.exports = app;


//singleton
