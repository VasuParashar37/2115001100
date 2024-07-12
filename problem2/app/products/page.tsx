'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getRandomImageUrl } from '@/utils/utils';

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(Infinity);
    const [availability, setAvailability] = useState<boolean | null>(null);
    const [sortOption, setSortOption] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    'http://20.244.56.144/test/companies/:companyname/categories/categoryname/products?top=n&minPrice-p&maxPrice q'
                );
                if (response.status === 200) {
                    setProducts(response.data);
                    setFilteredProducts(response.data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchCategoriesAndCompanies = async () => {
            try {
                const categoriesResponse = await axios.get('http://20.244.56.144/test/companies/categories');
                const companiesResponse = await axios.get('http://20.244.56.144/test/companies');

                if (categoriesResponse.status === 200 && companiesResponse.status === 200) {
                    setCategories(categoriesResponse.data);
                    setCompanies(companiesResponse.data);
                } else {
                    console.error('Failed to fetch categories or companies');
                }
            } catch (error) {
                console.error('Error fetching categories or companies:', error);
            }
        };

        fetchProducts();
        fetchCategoriesAndCompanies();
    }, []);

    const applyFilters = () => {
        let filtered = [...products];

        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        if (selectedCompany) {
            filtered = filtered.filter(product => product.company === selectedCompany);
        }
        if (rating !== null) {
            filtered = filtered.filter(product => product.rating >= rating);
        }
        if (minPrice !== 0 || maxPrice !== Infinity) {
            filtered = filtered.filter(
                product => product.price >= minPrice && product.price <= maxPrice
            );
        }
        if (availability !== null) {
            filtered = filtered.filter(product => product.availability === availability);
        }

        if (sortOption === 'price') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'discount') {
            filtered.sort((a, b) => b.discount - a.discount);
        }

        setFilteredProducts(filtered);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>
            <div className="filters flex flex-wrap gap-4 mb-4">
                <label className="flex flex-col">
                    Category:
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded text-black"
                    >
                        <option value="">All</option>
                        <option value="Phone">Phone</option>
                        <option value="Computer">Computer</option>
                        <option value="TV">TV</option>
                        <option value="Earphone">Earphone</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Charger">Charger</option>
                        <option value="Mouse">Mouse</option>
                        <option value="KeyPad">KeyPad</option>
                        <option value="Bluetooth">Bluetooth</option>
                        <option value="Pendrive">Pendrive</option>
                        <option value="Remote">Remote</option>
                        <option value="Speaker">Speaker</option>
                        <option value="HeadSet">HeadSet</option>
                        <option value="Laptop">Laptop</option>
                        <option value="PC">PC</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    Company:
                    <select
                        value={selectedCompany}
                        onChange={e => setSelectedCompany(e.target.value)}
                        className="border p-2 rounded text-black"
                    >
                        <option value="AMZ">AMZ</option>
                        <option value="FLP">FLP</option>
                        <option value="SNP">SNP</option>
                        <option value="MYN">MYN</option>
                        <option value="AZO">AZO</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    Rating:
                    <input
                        type="number"
                        value={rating ?? ''}
                        onChange={e => setRating(Number(e.target.value) || null)}
                        className="border p-2 rounded text-black"
                    />
                </label>
                <label className="flex flex-col">
                    Price Range:
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={e => setMinPrice(Number(e.target.value))}
                            className="border p-2 rounded text-black"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice === Infinity ? '' : maxPrice}
                            onChange={e => setMaxPrice(Number(e.target.value) || Infinity)}
                            className="border p-2 rounded text-black"
                        />
                    </div>
                </label>
                <label className="flex flex-col">
                    Availability:
                    <select
                        value={availability === null ? '' : availability ? 'true' : 'false'}
                        onChange={e =>
                            setAvailability(e.target.value === '' ? null : e.target.value === 'true')
                        }
                        className="border p-2 rounded text-black"
                    >
                        <option value="">All</option>
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    Sort By:
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="border p-2 rounded text-black"
                    >
                        <option value="">None</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="discount">Discount</option>
                    </select>
                </label>
                <button onClick={applyFilters} className="bg-blue-500 text-white p-2 rounded">
                    Apply Filters
                </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product: any) => (
                    <li key={product.id} className="border p-4 rounded">
                        <h2 className="font-bold">{product.name}</h2>
                        <img src={getRandomImageUrl()} alt={product.productName} className="mx-auto mb-4" />
                        <p>Rating: {product.rating}</p>
                        <p>Discount: {product.discount}%</p>
                        <p>Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
                        <p>Price: ${product.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductsPage;
