function SelectorOrden({ value, opciones, onCambio }) {
  return (
    <label className="campo orden">
      Ordenar por
      <select value={value} onChange={(e) => onCambio(e.target.value)}>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SelectorOrden
