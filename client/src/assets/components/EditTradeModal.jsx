import React, { useState, useEffect } from 'react';
import '../css/editTradeModal.css';

function EditTradeModal({ trade, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...trade });

  useEffect(() => {
    setFormData({ ...trade });
  }, [trade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Trade</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <label>Entry Price:</label>
          <input type="number" name="entryPrice" value={formData.entryPrice} onChange={handleChange} required />
          <label>Exit Price:</label>
          <input type="number" name="exitPrice" value={formData.exitPrice} onChange={handleChange} required />
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditTradeModal;
