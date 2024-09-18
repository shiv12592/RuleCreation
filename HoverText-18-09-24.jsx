import React from 'react';
import './HoverText.css';

const HoverText = () => {
  return (
    <div className="hover-container">
      Hover over this text
      <div className="hover-text">This is the hover text!</div>
    </div>
  );
};

export default HoverText;


.hover-container {
  position: relative;
  display: inline-block;
}

.hover-text {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position the tooltip above the text */
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.hover-container:hover .hover-text {
  visibility: visible;
  opacity: 1;
}
