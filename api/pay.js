const { SquareClient, SquareEnvironment } = require('square');
const crypto = require('crypto');

// Initialize the Square Client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
});

module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { sourceId, amount } = req.body;
    console.log('--- Processing Payment ---');
    console.log('Amount:', amount);

    try {
        const response = await client.payments.create({
            sourceId: sourceId,
            idempotencyKey: crypto.randomBytes(12).toString('hex'),
            amountMoney: {
                amount: BigInt(amount),
                currency: 'USD',
            },
        });

        // Convert BigInt to strings so the browser doesn't crash
        const serializedData = JSON.parse(
            JSON.stringify(response, (key, value) =>
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
};
