import React from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';

export default function Payment({ amount, onPaymentSuccess }) {
    return (
        <div style={{ marginTop: '20px' }}>
            <PaymentForm
                applicationId={process.env.REACT_APP_SQUARE_APP_ID}
                locationId={process.env.REACT_APP_SQUARE_LOCATION_ID}
                cardTokenizeResponseReceived={async (token) => {
                    try {
                        const response = await fetch('/api/pay', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sourceId: token.token, amount }),
                        });

                        const data = await response.json();
                        if (data.success) {
                            // Trigger the clear cart and success screen in App.js
                            onPaymentSuccess();
                        } else {
                            alert('Payment Failed: ' + data.error);
                        }
                    } catch (err) {
                        alert('Server Error. Please try again.');
                    }
                }}
            >
                <CreditCard
                    buttonProps={{
                        css: {
                            backgroundColor: '#f28c28',
                            color: '#fff',
                            fontSize: '18px',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: 'none',
                            width: '100%',
                            '&:hover': { backgroundColor: '#d67a1f' }
                        }
                    }}
                >
                    Complete Order
                </CreditCard>
            </PaymentForm>
        </div>
    );
}