import { useState } from 'react'
import { CLASES } from '../data/vuelos.js'
import { formatoPrecio } from '../utils/formato.js'

function FormularioReserva({ vuelo, onReservar }) {
  // Estado LOCAL del formulario: solo este componente lo necesita
  const [nombre, setNombre] = useState('')
  const [pasajeros, setPasajeros] = useState(1)
  const [claseId, setClaseId] = useState(CLASES[0].id)

  // Estado DERIVADO: se calcula en cada render, no se guarda
  const clase = CLASES.find((c) => c.id === claseId)
  const total = Math.round(vuelo.precio * pasajeros * clase.factor)
  const nombreVacio = nombre.trim() === ''

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (nombreVacio) return

    onReservar({ nombre: nombre.trim(), pasajeros, clase: clase.nombre, total })

    setNombre('')
    setPasajeros(1)
    setClaseId(CLASES[0].id)
  }

  return (
    <form className="reserva" onSubmit={manejarSubmit}>
      <h2>
        🎟️ Reservar {vuelo.avion} · {vuelo.hora}
      </h2>
      <p className="detalle">
        {vuelo.avion}, sale a las {vuelo.hora}, {formatoPrecio(vuelo.precio)} por pasajero
      </p>

      <label className="campo">
        Nombre del pasajero
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Ana García"
        />
      </label>

      <div className="pasajeros">
        <span>👥 Pasajeros</span>
        <button
          type="button"
          aria-label="Quitar un pasajero"
          onClick={() => setPasajeros(pasajeros - 1)}
          disabled={pasajeros <= 1}
        >
          −
        </button>
        <output aria-live="polite">{pasajeros}</output>
        <button
          type="button"
          aria-label="Agregar un pasajero"
          onClick={() => setPasajeros(pasajeros + 1)}
        >
          +
        </button>
      </div>

      <fieldset className="clases">
        <legend>Clase</legend>
        {CLASES.map((c) => (
          <label key={c.id}>
            <input
              type="radio"
              name="clase"
              value={c.id}
              checked={claseId === c.id}
              onChange={() => setClaseId(c.id)}
            />{' '}
            {c.nombre} ×{c.factor}
          </label>
        ))}
      </fieldset>

      <div className="reserva-pie">
        <p className="total">💰 Total: {formatoPrecio(total)}</p>
        <button type="submit" className="btn-reservar" disabled={nombreVacio}>
          ✅ Reservar
        </button>
      </div>
    </form>
  )
}

export default FormularioReserva
