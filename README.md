E-card móvil (HTML/CSS/JS)

Descripción
- Sitio estático que replica la e-card adjunta usando solo HTML, CSS y JS.
- Diseño móvil (mobile-first) y compatible con GitHub Pages. Coloca el repo en GitHub y habilita GitHub Pages desde la rama `main`.

Archivos generados
- `index.html` — HTML principal.
- `css/styles.css` — Estilos responsivos.
- `js/script.js` — Pequeños manejadores para botones (tel, mail, web).

Personalización rápida
- Reemplaza la imagen del avatar: hay una referencia a `Ecard.jpg` en `index.html`. Si quieres otra imagen, sustituye el archivo o cambia el `src` del `img`.
- Modifica teléfono, email y web en `js/script.js` y en el HTML si lo deseas.

Cómo probar localmente (Windows)
- Simplemente abre `index.html` en el navegador.
- O sirve en un servidor local rápido (ejemplo con Python 3):

  ```powershell
  python -m http.server 8000
  ```

Publicar en GitHub Pages
- Crea un repo, sube todos los archivos, habilita Pages desde `main` branch -> `/ (root)`.

Notas
- Todos los iconos son SVG inline y los colores fueron seleccionados para aproximarse a la paleta de la imagen adjunta.
