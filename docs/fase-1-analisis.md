# Fase 1 — Análisis de AeroCol (sin código)

## 1. Respuestas

**1. ¿Dónde viven hoy `origen` y `destino`? ¿Por qué ahí y no en `SelectCiudad`?**
En `App`. `App` necesita los dos valores para calcular `ciudadesDestino` (todas menos el origen) y `vuelosEncontrados` (el filtro del catálogo). `SelectCiudad` solo dibuja un select: si cada uno guardara su valor, `App` no se enteraría de lo que eligió el usuario. Es *lifting state up*: el estado vive en el ancestro común que lo necesita.

**2. ¿Qué más debe recibir `ListaVuelos` para que una tarjeta sea seleccionable?**
Dos props nuevas: `seleccionadoId` (qué vuelo está elegido, para resaltarlo) y `onSeleccionar` (una función para avisar a `App`). `ListaVuelos` las pasa a cada `TarjetaVuelo`, que además recibe `seleccionada` (booleano) en lugar del id.

**3. ¿Qué datos guarda una reserva?**

```js
{
  id: 'c1b2…',          // crypto.randomUUID(), único
  nombre: 'Ana García', // pasajero
  vuelo: 'v4',          // id del vuelo reservado
  pasajeros: 2,
  clase: 'Ejecutiva',   // nombre de la clase elegida
  total: 832000,        // calculado al reservar y guardado como registro
  fecha: '12/11/2026'   // día en que se hizo la reserva (es-CO)
}
```

**4. ¿Dónde vive el estado de las reservas y por qué?**
En `App`. Las reservas las crea `FormularioReserva` y las muestra `MisReservas`; son componentes hermanos, así que el ancestro común es `App`. Ahí también se carga y se guarda en `localStorage`.

## 2. Árbol de componentes futuro

```
App  (estado: origen, destino, orden, seleccionadoId, reservas)
├── Header                 props: aerolinea, eslogan
├── SelectorRuta           props: origen, destino, ciudades, ciudadesDestino, onOrigen, onDestino
│   ├── SelectCiudad (origen)
│   └── SelectCiudad (destino)
├── SelectorOrden   🆕     props: value, opciones, onCambio
├── ListaVuelos            props: vuelos (ya ordenados), nombreOrigen, nombreDestino,
│   │                             seleccionadoId 🆕, onSeleccionar 🆕
│   └── TarjetaVuelo ×N    props: vuelo, seleccionada 🆕, onSeleccionar 🆕
├── FormularioReserva 🆕   props: vuelo, onReservar
│                          (estado local: nombre, pasajeros, claseId)
├── MisReservas       🆕   props: reservas, onEliminar
└── Footer                 props: anio
```

`FormularioReserva` queda como hijo de `App` (hermano de `ListaVuelos`) y no dentro de `TarjetaVuelo`: necesita `onReservar` y el vuelo elegido, y ponerlo dentro de la tarjeta obligaría a pasar esas props por `ListaVuelos` solo para atravesarla.
