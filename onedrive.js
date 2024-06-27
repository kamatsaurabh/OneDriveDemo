const axios = require('axios');
const { getAuthToken } = require('./auth');

const graphApiEndpoint = 'https://graph.microsoft.com/v1.0';

const listFiles = async () => {
    const authToken = getAuthToken();
    const response = await axios.get(`${graphApiEndpoint}/me/drive/root/children`, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
    return response.data.value;
};

const downloadFile = async (fileId) => {
    const authToken = getAuthToken();
    const response = await axios.get(`${graphApiEndpoint}/me/drive/items/${fileId}/content`, {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        responseType: 'stream'
    });
    return response.data;
};

const listUsers = async (fileId) => {
    const authToken = getAuthToken();
    const response = await axios.get(`${graphApiEndpoint}/me/drive/items/${fileId}/permissions`, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
    return response.data.value.map(permission => permission.grantedTo.user);
};

const handleWebhook = async (req, res) => {
    const validationToken = req.query.validationToken;
    if (validationToken) {
        res.status(200).send(validationToken);
        return;
    }

    const changes = req.body.value;
    for (const change of changes) {
        if (change.resource === '/me/drive/items/{fileId}') {
            // Handle the change, e.g., notify users
        }
    }
};

module.exports = {
    listFiles,
    downloadFile,
    listUsers,
    handleWebhook
};
