export interface ProductModel {
    producto_id: number;
    nombre_producto?: string;
    marca?: string;
    modelo?: string;
    descripcion?: string;
    precio: number;
    disponibilidad?: 'disponible' | 'reservado' | 'vendido';
    localizacion?: string;
    categoria_id?: number;
    categoria?: string;
    vendedor_id: number;
    fecha_publicacion: string;
    imagen?: string
  }
  

  export interface Message {
    mensaje_id: number;
    producto_id: number;
    id_usuario_envia: number;
    id_usuario_recibe: number;
    contenido: string;
    fecha_envio: Date;
    leido: boolean;
  }