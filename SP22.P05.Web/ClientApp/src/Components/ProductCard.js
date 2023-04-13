import React from "react";
import "./ProductCard.css";

function ProductCard({ title, image, body, price }) {
  return (
      <div className="card-container">
          <div className="image-container">
              <img src={image} alt="" />
          </div>
          {/* content for the card */}
          <div className="card-content">
              <div className="card-title">
                  <h3>{title}</h3>
              </div>
              <div className="card-body">
                  <p>{body}</p>
              </div>
          </div>
      </div>
  );
}

export default ProductCard;
