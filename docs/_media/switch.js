function createThemeSwitcher() {
    // Crear el botón switch
    const switchBtn = document.createElement('button');
    switchBtn.id = 'theme-switch';
    switchBtn.innerHTML = '🌓';
    switchBtn.setAttribute('aria-label', 'Cambiar tema');

    // Crear estilos para el botón
    const style = document.createElement('style');
    style.textContent = `
    #theme-switch {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s, transform 0.2s;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    #theme-switch:hover {
      transform: scale(1.05);
    }
    #theme-switch.light-theme {
      background-color: #f0f0f0;
      color: #333;
    }
    #theme-switch.light-theme:hover {
      background-color: #444;
    }
    #theme-switch.dark-theme {
      background-color: #333;
      color: #fff;
    }
    #theme-switch.dark-theme:hover {
      background-color: #e0e0e0;
    }
  `;

    // Agregar estilos al head
    document.head.appendChild(style);

    // Agregar el botón al body
    document.body.appendChild(switchBtn);

    const lightTheme = 'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css';
    const darkTheme =
        'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css';

    // Función para obtener el tema inicial
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Función para aplicar el tema
    function applyTheme(theme) {
        const linkElement = document.getElementById('theme-style');
        if (linkElement) {
            linkElement.href = theme === 'dark' ? darkTheme : lightTheme;
        }
        switchBtn.classList.remove('light-theme', 'dark-theme');
        switchBtn.classList.add(theme === 'dark' ? 'light-theme' : 'dark-theme');
        localStorage.setItem('theme', theme);
    }

    // Función para cambiar el tema
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Configurar el tema inicial
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    // Agregar evento de clic al botón
    switchBtn.addEventListener('click', toggleTheme);

    // Escuchar cambios en la preferencia de color del sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Ejecutar la función al final del renderizado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createThemeSwitcher);
} else {
    createThemeSwitcher();
}
