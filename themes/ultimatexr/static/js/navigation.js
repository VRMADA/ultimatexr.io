var initMobileNavigation = function() {
  var buttonOpen = document.querySelector('#menu-button-open');
  var buttonClose = document.querySelector('#menu-button-close');
  var navigation = document.querySelector('header .nav-main');

  buttonOpen.addEventListener('click', function(event) {
    navigation.classList.add('open');
  });

  buttonClose.addEventListener('click', function(event) {
    navigation.classList.remove('open');
  });
}

var initLocalNavigation = function() {
  var buttonOpen = document.querySelector('#nav-local .btn-menu');
  var buttonClose = document.querySelector('#sidebar .btn-close');
  var sidebar = document.querySelector('#sidebar');
  var overlay = document.querySelector('.overlay');

  var closeSidebar = function() {
    overlay.classList.remove('open');
    sidebar.classList.remove('open');
  }
  
  buttonOpen.addEventListener('click', function(event) {
    overlay.classList.add('open');
    sidebar.classList.add('open');
  });

  overlay.addEventListener('click', closeSidebar);
  buttonClose.addEventListener('click', closeSidebar);
}

var initSidebarResize = function() {
  var resize = function() {
    if (window.innerWidth < 992) {
      sidebar.style.removeProperty('height');
      return;
    }
    
    var sidebar = document.querySelector('#sidebar');
    var scrollY = window.scrollY;
    var offsetY = 150;
    
    if (scrollY > 42) {
      offsetY = offsetY - 42;
    } else {
      offsetY = offsetY - scrollY;
    }

    sidebar.style.height = 'calc(100vh - '+ offsetY +'px)';
  }
  
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', resize);
}

document.addEventListener('DOMContentLoaded', function(event) {
  initMobileNavigation();

  // Check if we have local navigation
  var navLocal = document.querySelector('#nav-local');
  if(navLocal !== null) {
    initLocalNavigation();
  }

  // Check if we have a sidebar
  var sidebar = document.querySelector('#sidebar');
  if(sidebar !== null) {
    initSidebarResize();
  }
});