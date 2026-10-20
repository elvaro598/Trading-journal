const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Ensure axios is installed or use node-fetch / native fetch
const app = express();

app.use(cors());
app.use(express.json());

// cTrader Open API REST/JSON Gateway or WebSocket handler
app.post('/api/sync', async (req, res) => {
    const { accountId, accessToken } = req.body;

    if (!accountId || !accessToken) {
        return res.status(400).json({ error: 'Missing accountId or accessToken' });
    }

    try {
        // OPTION: If you are using cTrader Open API REST or your existing WebSocket bridge
        // Replace this with your cTrader Open API integration logic that fetches the live balance & history.
        
        // For account 1576104, returning live balance and sample/historical deal structure:
        const liveBalance = 70.43; // Your actual balance
        
        // Fetch or structure your historical trades here
        const historicalTrades = [
            {
                dealId: "DL-1001",
                executionTime: Date.now() - 86400000 * 2, // 2 days ago
                volume: 1000,
                executionPrice: 2350.50,
                profit: 15.20 // Positive trade (Win)
            },
            {
                dealId: "DL-1002",
                executionTime: Date.now() - 86400000, // Yesterday
                volume: 1000,
                executionPrice: 2355.00,
                profit: -8.50 // Negative trade (Loss)
            }
        ];

        return res.json({
            success: true,
            accountId: accountId,
            balance: liveBalance,
            currency: 'USD',
            trades: historicalTrades
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));
