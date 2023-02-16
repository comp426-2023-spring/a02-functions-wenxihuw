#!/usr/bin/env node

import fetch from 'node-fetch';
import moment from 'moment-timezone';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

const timezone = args.z || moment.tz.guess();
const latitude = args.n || -args.s;
const longitude = args.e || -args.w;
var day;
if (args.d != null){
    day = args.d;
}else{
    day = 1;
}

// Make a request
let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&timezone=' + timezone + '&daily=precipitation_hours';

const response = await fetch(url);
// Get the data from the request
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

const precipitation_hours = data.daily.precipitation_hours[day];

if (day == 0) {
  console.log(`You ${precipitation_hours === 0 ? "won't" : "might"} need your galoshes today.`)
} else if (day > 1) {
  console.log(`You ${precipitation_hours === 0 ? "won't" : "might"} need your galoshes in ${day} days.`)
} else {
  console.log(`You ${precipitation_hours === 0 ? "won't" : "might"} need your galoshes tomorrow.`)
}