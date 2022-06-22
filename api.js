// API docs: https://developer.lufthansa.com/docs

//flight schedules
// GET /operations/schedules/{origin}/{destination}/{fromDateTime}[?directFlights=true]
// origin and destination is 3-character ICAO code for the airport
// example: GET /operations/schedules/FRA/JFK/2019-07-15
// example: GET /operations/schedules/FRA/JFK/2019-07-15?directFlights=1

import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';

const url_token = "https://api.lufthansa.com/v1/oauth/token";
const url = "https://api.lufthansa.com/v1/operations/schedules/FRA/JFK/2022-07-15?directFlights=1";
let bearer = '';

const aircraft_code = "736";
const url_aircraft = `https://api.lufthansa.com/v1/mds-references/aircraft/${aircraft_code}`;

async function getBaerer() {    // it is valid for 129600 sec = 1 day 12 hours

    const data = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials'
    };

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: url_token,
    };

    await axios(options)
        .then(res => {
            console.log(res.data);
            bearer = res.data.access_token;
        })
        .then(() => getFlightInfo())
        .then(() => getAircraftInfo())
        .catch(err => console.warn(err))
}

async function getFlightInfo() {
    await axios.get(url, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${bearer}`,
            "content-type": "application/json"
        }
    })
        .then(res => console.log(res.data.ScheduleResource.Schedule[0].Flight.Departure))
        .catch(err => console.log(err))
}

async function getAircraftInfo() {
    await axios.get(url_aircraft, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${bearer}`,
            "content-type": "application/json"
        }
    })
        .then(res => console.log(res.data.AircraftResource.AircraftSummaries.AircraftSummary))
        .catch(err => console.log(err))
}

getBaerer(); 