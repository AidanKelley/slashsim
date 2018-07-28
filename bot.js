//Copyright (c) 2018 Aidan Kelley

const config = require('./config'),
    express = require('express'),
    app = express(),
    Markov = require('./markov.js');

let markov = new Markov("\n");

console.log(markov.wordsLower);
console.log(markov.random(""));

app.use((req, res) => {
    //call the groupme APIs a bunch and get all the data
});