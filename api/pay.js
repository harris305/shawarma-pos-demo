const { SquareClient, SquareEnvironment } = require('square');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check that the token exists
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
        console.error('❌ SQUARE_ACCESS_TOKEN is not set!');
        return res.status(500).json({
            success: false,
            error: 'Server misconfiguration: payment token not found'
        });
    }

    // Initialize Square Client inside the handler so env vars are guaranteed available
    const client = new SquareClient({
        token: token,
        environment: SquareEnvironment.Sandbox,
    });

    const { sourceId, amount } = req.body;
    console.log('--- Processing Payment ---');
    console.log('Amount:', amount);
    console.log('Token present:', !!token, '| Length:', token.length);

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
