import React from 'react';
import './DocumentLimit.css';

const DocumentLimit: React.FC = () => {
    return (
        <div className="document-limit-container">
            <div className="document-limit-content">
                <h2>Document Limit Reached</h2>
                <p className="limit-message">
                    You've reached your limit of 20 documents. To continue organizing more documents and unlock unlimited access, upgrade to our premium plan.
                </p>
                <div className="benefits-list">
                    <h3>Premium Benefits:</h3>
                    <ul>
                        <li>✓ Unlimited document organization</li>
                        <li>✓ Priority support</li>
                        <li>✓ Advanced features</li>
                        <li>✓ Early access to new updates</li>
                    </ul>
                </div>
                <a
                    href="https://nardium.app/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="upgrade-button"
                >
                    Upgrade Now
                </a>
            </div>
        </div>
    );
};

export default DocumentLimit; 