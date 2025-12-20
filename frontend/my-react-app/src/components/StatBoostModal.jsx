import React from "react";

function StatBoostModal({ closeModal, boostStat }) {
  return (
    <div id="boostModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <i className="fas fa-bolt"></i>
            Boost Stats
          </div>
          <span className="close-btn" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </span>
        </div>

        <div className="boost-container">
          {/* Life Boost */}
          <div className="boost-item">
            <div className="boost-header">
              <div className="boost-name">
                <i className="fas fa-heart"></i>
                Life Boost
              </div>
              <div className="boost-cost">
                <i className="fas fa-clover"></i> 5 Luck
              </div>
            </div>
            <div className="boost-info">
              <div className="boost-current">
                Current: <strong id="boost-life-display">85</strong>
              </div>
              <button className="boost-btn" onClick={() => boostStat("life")}>
                Boost +<span id="life-boost-amount">10</span>
              </button>
            </div>
          </div>

          {/* Mana Boost */}
          <div className="boost-item">
            <div className="boost-header">
              <div className="boost-name">
                <i className="fas fa-magic"></i>
                Mana Boost
              </div>
              <div className="boost-cost">
                <i className="fas fa-clover"></i> 5 Luck
              </div>
            </div>
            <div className="boost-info">
              <div className="boost-current">
                Current: <strong id="boost-mana-display">120</strong>
              </div>
              <button className="boost-btn" onClick={() => boostStat("mana")}>
                Boost +<span id="mana-boost-amount">15</span>
              </button>
            </div>
          </div>

          {/* Power Boost */}
          <div className="boost-item">
            <div className="boost-header">
              <div className="boost-name">
                <i className="fas fa-fist-raised"></i>
                Power Boost
              </div>
              <div className="boost-cost">
                <i className="fas fa-clover"></i> 5 Luck
              </div>
            </div>
            <div className="boost-info">
              <div className="boost-current">
                Current: <strong id="boost-power-display">45</strong>
              </div>
              <button className="boost-btn" onClick={() => boostStat("power")}>
                Boost +<span id="power-boost-amount">8</span>
              </button>
            </div>
          </div>

          {/* Luck Info */}
          <div className="boost-info-box">
            <div>
              <strong>
                <i className="fas fa-clover"></i> Available Luck:
              </strong>{" "}
              <span id="luck-display">12</span>
              <br />
              <strong>
                <i className="fas fa-info-circle"></i> Cost:
              </strong>{" "}
              Each boost costs 5 luck points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatBoostModal;
