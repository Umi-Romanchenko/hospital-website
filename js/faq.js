(function() {
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var faqItem = this.parentElement;
      var isActive = faqItem.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(function(item) {
        item.classList.remove('active');
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
})();