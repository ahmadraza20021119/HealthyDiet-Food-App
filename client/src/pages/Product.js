import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ₹{product.price}</li>
                ))}
            </ul>
        </div>
    );
}

export default Products;
