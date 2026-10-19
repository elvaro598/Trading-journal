const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CTRADER_CLIENT_ID;
const CLIENT_SECRET = process.env.CTRADER_CLIENT_SECRET;
const REDIRECT_URI = process.env.CTRADER_REDIRECT_URI;

// Home route with a direct one-click connect button
app.get('/', (req, res) => {
    const authUrl = `https://connect.spotware.com/apps/${CLIENT_ID}`;
    res.send(`
        <div style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h2>Deriv cTrader Journal Backend</h2>
            <p>Click below to securely connect your cTrader account:</p>
            <a href="https://id.ctrader.com/my/settings/openapi/" target="_blank" style="background: #0088cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage cTrader Open API Apps</a>
        </div>
    `);
});

// OAuth callback endpoint to exchange code for token
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing from cTrader response' });
    }
    try {
        const response = await axios.post('https://id.ctrader.com/oauth/v2/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                code: code
            }
        });
        res.json({ 
            success: true, 
            message: 'Authorization successful! Copy your access token below:',
            token_data: response.data 
        });
    } catch (error) {
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
