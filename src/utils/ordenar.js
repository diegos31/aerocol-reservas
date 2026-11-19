// Devuelve una COPIA ordenada: .sort() modifica el array original,
// y los vuelos filtrados no deben cambiar de orden "por debajo".
export function ordenarVuelos(vuelos, orden) {
  const copia = [...vuelos]

  switch (orden) {
    case 'precio-asc':
      return copia.sort((a, b) => a.precio - b.precio)
    case 'precio-desc':
      return copia.sort((a, b) => b.precio - a.precio)
    case 'hora':
      return copia.sort((a, b) => a.hora.localeCompare(b.hora))
    case 'avion':
      return copia.sort((a, b) => a.avion.localeCompare(b.avion, 'es'))
    default:
      return copia
  }
}
