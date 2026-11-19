import { formatoPrecio } from '../utils/formato.js'

function MisReservas({ reservas, onEliminar }) {
  return (
    <section className="reservas">
      <h2>🎫 Mis reservas ({reservas.length})</h2>

      {reservas.length === 0 ? (
        <p className="mensaje">Aún no tienes reservas 👀</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id} className="reserva-item">
              <div>
                <strong>{r.nombre}</strong>
                <p>
                  {r.pasajeros} pasajero{r.pasajeros !== 1 ? 's' : ''} · {r.clase} · Vuelo{' '}
                  {r.vuelo} · {formatoPrecio(r.total)}
                </p>
                <small>Reservado el {r.fecha}</small>
              </div>
              <button
                type="button"
                className="btn-eliminar"
                aria-label={`Eliminar la reserva de ${r.nombre}`}
                onClick={() => onEliminar(r.id)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MisReservas
