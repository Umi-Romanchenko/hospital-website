(function() {
  function toggleCallButton() {
    var btn = document.querySelector('.fixed-call-btn');
    if (btn) {
      btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    }
  }
  
  toggleCallButton();
  window.addEventListener('resize', toggleCallButton);
})();