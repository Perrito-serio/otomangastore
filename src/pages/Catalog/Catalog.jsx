import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { mangaService, categoryService } from '../../services/api';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilterId, setActiveFilterId] = useState('Todos'); 
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mangasData, catsData] = await Promise.all([
          mangaService.getAll(),
          categoryService.getAll()
        ]);

        // Validación extra: Si la API falla y devuelve null, usamos array vacío
        if (mangasData) setProducts(mangasData);
        if (catsData) setCategories(catsData);
      } catch (error) {
        console.error("Error cargando catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = activeFilterId === 'Todos' 
    ? products 
    : products.filter(p => p.categoryId === activeFilterId || p.CategoryId === activeFilterId); 

  if (loading) return <div style={{padding: '4rem', textAlign: 'center'}}>Cargando catálogo...</div>;

  return (
    <div className="catalog-container">
      <section className="cat-hero">
        <div className="cat-hero-left">
          <div className="cat-title-box">
            <h1 className="cat-title-main">CATÁLOGO</h1>
          </div>
        </div>
        <div className="cat-hero-right">
          <img 
            src="https://images.unsplash.com/photo-1612163554047-98105110c04b?q=80&w=1920&auto=format&fit=crop" 
            alt="Manga Shelf" 
            className="cat-hero-img" 
          />
        </div>
      </section>

      <div className="cat-layout">
        <aside className="cat-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">CATEGORÍAS <span>-</span></h3>
            <ul className="filter-list">
              <li 
                className={`filter-item ${activeFilterId === 'Todos' ? 'active' : ''}`}
                onClick={() => setActiveFilterId('Todos')}
              >
                Todos
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.id || cat.Id}
                  className={`filter-item ${activeFilterId === (cat.id || cat.Id) ? 'active' : ''}`}
                  onClick={() => setActiveFilterId(cat.id || cat.Id)}
                >
                  {cat.name || cat.Name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="cat-grid-area">
          <div className="cat-controls">
            <span style={{color: '#888'}}>Mostrando {filteredProducts.length} resultados</span>
          </div>

          {filteredProducts.length === 0 ? (
            <p>No se encontraron mangas.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                // Preparamos los datos seguros
                const safePrice = product.price || product.Price || 0;
                // Usamos placehold.co que es más estable
                const safeImage = product.imageUrl || product.ImageUrl || 'https://placehold.co/220x330?text=Sin+Imagen';

                return (
                  <div key={product.id || product.Id} className="product-card">
                    <div className="card-image-container">
                      <img 
                        src={safeImage} 
                        alt={product.title || product.Title} 
                        className="card-img" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/220x330?text=Error+Carga'; }}
                      />
                      
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart({
                          id: product.id || product.Id,
                          title: product.title || product.Title,
                          price: safePrice, // Enviamos precio validado
                          image: safeImage
                        })}
                      >
                        AGREGAR
                      </button>
                    </div>
                    <div className="card-info">
                      <h3 className="card-title">{product.title || product.Title}</h3>
                      <p className="card-price">S/ {safePrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Catalog;