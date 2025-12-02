import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { FaFileExcel, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
// Importamos los servicios corregidos
import { mangaService, authorService, categoryService } from '../../services/api';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Estado del formulario
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    price: '', 
    stock: '', 
    authorId: '', 
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mangasData, authorsData, catsData] = await Promise.all([
        mangaService.getAll(),
        authorService.getAll(),
        categoryService.getAll()
      ]);

      if (mangasData) setProducts(mangasData);
      // Aseguramos que sea un array por si la API devuelve null o estructura diferente
      if (authorsData) setAuthors(Array.isArray(authorsData) ? authorsData : []);
      if (catsData) setCategories(Array.isArray(catsData) ? catsData : []);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
      // No mostramos alerta aquí para no ser invasivos al cargar
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // 1. VALIDACIÓN PREVIA (Evita el Error 500)
    if (!newProduct.authorId || !newProduct.categoryId) {
      alert("⚠️ Por favor selecciona un Autor y una Categoría válidos.");
      return;
    }

    try {
      // 2. CONVERSIÓN DE DATOS
      const payload = {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        // Convertimos a entero. Si fallara, la validación de arriba nos protege
        authorId: parseInt(newProduct.authorId), 
        categoryId: parseInt(newProduct.categoryId),
        imageUrl: newProduct.imageUrl
      };

      console.log("Enviando producto:", payload); // Para depuración

      await mangaService.create(payload);
      
      alert("¡Manga creado exitosamente!");
      loadData(); // Recargar la tabla
      
      // Limpiar form
      setNewProduct({ title: '', price: '', stock: '', authorId: '', categoryId: '', imageUrl: '' });
    } catch (error) {
      console.error(error);
      alert(`Error al crear manga: ${error.message}`);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">PANEL DE ADMINISTRACIÓN</h1>
        <button className="btn-export" onClick={() => mangaService.exportExcel()}>
          <FaFileExcel /> Exportar Reporte
        </button>
      </div>

      {/* FORMULARIO */}
      <div className="admin-form-card">
        <h3><FaPlus /> Agregar Nuevo Manga</h3>
        <form onSubmit={handleAddProduct}>
          <div className="form-row">
            <input 
              type="text" name="title" placeholder="Título" className="admin-input" 
              value={newProduct.title} onChange={handleInputChange} required
            />
            <input 
              type="number" name="price" placeholder="Precio (S/)" className="admin-input" 
              value={newProduct.price} onChange={handleInputChange} required
            />
          </div>
          
          <div className="form-row">
            {/* SELECTOR AUTORES: Maneja id o Id */}
            <select 
              name="authorId" className="admin-input"
              value={newProduct.authorId} onChange={handleInputChange} required
            >
              <option value="">-- Seleccionar Autor --</option>
              {authors.map(auth => (
                <option key={auth.id || auth.Id} value={auth.id || auth.Id}>
                  {auth.name || auth.Name}
                </option>
              ))}
            </select>

            {/* SELECTOR CATEGORÍAS */}
            <select 
              name="categoryId" className="admin-input"
              value={newProduct.categoryId} onChange={handleInputChange} required
            >
              <option value="">-- Seleccionar Categoría --</option>
              {categories.map(cat => (
                <option key={cat.id || cat.Id} value={cat.id || cat.Id}>
                  {cat.name || cat.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <input 
              type="number" name="stock" placeholder="Stock" className="admin-input"
              value={newProduct.stock} onChange={handleInputChange} required
            />
            <input 
              type="text" name="imageUrl" placeholder="URL Imagen" className="admin-input"
              value={newProduct.imageUrl} onChange={handleInputChange} 
            />
          </div>
          
          <button type="submit" className="btn-save">GUARDAR PRODUCTO</button>
        </form>
      </div>

      {/* TABLA - Solo visualización básica */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id || product.Id}>
                <td>{product.id || product.Id}</td>
                <td>{product.title || product.Title}</td>
                <td>S/ {(product.price || product.Price || 0).toFixed(2)}</td>
                <td>{product.stock || product.Stock}</td>
                <td>
                  <button className="btn-action btn-delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;