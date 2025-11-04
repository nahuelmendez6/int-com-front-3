// src/components/StarRating.jsx
// =====================================================
// Componente: StarRating
// -----------------------------------------------------
// Este componente renderiza un sistema de calificación
// mediante estrellas (★★★★★), con soporte para modo lectura
// o edición interactiva.
//
// Características principales:
//  - Muestra estrellas llenas, medias (si aplica) y vacías.
//  - Permite al usuario seleccionar una calificación (si no está en modo lectura).
//  - Reutilizable en formularios, vistas públicas o reseñas.
//
// Se usa en secciones donde se califica un servicio o proveedor.
// =====================================================

import React from 'react';

/**
 * Componente visual para mostrar y/o modificar una puntuación mediante estrellas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number} props.rating - Valor actual de la puntuación (de 0 a 5, admite decimales).
 * @param {Function} [props.setRating] - Función para actualizar la puntuación seleccionada.
 * @param {boolean} [props.readOnly=false] - Si es `true`, desactiva la interacción (solo lectura).
 *
 * @example
 * // Modo interactivo
 * <StarRating rating={3.5} setRating={setUserRating} />
 *
 * @example
 * // Modo lectura
 * <StarRating rating={4} readOnly />
 */
const StarRating = ({ rating, setRating, readOnly = false }) => {
  // Número de estrellas completas
  const fullStars = Math.floor(rating);

   // Indica si hay una media estrella
  const hasHalfStar = rating % 1 !== 0;

  // Calcula cuántas estrellas vacías quedan
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);


  /**
   * Maneja el clic del usuario para establecer una nueva puntuación.
   * Solo funciona si `readOnly` es falso.
   *
   * @param {number} index - Índice de la estrella clickeada.
   */
  const handleClick = (index) => {
    if (!readOnly && setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="star-rating" style={{ display: 'flex', gap: '4px', fontSize: '24px', cursor: readOnly ? 'default' : 'pointer' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full" onClick={() => handleClick(i)}>&#9733;</span>
      ))}
      {hasHalfStar && (
        <span className="star half" onClick={() => handleClick(fullStars)}>&#9733;</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty" onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}>&#9734;</span>
      ))}
    </div>
  );
};

export default StarRating;
