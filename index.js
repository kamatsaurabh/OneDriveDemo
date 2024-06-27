const express = require('express');
const bodyParser = require('body-parser');
const { getAuthUrl, handleAuthRedirect } = require('./auth');
const { listFiles, downloadFile, listUsers, handleWebhook } = require('./onedrive');

const app = express();
app.use(bodyParser.json());

app.get('/auth', (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    await handleAuthRedirect(req, res);
    res.send('Authentication successful! You can close this window.');
});

app.get('/files', async (req, res) => {
    const files = await listFiles();
    res.json(files);
});

app.get('/files/download/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
    const fileStream = await downloadFile(fileId);
    fileStream.pipe(res);
});

app.get('/files/users/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
    const users = await listUsers(fileId);
    res.json(users);
});

app.post('/webhook', async (req, res) => {
    await handleWebhook(req, res);
    res.status(200).send('Webhook received');
});

const createSubscription = async () => {
    const authToken = getAuthToken();
    const response = await axios.post(`${graphApiEndpoint}/subscriptions`, {
        changeType: 'updated',
        notificationUrl: 'https://YOUR_NGROK_URL/webhook',
        resource: '/me/drive/root',
        expirationDateTime: new Date(new Date().getTime() + 3600 * 24 * 7).toISOString(),
        clientState: 'SecretClientState'
    }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
    console.log('Subscription ID:', response.data.id);
};

app.listen(3000, () => {
    createSubscription();
    console.log('Server started on http://localhost:3000');
});
