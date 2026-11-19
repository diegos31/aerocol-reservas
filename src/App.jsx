import { useEffect, useState } from 'react'
import './App.css'
import { CIUDADES, VUELOS, ORDENES } from './data/vuelos.js'
import { ordenarVuelos } from './utils/ordenar.js'
import Header from './components/Header.jsx'
import SelectorRuta from './components/SelectorRuta.jsx'
import SelectorOrden from './components/SelectorOrden.jsx'
import ListaVuelos from './components/ListaVuelos.jsx'
import FormularioReserva from './components/FormularioReserva.jsx'
import MisReservas from './components/MisReservas.jsx'
import Footer from './components/Footer.jsx'

const CLAVE_RESERVAS = 'aerocol-reservas'

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

// F2: lee las reservas guardadas (si no hay, o están dañadas, empieza vacío)
function cargarReservas() {
  try {
    const guardado = localStorage.getItem(CLAVE_RESERVAS)
    const datos = guardado ? JSON.parse(guardado) : []
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function App() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [orden, setOrden] = useState(ORDENES[0].id) // F3
  const [seleccionadoId, setSeleccionadoId] = useState(null) // F1/F3
  const [reservas, setReservas] = useState(cargarReservas) // F2

  // F2: cada vez que cambian las reservas, se guardan
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas))
    } catch {
      // sin almacenamiento disponible: la app sigue funcionando sin guardar
    }
  }, [reservas])

  // Estado derivado: nada de esto se guarda en useState
  const ciudadesDestino = CIUDADES.filter((c) => c.codigo !== origen)
  const vuelosEncontrados =
    origen !== '' && destino !== ''
      ? VUELOS.filter((v) => v.origen === origen && v.destino === destino)
      : []
  const vuelosOrdenados = ordenarVuelos(vuelosEncontrados, orden)
  const vueloSeleccionado = vuelosEncontrados.find((v) => v.id === seleccionadoId) ?? null

  const manejarOrigen = (codigo) => {
    setOrigen(codigo)
    if (codigo === destino) setDestino('')
    setSeleccionadoId(null)
  }

  const manejarDestino = (codigo) => {
    setDestino(codigo)
    setSeleccionadoId(null)
  }

  const intercambiar = () => {
    setOrigen(destino)
    setDestino(origen)
    setSeleccionadoId(null)
  }

  // Clic en una tarjeta: la elige; otro clic en la misma, la quita
  const seleccionar = (id) => {
    setSeleccionadoId((actual) => (actual === id ? null : id))
  }

  const reservar = ({ nombre, pasajeros, clase, total }) => {
    const nueva = {
      id: crypto.randomUUID(),
      nombre,
      vuelo: vueloSeleccionado.id,
      pasajeros,
      clase,
      total,
      fecha: new Date().toLocaleDateString('es-CO'),
    }
    setReservas((prev) => [...prev, nueva])
  }

  const eliminarReserva = (id) => {
    setReservas((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <main>
      <Header aerolinea="AeroCol" eslogan="Tu vuelo en un clic" />

      <section className="selector">
        <h2>✈️ Busca tu vuelo</h2>

        <SelectorRuta
          origen={origen}
          destino={destino}
          ciudades={CIUDADES}
          ciudadesDestino={ciudadesDestino}
          onOrigen={manejarOrigen}
          onDestino={manejarDestino}
        />

        <button type="button" onClick={intercambiar} disabled={!origen || !destino}>
          🔄 Intercambiar
        </button>

        <SelectorOrden value={orden} opciones={ORDENES} onCambio={setOrden} />
      </section>

      {!origen || !destino ? (
        <p className="mensaje">Elige origen y destino para buscar vuelos 🛫</p>
      ) : vuelosEncontrados.length === 0 ? (
        <p className="mensaje">No hay vuelos para esa ruta 🙃</p>
      ) : (
        <ListaVuelos
          vuelos={vuelosOrdenados}
          nombreOrigen={nombreCiudad(origen)}
          nombreDestino={nombreCiudad(destino)}
          seleccionadoId={seleccionadoId}
          onSeleccionar={seleccionar}
        />
      )}

      {vueloSeleccionado && <FormularioReserva vuelo={vueloSeleccionado} onReservar={reservar} />}

      <MisReservas reservas={reservas} onEliminar={eliminarReserva} />

      <Footer anio={2026} />
    </main>
  )
}

export default App
