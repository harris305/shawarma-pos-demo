const express = require('express');
const cors = require('cors');
const { SquareClient, SquareEnvironment } = require('square');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the Client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
});

app.post('/api/pay', async (req, res) => {
    const { sourceId, amount } = req.body;
    console.log('--- Processing Payment ---');
    console.log('Amount:', amount);

    try {
        /**
         * STICKY NOTE FOR V44:
         * The path is client.payments.create()
         */
        const response = await client.payments.create({
            sourceId: sourceId,
            idempotencyKey: crypto.randomBytes(12).toString('hex'),
            amountMoney: {
                amount: BigInt(amount),
                currency: 'USD',
            },
        });

        // In v44, the actual data is inside response
        const result = response;

        // Convert BigInt to strings so the browser doesn't crash
        const serializedData = JSON.parse(
            JSON.stringify(result, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            )
        );

        console.log('✅ Payment Success!');
        res.status(200).json({ success: true, result: serializedData });

    } catch (error) {
        console.error('❌ Square API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));