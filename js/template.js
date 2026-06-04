(function() {
  var path = window.location.pathname;
  var pageName = 'home';

  if (path.includes('/pages/')) {
    var fileName = path.split('/').pop().replace('.html', '');
    if (fileName) pageName = fileName;
  } else if (path.endsWith('index.html') || path === '/' || path === '') {
    pageName = 'home';
  }

  var basePath = path.includes('/pages/') ? '../' : '';

  // Загружаем шапку
  fetch(basePath + 'components/header.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      var header = div.querySelector('header');
      var nav = div.querySelector('nav');
      
      if (header) {
        document.body.insertBefore(header, document.body.firstChild);
      }
      if (nav) {
        var mainEl = document.querySelector('main');
        if (mainEl) {
          document.body.insertBefore(nav, mainEl);
        } else {
          document.body.appendChild(nav);
        }
      }
      
      fixNavLinks(basePath);
      highlightNav(pageName);
    })
    .catch(function(err) {
      console.warn('Не удалось загрузить header.html', err);
    });

  // Загружаем футер
  fetch(basePath + 'components/footer.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      var footer = div.querySelector('footer');
      if (footer) document.body.appendChild(footer);
      fixFooterLinks(basePath);
    })
    .catch(function(err) {
      console.warn('Не удалось загрузить footer.html', err);
    });

  // Кнопка звонка
  var callBtn = document.createElement('a');
  callBtn.href = 'tel:+74957654321';
  callBtn.className = 'fixed-call-btn';
  callBtn.textContent = 'Позвонить в справочную';
  document.body.appendChild(callBtn);

  function fixNavLinks(base) {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        if (base === '../' && href.startsWith('pages/')) {
          href = href.replace('pages/', '');
        }
        if (base === '' && !href.startsWith('pages/') && href !== 'index.html') {
          href = 'pages/' + href;
        }
        link.setAttribute('href', href);
      }
    });
  }

  function fixFooterLinks(base) {
    var footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
        if (base === '../' && href.startsWith('pages/')) {
          href = href.replace('pages/', '');
        }
        if (base === '' && !href.startsWith('pages/') && href !== 'index.html') {
          href = 'pages/' + href;
        }
        link.setAttribute('href', href);
      }
    });
  }

  function highlightNav(page) {
    setTimeout(function() {
      var links = document.querySelectorAll('.nav-link');
      var found = false;
      links.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
          link.classList.add('active');
          found = true;
        }
      });
      if (!found) {
        var homeLink = document.querySelector('.nav-link[data-page="home"]');
        if (homeLink) homeLink.classList.add('active');
      }
    }, 100);
  }
})();