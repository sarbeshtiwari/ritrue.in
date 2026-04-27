(function() {
  'use strict';

  var NAV_ITEMS = [
    { label: 'Home', target: 'home' },
    { label: 'Shop', target: '/products/ritrue-moroccan-nila-powder-50g' },
    { label: 'Ingredients', target: 'ingredients' },
    { label: 'Results & Reviews', target: 'results' },
    { label: 'How to Use', target: 'how-to-use' },
    { label: 'FAQs', target: 'faqs' }
  ];

  var HEADER_OFFSET = 160;
  var isHomepage = window.location.pathname === '/' || window.location.pathname === '';

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function init() {
    var header = document.querySelector('.header');
    if (!header) return;

    var existingNav = header.querySelector('.header__inline-menu');

    var nav = document.createElement('nav');
    nav.className = 'ritrue-scroll-nav';
    nav.setAttribute('aria-label', 'Page sections');

    NAV_ITEMS.forEach(function(item) {
      var a = document.createElement('a');
      a.className = 'ritrue-scroll-nav__link';

      if (item.target.startsWith('/')) {
        a.href = item.target;
      } else {
        a.href = '/#' + item.target;
      }

      a.textContent = item.label;
      a.setAttribute('data-target', item.target);

      a.addEventListener('click', function(e) {
        if (!item.target.startsWith('/') && isHomepage) {
          e.preventDefault();
          scrollToId(item.target);
          history.replaceState(null, '', '/#' + item.target);
        }
      });

      nav.appendChild(a);
    });

    if (existingNav) {
      existingNav.style.display = 'none';
      existingNav.parentNode.insertBefore(nav, existingNav.nextSibling);
    } else {
      var anchor = header.querySelector('.header__heading') || header.querySelector('.header__heading-link');
      if (anchor) {
        anchor.parentNode.insertBefore(nav, anchor.nextSibling);
      }
    }

    if (isHomepage) {
      var hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(function() { scrollToId(hash); }, 300);
      }

      var links = nav.querySelectorAll('.ritrue-scroll-nav__link');
      var sectionIds = NAV_ITEMS.map(function(item) { return item.target; });

      function updateActive() {
        var scrollY = window.scrollY + HEADER_OFFSET + 50;
        var activeIdx = 0;

        for (var i = sectionIds.length - 1; i >= 0; i--) {
          var section = document.getElementById(sectionIds[i]);
          if (section && section.getBoundingClientRect().top + window.scrollY <= scrollY) {
            activeIdx = i;
            break;
          }
        }

        links.forEach(function(link, idx) {
          link.classList.toggle('is-active', idx === activeIdx);
        });
      }

      var ticking = false;
      window.addEventListener('scroll', function() {
        if (!ticking) {
          requestAnimationFrame(function() {
            updateActive();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      updateActive();
    }

    var labelToTarget = {};
    NAV_ITEMS.forEach(function(item) {
      labelToTarget[item.label.toLowerCase()] = item.target;
    });

    document.querySelectorAll('.footer a[href]').forEach(function(a) {
      var text = a.textContent.trim().toLowerCase();
      var target = labelToTarget[text];
      if (!target) return;

      a.href = '/#' + target;
      a.addEventListener('click', function(e) {
        if (isHomepage) {
          e.preventDefault();
          scrollToId(target);
          history.replaceState(null, '', '/#' + target);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
