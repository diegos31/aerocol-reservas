import { formatoPrecio } from '../utils/formato.js'

function TarjetaVuelo({ vuelo, seleccionada, onSeleccionar }) {
  return (
    <li className={seleccionada ? 'tarjeta seleccionada' : 'tarjeta'}>
      <button
        type="button"
        className="tarjeta-btn"
        aria-pressed={seleccionada}
        onClick={() => onSeleccionar(vuelo.id)}
      >
        <strong>🛩️ {vuelo.avion}</strong>
        <span>🕐 {vuelo.hora}</span>
        <b>{formatoPrecio(vuelo.precio)}</b>
        <span className="tarjeta-accion">{seleccionada ? '✔ Elegido' : 'Ver'}</span>
      </button>
    </li>
  )
}

export default TarjetaVuelo
