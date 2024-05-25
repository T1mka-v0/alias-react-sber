import React from 'react';
import './modal.css'
import { Button } from '@salutejs/plasma-ui';

const Modal = ({ isOpen, onClose, buttonText, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='modal' onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <div className='button-wrap'><Button onClick={onClose}>{buttonText || 'ОК'}</Button></div>
      </div>
    </div>
  );
};

export default Modal;
