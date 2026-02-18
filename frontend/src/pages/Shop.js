import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import '../components/Shop.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const publicUrl = process.env.PUBLIC_URL || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки категорий');
        }
        const data = await response.json();
        const cats = data.results ? data.results : data;
        setCategories(cats);
        if (cats.length > 0 && !activeCategory) {
          setActiveCategory(cats[0].id);
        }
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError(err.message);
        setCategories([
          { id: 'premium', name: 'Премиум', slug: 'premium' }
        ]);
        setActiveCategory('premium');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (typeof activeCategory === 'number') {
          const response = await fetch(`${API_URL}/products/?category=${activeCategory}`);
          if (!response.ok) {
            throw new Error('Ошибка загрузки товаров');
          }
          const data = await response.json();
          const prods = data.results ? data.results : data;
          setProducts(prods);
        } else {
          const category = categories.find(cat => cat.slug === activeCategory || cat.id === activeCategory);
          if (category && category.id) {
            const response = await fetch(`${API_URL}/products/?category=${category.id}`);
            if (!response.ok) {
              throw new Error('Ошибка загрузки товаров');
            }
            const data = await response.json();
            const prods = data.results ? data.results : data;
            setProducts(prods);
          } else {
            setProducts([
              {
                id: 1,
                name: 'Silver',
                description: 'Привилегия Premium Silver со множеством бонусов сроком на 1 месяц',
                price: '500.00',
                currency: 'CP-COIN'
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, categories]);


  return (
    <div className="shop-page">
      <section className="shop-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="shop-background"></div>
        <div className="shop-container">
          <ScrollReveal animation="fadeUp">
            <h1 className="shop-title">МАГАЗИН</h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="shop-categories">
              {categories.map(category => (
                <button
                  key={category.id || category.slug}
                  className={`shop-category ${activeCategory === (category.id || category.slug) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id || category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </ScrollReveal>
          <div className="shop-items-grid">
            {loading ? (
              <div className="shop-empty-wrapper">
                <ScrollReveal animation="fadeUp">
                  <div className="shop-empty">
                    <p>Загрузка товаров...</p>
                  </div>
                </ScrollReveal>
              </div>
            ) : products.length === 0 ? (
              <div className="shop-empty-wrapper">
                <ScrollReveal animation="fadeUp">
                  <div className="shop-empty">
                    <p>Товары в этой категории скоро появятся</p>
                  </div>
                </ScrollReveal>
              </div>
            ) : (
              products.map((item, index) => (
                <ScrollReveal key={item.id} animation="fadeUp" delay={index * 0.1}>
                  <div className="shop-item">
                    <div className="shop-item-image">
                      {item.image_url || item.image ? (
                        <img src={item.image_url || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="shop-item-image-placeholder">
                          <span>Изображение</span>
                        </div>
                      )}
                    </div>
                    <div className="shop-item-content">
                      <div className="shop-item-header">
                        <h3 className="shop-item-name">{item.name}</h3>
                        <button className="shop-item-info" aria-label="Информация">?</button>
                      </div>
                      <p className="shop-item-description">{item.description}</p>
                      <div className="shop-item-footer">
                        <span className="shop-item-price">{parseFloat(item.price).toFixed(0)} {item.currency}</span>
                        <button className="shop-item-buy">Купить</button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
