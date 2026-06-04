(function() {
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        burger.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  });
})();