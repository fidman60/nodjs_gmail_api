const {google} = require('googleapis');

function listEvents(auth) {
    return new Promise((resolve, reject) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date('2019-01-01')).toISOString(),
            maxResults: 7,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) reject(err);
            //const events = res.data.items;
            resolve(res.data.items);
        });
    });
}

exports.listEvents = listEvents;
