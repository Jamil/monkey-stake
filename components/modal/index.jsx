const UnstakeModal = ({show, onCancel, onConfirm}) => {
  return <div className={`unstake-modal-wrapper ${show ? 'visible' : 'hidden'}`}>
    <div id="modal-card">
      <h1>Before you unstake...</h1>
      <p>Make sure to harvest any unclaimed BANANA before unstaking, or any unclaimed BANANA for this monkey will be lost.</p>
      <div id="button-row">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm} className="inverted">Confirm</button>
      </div>
    </div>
  </div>
} 

export default UnstakeModal;