const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CTRADER_CLIENT_ID;
const CLIENT_SECRET = process.env.CTRADER_CLIENT_SECRET;
const REDIRECT_URI = process.env.CTRADER_REDIRECT_URI;

// OAuth callback endpoint
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post('https://id.ctrader.com/oauth/v2/token', {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        });
        res.json({ success: true, token_data: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch account historical deals
app.get('/api/trades', async (req, res) => {
    const accessToken = req.headers.authorization;
    const accountId = req.query.accountId;

    try {
        const response = await axios.get(`https://live.ctraderapi.com:5036/v2/accounts/${accountId}/deals`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch historical deals from cTrader' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
