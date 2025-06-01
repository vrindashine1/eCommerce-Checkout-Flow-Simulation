
import React, {
    useState,
    useEffect
} from 'react';
import axios from 'axios';
import {
    useNavigate
} from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleBuyNow = (product) => {
        // For simplicity, hardcode quantity and variant for direct buy now
        const selectedProduct = { ...product,
            quantity: 1,
            variant: product.variants[0]?.color || ''
        };
        navigate('/checkout', {
            state: {
                product: selectedProduct
            }
        });
    };

    return ( 
    <div className = "landing-page">
        <h1> Our Products </h1> 
        <div className = "product-grid"> {
            products.map((product) => ( 
                <div key = {product.id}
                className = "product-card" >
                <img src = {
                    product.imageUrl
                }
                alt = {
                    product.name
                }
                className = "product-image" />
                <h2 className = "product-title" > {
                    product.name
                } </h2> 
                <p className = "product-description" > {
                    product.description.substring(0, 100)
                }... </p> <p className = "product-price" > Rs. {
                    product.price.toFixed(2)
                } </p> {
                    product.hasOptions ? ( 
                        <button onClick = {
                            () => handleBuyNow(product)
                        }
                        className = "choose-options-btn" >
                        Add to cart </button>
                    ) : ( <button onClick = {
                            () => handleBuyNow(product)
                        }
                        className = "add-to-cart-btn" >
                        Add to cart </button>
                    )} 
                    </div>
            ))
        } </div> 
        </div>
    );
}
export default LandingPage;

