import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { mangaService } from '../../services/api'; // Importamos el servicio
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]); // Estado para los productos reales
  const [loading, setLoading] = useState(true); // Estado de carga
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { addToCart } = useCart();

  // 1. Cargar productos de la API al iniciar
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await mangaService.getAll();
        // Asegurarnos de que data sea un array (por si la API devuelve un objeto envuelto)
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Formato de datos inesperado:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  // 2. Filtrado (Adaptado para datos reales)
  // Nota: Asumimos que tu backend devuelve una propiedad 'category' o 'categoryName'.
  // Si tu backend devuelve categoryId, habría que mapear o filtrar por ID.
  const filteredProducts = activeFilter === 'Todos' 
    ? products 
    : products.filter(p => {
        // Ajusta 'categoryName' según cómo venga exactamente en tu JSON del backend
        const catName = p.category?.name || p.categoryName || 'Sin Categoría'; 
        return catName.toLowerCase() === activeFilter.toLowerCase();
      });

  if (loading) {
    return (
      <div className="catalog-container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <h2>Cargando catálogo...</h2>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      
      {/* HERO BANNER */}
      <section className="cat-hero">
        <div className="cat-hero-left">
          <div className="cat-title-box">
            <h1 className="cat-title-main">CATÁLOGO</h1>
          </div>
        </div>
        <div className="cat-hero-right">
          <img 
            src="/images/catalog/hero-banner.jpg" 
            alt="Manga Close Up" 
            className="cat-hero-img" 
          />
        </div>
      </section>

      <div className="cat-layout">
        
        {/* SIDEBAR FILTER */}
        <aside className="cat-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">CATEGORÍAS <span>-</span></h3>
            <ul className="filter-list">
              {/* Puedes hacer esto dinámico también si traes las categorías de la API */}
              {['Todos', 'Shonen', 'Seinen', 'Shojo', 'Kodomo'].map(cat => (
                <li 
                  key={cat}
                  className={`filter-item ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <section className="cat-grid-area">
          <div className="cat-controls">
            <span style={{marginRight: 'auto', color: '#666'}}>
              Mostrando {filteredProducts.length} resultados
            </span>
            <select className="sort-select">
              <option>Ordenar por: Relevancia</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <p>No se encontraron mangas en esta categoría.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="card-image-container">
                    {/* OJO: Tu backend usa 'imageUrl' en el POST, 
                      así que asumimos que devuelve 'imageUrl' en el GET.
                      Si la imagen viene rota, verifica si el campo se llama 'image' o 'imageUrl'.
                    */}
                    <img 
                      src={product.imageUrl || product.image || '/images/placeholder.jpg'} 
                      alt={product.title} 
                      className="card-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/220x330?text=No+Image'; }} 
                    />
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{product.title}</h3>
                    {/* Verificamos que price sea un número antes de toFixed */}
                    <p className="card-price">
                      S/ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Catalog;