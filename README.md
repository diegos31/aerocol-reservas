# AeroCol — Reserva tu vuelo

App de React (Vite) para buscar vuelos entre ciudades de Colombia, elegir uno, reservarlo y ver tus reservas.

## Proyecto Final

### Qué hace la app

Buscas un vuelo por origen y destino, lo ordenas, lo eliges para ver su detalle y lo reservas con nombre, pasajeros y clase. Tus reservas se guardan en el navegador (`localStorage`) y siguen ahí al recargar la página.

### Árbol de componentes

```
App  (estado: origen, destino, orden, seleccionadoId, reservas)
├── Header
├── SelectorRuta
│   ├── SelectCiudad (origen)
│   └── SelectCiudad (destino)
├── SelectorOrden
├── ListaVuelos
│   └── TarjetaVuelo ×N
├── FormularioReserva   (estado local: nombre, pasajeros, claseId)
├── MisReservas
└── Footer
```

El análisis previo está en [`docs/fase-1-analisis.md`](docs/fase-1-analisis.md).

### F1 — Formulario de reserva

1. **¿Dónde viven los estados del formulario y por qué?** Dentro de `FormularioReserva` (`nombre`, `pasajeros`, `claseId`). Son locales: solo ese componente los usa para dibujar sus campos y calcular el total. `App` solo recibe el resultado cuando se presiona Reservar, a través de `onReservar`.
2. **¿Por qué el total no es un `useState`?** Porque se puede calcular siempre a partir de datos que ya existen: `precio × pasajeros × factor`. Si fuera un estado, habría que actualizarlo a mano al cambiar pasajeros, clase o vuelo, y podría quedar desincronizado. Calculado en cada render siempre es coherente. Uso `Math.round` para que el factor decimal (1.6, 2.4) no deje decimales de coma flotante.
3. **¿Qué prop le agregué a `TarjetaVuelo` y para qué?** `onSeleccionar`, una función que la tarjeta llama con `vuelo.id` para avisar a `App` que fue elegida, y `seleccionada`, un booleano que activa la clase CSS `seleccionada` y `aria-pressed`. Los datos suben, las funciones bajan.

### F2 — Mis reservas

1. **¿Por qué no mutar el array con `push`?** React decide si re-renderiza comparando referencias. `push` cambia el mismo array, así que `setReservas` recibiría la misma referencia: la pantalla puede no actualizarse y el `useEffect` que depende de `[reservas]` no se ejecutaría, por lo que no se guardaría. Con `[...prev, nueva]` y `filter` se crea un array nuevo.
2. **¿Qué pasa si recargo sin `localStorage`?** El estado vive en la memoria de la página. Al recargar, `useState` vuelve a empezar y las reservas se pierden.
3. **¿Dónde pongo la lógica de guardar y por qué?** Leer: `useState(cargarReservas)`, una función inicializadora que corre una sola vez al montar. Guardar: un `useEffect` en `App` con dependencia `[reservas]`. Así hay un solo lugar que guarda, sin importar quién cambie la lista (reservar o eliminar), y no se puede olvidar guardar en uno de los dos casos.

### F3 — Catálogo inteligente

1. **¿Por qué ordenar una copia?** `.sort()` modifica el array original. Eso rompe la inmutabilidad y puede alterar datos que otras partes de la app usan. Por eso `ordenarVuelos` hace `[...vuelos].sort(...)`.
2. **¿Qué pasó con el orden al cambiar de ruta?** Se mantiene. El estado `orden` vive en `App` y no depende de la ruta; cambiar origen o destino no lo toca.
3. **¿Cómo le avisa la tarjeta a `App` que fue seleccionada?** `App` define `seleccionar` y lo baja como `onSeleccionar` por `ListaVuelos` hasta `TarjetaVuelo`. Al hacer clic, la tarjeta llama `onSeleccionar(vuelo.id)` y `App` actualiza `seleccionadoId`.

### Cómo correr la app

```bash
npm install   # solo la primera vez
npm run dev
```

Verificación: `npm run lint` y `npm run build` pasan sin errores.

### Decisión de diseño más importante

Guardo en el estado solo el **id** del vuelo seleccionado (`seleccionadoId`) y no el objeto completo del vuelo. El vuelo seleccionado se obtiene en cada render con `vuelosEncontrados.find(...)`. Así hay una sola fuente de verdad (el catálogo) y no existe una copia que pueda quedar desactualizada o apuntar a un vuelo de otra ruta. La alternativa que descarté fue guardar el objeto entero en el estado: funciona, pero duplica datos que ya están en `VUELOS`. Además, al cambiar de ruta limpio `seleccionadoId` para que el formulario desaparezca y la tarjeta no aparezca resaltada al volver.

### Nota para la demo

En el catálogo base cada ruta tiene un solo vuelo, así que "Ordenar por" no cambia nada visible. Para mostrar el orden en acción, agrega vuelos de prueba a una misma ruta en `src/data/vuelos.js`.
