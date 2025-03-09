import React, { useState } from 'react';
import '../styles/components/pricingModal.scss';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const monthlyPrice = 5; 
  const annualPrice = 48; 
  const displayPrice = isAnnual ? 4 : monthlyPrice;
  const billedText = isAnnual ? `*billed ${annualPrice}€ annually` : '';
  
  if (!isOpen) return null;

  return (
    <div className="pricing-modal-overlay">
      <div className="pricing-modal">
        <div className="pricing-modal-header">
          <h2>Upgrade to Premium for unlimited graphs</h2>
          <p>You have reached the monthly graph limit in the Free plan</p>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span className={!isAnnual ? 'active' : ''}>Monthly billing</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAnnual}
              onChange={() => setIsAnnual(!isAnnual)}
            />
            <span className="slider round"></span>
          </label>
          <span className={isAnnual ? 'active' : ''}>Annual billing</span>
        </div>

        <div className="pricing-plans">
          <div className="pricing-plan">
            <div className="plan-header">
              <h3>Free</h3>
              <div className="price">
                <span className="currency">EUR</span>
                <span className="amount">0</span>
              </div>
            </div>
            <div className="plan-features">
              <ul>
                <li>5 graphs per month</li>
                <li>All features included</li>
              </ul>
            </div>
            <button className="plan-button disabled">Current Plan</button>
            <p className="billed-annually empty-placeholder">&nbsp;</p>
          </div>

          <div className="pricing-plan premium">
            <div className="plan-header">
              <h3>Pro</h3>
              <div className="price">
                <span className="currency">EUR</span>
                <span className="amount">{displayPrice}</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="plan-features">
              <ul>
                <li>Unlimited graphs</li>
                <li>All features included</li>
                <li>[PLACEHOLDER]</li>
              </ul>
            </div>
            <button className="plan-button" onClick={() => window.open('/', '_blank')}>Upgrade</button>
            <p className="billed-annually" style={{ visibility: isAnnual ? 'visible' : 'hidden' }}>
              {isAnnual ? billedText : '\u00A0'}
            </p>
          </div>
        </div>

        <div className="pricing-footer">
          <p>Do you have any questions? <a href="/help">Check our FAQs</a> <br/> <a href="/contact">Contact Support </a></p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;