const {google} = require('googleapis');

function getMessages(auth) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.list({
            userId: 'me',
            maxResults: 4,
            labelIds: [
                "INBOX",
            ]
        }, (err, res) => {
            if (err) return reject(err);

            const messages = res.data.messages;

            const messagesPromises = messages.map((message, index) => {
                return new Promise((resolve, reject) => {
                    gmail.users.messages.get({
                        userId: 'me',
                        id: message.id
                    }, (err, res) => {
                        if (err) reject(err);
                        let resultToShow = {
                            message: res.data.snippet,
                            labelRead: res.data.labelIds.find(label => label === 'UNREAD') ? 'UNREAD':'READ',
                        };
                        res.data.payload.headers.forEach(header=> {
                            //console.log(header);
                            if (header.name === 'Subject')
                                resultToShow.subject = header.value;

                            if (header.name === 'From') {
                                resultToShow.senderName = header.value.split('<')[0];
                                resultToShow.senderEmail = header.value.split('<')[1].split('>')[0];
                            }

                            if (header.name === 'Date')
                                resultToShow.date = header.value;
                        });
                        //console.log(index+' === '+messages.length);
                        resolve(resultToShow);
                    });
                });
            });

            Promise.all(messagesPromises)
                .then((messagesToReturn) => {
                    resolve(messagesToReturn);
                })
                .catch(error => reject(error));
        });
    });
}

exports.getMessages = getMessages;
