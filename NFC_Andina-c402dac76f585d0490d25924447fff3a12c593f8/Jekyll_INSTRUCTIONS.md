Qué añadí

- `_config.yml` — configuración mínima para Jekyll + collection `people`.
- `_layouts/person.html` — tu plantilla convertida a layout con variables Liquid (`{{ page.name }}`, `{{ page.phone }}`...).
- `_people/valentina.md` — ejemplo de persona (front matter con los campos).
- `people/index.html` — listado simple que enlaza a cada ficha.

Cómo funciona ahora

- Cada archivo en `_people/` produce una página en `/people/<nombre>/` (según `permalink`).
- Si editas `_layouts/person.html` y haces push a GitHub, Pages recompilará el site y todas las fichas usarán la nueva plantilla.

Probar localmente

Opción A — (requiere Ruby + Jekyll instalado)
1. Instala Ruby y Bundler si aún no lo tienes.
2. En PowerShell, en la carpeta del proyecto:

```powershell
cd 'D:\NFC_Andina'
# instala jekyll y bundler si es necesario
gem install jekyll bundler
# arranca server
jekyll serve --watch
```

Opción B — (sin Ruby): Subir a GitHub y activar Pages
en el repositorio: GitHub Pages compilará el sitio automáticamente.

Notas y recomendaciones

- Reemplaza `url` en `_config.yml` por la URL real si quieres que `site.url` sea correcta.
- Si prefieres no usar Jekyll localmente, puedes configurar un workflow de GitHub Actions para compilar con Gems y desplegar.
- Si quieres que la página principal (`index.html`) muestre el directorio, puedo adaptar `index.html` para redirigir o renderizar la lista.

Siguientes pasos

Dime si quieres que:
- adapte `index.html` para usar el layout o listar personas;
- añada un formulario para crear nuevas fichas desde el navegador;
- añada un workflow de GitHub Actions que construya y publique el sitio automáticamente.
