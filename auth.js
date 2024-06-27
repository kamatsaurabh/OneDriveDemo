const msal = require('@azure/msal-node');
const axios = require('axios');

const msalConfig = {
    auth: {
        clientId: 'YOUR_CLIENT_ID',
        authority: `https://login.microsoftonline.com/YOUR_TENANT_ID`,
        clientSecret: 'YOUR_CLIENT_SECRET'
    }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

let authToken = '';

const getAuthUrl = () => {
    const authCodeUrlParameters = {
        scopes: ["Files.Read", "Files.ReadWrite", "Sites.Read.All", "User.Read"],
        redirectUri: "http://localhost:3000/auth/callback",
    };

    return pca.getAuthCodeUrl(authCodeUrlParameters);
};

const handleAuthRedirect = async (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["Files.Read", "Files.ReadWrite", "Sites.Read.All", "User.Read"],
        redirectUri: "http://localhost:3000/auth/callback",
    };

    const response = await pca.acquireTokenByCode(tokenRequest);
    authToken = response.accessToken;
};

const getAuthToken = () => authToken;

module.exports = {
    getAuthUrl,
    handleAuthRedirect,
    getAuthToken
};
