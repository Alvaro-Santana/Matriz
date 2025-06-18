document.addEventListener('DOMContentLoaded', function() {
  const menuzaoContainer = document.querySelector('.menuzao');
  const sidebar = document.querySelector('.sidebar');
  const breakpoint = 999;

  if (!menuzaoContainer) {
    console.error("Erro: A div com a classe 'menuzao' não foi encontrada no HTML. Certifique-se de que ela existe e engloba a sidebar.");
    return;
  }
  if (!sidebar) {
    console.error("Erro: A nav com a classe 'sidebar' não foi encontrada no HTML.");
    return;
  }

  function createMenuToggleButtonElement() {
    const button = document.createElement('button');
    button.classList.add('menu-toggle');
    button.setAttribute('aria-label', 'Abrir Menu');
    button.innerHTML = '&#9776;';
    return button;
  }

  let currentMenuToggleButton = null;

  function handleMenuButtonAndSidebar() {
    if (window.innerWidth < breakpoint) {
      if (!currentMenuToggleButton) {
        currentMenuToggleButton = createMenuToggleButtonElement();
        currentMenuToggleButton.addEventListener('click', function() {
          sidebar.classList.toggle('active');
        });
        menuzaoContainer.insertBefore(currentMenuToggleButton, sidebar);
      }
      
    } else {
      if (currentMenuToggleButton) {
        currentMenuToggleButton.remove();
        currentMenuToggleButton = null;
      }
      sidebar.style.transform = '';
      sidebar.classList.remove('active');
    }
  }

  const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < breakpoint) {
        sidebar.classList.remove('active');
      }
    });
  });

  document.addEventListener('click', function(event) {
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedOnToggleButton = currentMenuToggleButton && currentMenuToggleButton.contains(event.target);

    if (window.innerWidth < breakpoint && sidebar.classList.contains('active')) {
      if (!clickedInsideSidebar && !clickedOnToggleButton) {
        sidebar.classList.remove('active');
      }
    }
  });

  handleMenuButtonAndSidebar();
  window.addEventListener('resize', handleMenuButtonAndSidebar);
});