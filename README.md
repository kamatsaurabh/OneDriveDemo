# OneDrive Node.js App

## Description

This application connects to OneDrive using the Microsoft Graph API to:
- List files in the user's OneDrive
- Download files
- List users who have access to a file
- Receive real-time updates on user access changes

## Setup

### Prerequisites
- Node.js and npm
- Microsoft Azure account

### Steps

1. Clone the repository:

```sh
git clone https://github.com/kamatsaurabh/OneDriveDemo
cd onedrive-node-app
Install dependencies:
sh
Copy code
npm install
Configure your Azure AD application by setting the clientId, tenantId, and clientSecret in auth.js.

### Start the server:
node index.js
### Expose your local server to the internet using ngrok:
ngrok http 3000
Visit http://localhost:3000/auth to authenticate.

Use the endpoints to list files, download files, and list users:

GET /files
GET /files/download/:fileId
GET /files/users/:fileId