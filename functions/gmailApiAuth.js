const fs = require('fs');
const {google} = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'config/token.json';

function getAuth(filePath = 'config/credentials.json', tokenPath = TOKEN_PATH, scopes = SCOPES){
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, content) => {
            if (err) reject(err);

            const credentials = JSON.parse(content);
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            fs.readFile(tokenPath, (err, token) => {
                if (err)
                    getNewToken(oAuth2Client, tokenPath, scopes)
                        .then(auth => resolve(auth))
                        .catch(err => reject(err));
                else {
                    oAuth2Client.setCredentials(JSON.parse(token));
                    resolve(oAuth2Client);
                }
            });
        });
    });
}

function getNewToken(oAuth2Client, tokenPath, scopes) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) reject(err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
                    if (err) reject(err);
                    else {
                        console.log('Token stored to', tokenPath);
                        resolve(oAuth2Client);
                    }
                });
            });
        });
    });
}

exports.getAuth = getAuth;
