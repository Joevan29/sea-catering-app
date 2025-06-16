import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  // Jika modal tidak terbuka, jangan render apa-apa
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal__content">
        <h2 className="heading heading--tertiary">{title}</h2>
        <div className="modal__body">
          {children}
        </div>
        <div className="modal__actions">
          <button onClick={onClose} className="btn btn--secondary">
            Batal
          </button>
          <button onClick={onConfirm} className="btn btn--danger">
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;