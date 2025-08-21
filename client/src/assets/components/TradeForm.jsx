import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/tradeForm.module.css';

function TradeForm({ onAddTrade, selectedStrategy }) {
  const [formData, setFormData] = useState({
    date: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.entryPrice || formData.entryPrice <= 0) newErrors.entryPrice = 'Valid entry price is required';
    if (!formData.exitPrice || formData.exitPrice <= 0) newErrors.exitPrice = 'Valid exit price is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    if (formData.date && formData.entryPrice && formData.exitPrice && formData.quantity) {
      const quantity = parseInt(formData.quantity);
      const tradeData = { ...formData, quantity, strategy: selectedStrategy };
      
      try {
        await axios.post('/api/addTrade', tradeData);
        onAddTrade(tradeData);
        setFormData({
          date: '',
          entryPrice: '',
          exitPrice: '',
          quantity: '',
        });
      } catch (error) {
        console.error('Error submitting trade data:', error);
        setErrors({ submit: 'Failed to add trade. Please try again.' });
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.tradeForm} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Add New Trade</h2>
        
        <div className={styles.formColumns}>
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date"
                name="date" 
                value={formData.date} 
                onChange={handleChange}
                className={errors.date ? styles.inputError : ''}
              />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="entryPrice">Entry Price (₹)</label>
              <input 
                type="number" 
                id="entryPrice"
                name="entryPrice" 
                value={formData.entryPrice} 
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.entryPrice ? styles.inputError : ''}
              />
              {errors.entryPrice && <span className={styles.errorText}>{errors.entryPrice}</span>}
            </div>
          </div>
          
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="exitPrice">Exit Price (₹)</label>
              <input 
                type="number" 
                id="exitPrice"
                name="exitPrice" 
                value={formData.exitPrice} 
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.exitPrice ? styles.inputError : ''}
              />
              {errors.exitPrice && <span className={styles.errorText}>{errors.exitPrice}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input 
                type="number" 
                id="quantity"
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange}
                min="1"
                className={errors.quantity ? styles.inputError : ''}
              />
              {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Adding Trade...
            </>
          ) : (
            'Add Trade'
          )}
        </button>
        
        {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
      </form>
    </div>
  );
}

export default TradeForm;