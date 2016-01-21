$(document).ready(function () {
  var classes = ['1','2','3'];
    $('.project-item').each(function(i) {
        $(this).addClass(
          classes[Math.floor(Math.random()*classes.length)]);
    });
    $('.half-column').each(function(i) {
        $(this).addClass(
            classes[Math.floor(Math.random()*classes.length)]);
    });
  //Menu
  $(".icon").click(function () {
      $(".mobile-nav").fadeToggle(500);
      $(".top-menu").toggleClass("top-animate");
      $(".mid-menu").toggleClass("mid-animate");
      $(".bottom-menu").toggleClass("bottom-animate");
      $(".menui").toggleClass("iconDark");
  });
  $(".mobilenav a").click(function () {
      $(".mobile-nav").fadeToggle(500);
      $(".top-menu").toggleClass("top-animate");
      $(".mid-menu").toggleClass("mid-animate");
      $(".bottom-menu").toggleClass("bottom-animate");
      $(".menui").toggleClass("iconDark");
  });
    if (screen.width > 920) {
    $('.1').addClass("hidden").viewportChecker({
        classToAdd: 'visible animated slow1 fadeIn',
        offset: 100
       });
     $('.2').addClass("hidden").viewportChecker({
         classToAdd: 'visible animated slow2 fadeIn',
         offset: 100
        });
      $('.3').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated slow3 fadeIn',
          offset: 100
         });
       $('.4').addClass("hidden").viewportChecker({
           classToAdd: 'visible animated slow4 fadeIn',
           offset: 100
          });
        $('.5').addClass("hidden").viewportChecker({
            classToAdd: 'visible animated slow5 fadeIn',
            offset: 100
           });
    }
    //$('.projectItemImage').hover(function() {
    //  $('projectItemImageOverlay').addClass('visible');
    //});

  $(document).on("scroll", onScroll);

    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top-122
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('.nav-items a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top-122 <= scrollPos && refElement.position().top-122 + refElement.height() > scrollPos) {
            $('.nav-items ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}
