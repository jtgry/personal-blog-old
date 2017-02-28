$(document).ready(function () {
  var menuButton = document.getElementById('navButton');
  menuButton.addEventListener('click', function (e) {
      menuButton.classList.toggle('is-active');
      e.preventDefault();
  });
  $('.nav-button').click(function() {
    $(".mobile-nav").fadeToggle(500);
    $(".nav").toggleClass("nav-transparent");
  });
  $(window).on('scroll',function() {
      if ($(this).scrollTop() > 400) {
        $(".nav").removeClass("fade-in-slow");
        $(".nav").removeClass("nav-up");
        $(".nav").addClass("nav-down");
      }
      else {
      $(".nav").addClass("nav-fixed");
      $(".nav").removeClass("nav-down");
      $(".nav").removeClass("nav-up");

		  }
    });
});
