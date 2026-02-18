import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
    const navigate = useNavigate();

    // Generate confetti pieces with random properties
    const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2.5 + Math.random() * 2}s`,
        color: ['#f28c28', '#ffaf5e', '#10b981', '#0f172a', '#64748b', '#f59e0b', '#ef4444', '#8b5cf6'][i % 8],
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 6,
    }));

    return (
        <div className="success-screen">
            {/* Confetti */}
            <div className="confetti-container">
                {confettiPieces.map((piece) => (
                    <div
                        key={piece.id}
                        className="confetti-piece"
                        style={{
                            left: piece.left,
                            animationDelay: piece.delay,
                            animationDuration: piece.duration,
                            backgroundColor: piece.color,
                            transform: `rotate(${piece.rotation}deg)`,
                            width: `${piece.size}px`,
                            height: `${piece.size * 1.6}px`,
                        }}
                    />
                ))}
            </div>

            {/* Animated Checkmark */}
            <div className="success-checkmark-circle">
                <svg className="success-checkmark-svg" viewBox="0 0 52 52">
                    <path
                        className="success-checkmark-path"
                        fill="none"
                        d="M14 27l7.8 7.8L38 17"
                    />
                </svg>
            </div>

            <h1 className="success-heading">Order Confirmed!</h1>
            <p className="success-subtext">
                Your shawarma is being crafted with love. <br />
                Thank you for your order! 🥙
            </p>

            <button
                className="back-to-menu-btn"
                onClick={() => navigate('/')}
            >
                Back to Menu
            </button>
        </div>
    );
}
