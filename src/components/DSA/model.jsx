// Modal.js
import React from 'react';
import './model.css';

function Modal({ onClose, message }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Modal;
