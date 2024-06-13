import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productsAPI';
import { ProductModel } from '../models/models';

// Definición del tipo para tus productos
interface Product {
  nombre: string;
  descripcion?: string;
  visitas?: number;
  localizacion: string;
  categoria_id: string;
}

const ProductHeader: React.FC = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
      } catch (error) {
        // Manejo del error
        console.error('Failed to load products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Aquí iría el JSX que renderiza tu header y posiblemente una lista o un carrusel de productos
  return (
    <header>
      {/* Aquí podrías mapear y renderizar tus productos */}
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.nombre_producto}</h2>
          <p>{product.descripcion}</p>
          {/* Más detalles del producto */}
        </div>
      ))}
    </header>
  );
};

export default ProductHeader;
