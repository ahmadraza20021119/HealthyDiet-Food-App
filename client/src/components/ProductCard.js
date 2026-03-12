import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">{product.price}</p>
      <a className="btn" href="/login">Order Now</a>
    </div>
  );
};

export default ProductCard;
