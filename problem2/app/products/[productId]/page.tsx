'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const page = () => {
    const router = useRouter();
    const { productId } = router.query;
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (productId) {
            const fetchProductDetails = async () => {
                try {
                    const response = await axios.get(
                        `http://20.244.56.144/test/products/${productId}`
                    );
                    if (response.status === 200) {
                        setProduct(response.data);
                    } else {
                        console.error('Failed to fetch product details');
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            };

            fetchProductDetails();
        }
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded">
                    <h2 className="font-bold">Product Details</h2>
                    <p>Company: {product.company}</p>
                    <p>Category: {product.category}</p>
                    <p>Rating: {product.rating}</p>
                    <p>Discount: {product.discount}%</p>
                    <p>Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
                    <p>Price: ${product.price}</p>
                </div>
                <div className="border p-4 rounded">
                    <h2 className="font-bold">Product Description</h2>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default page;
