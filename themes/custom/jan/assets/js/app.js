
/*---------------------------------------------------------------*/
/*-- Global DOC READY -------------------------------------------*/
/*---------------------------------------------------------------*/
(function($){
  "use strict";
  $(document).ready(function(){

    //Sidebar Navigation
    $("#leftside-navigation .parent > a > span.icon").click(function(e) {
      e.preventDefault();
      var toClose = $("#leftside-navigation ul").not($(this).parents("ul"));
      toClose.slideUp();
      toClose.parent().removeClass("open");
      if(!$(this).parent().next().is(":visible")) {
        var toOpen = $(this).parent().next()
        toOpen.slideDown();
        toOpen.parent().not(".open").addClass("open");
      }  
      e.stopPropagation();
    });

    //wrap tables
    $('.wysiwyg table').wrap('<div class="table-container" />');
   
    /* ADW Menu
    -------------------------------------------------------------------*/
    closeMobileMenu($('.mobileBtnWrapper a.mainMenuToggle'), "nav#mainMenu");

      // Bind the mobile main nav toggle click.
      $('.mobileBtnWrapper__icon').on('click', function(event) {
        // Force the toggle to finish.
        $('nav#mainMenu').stop(true, true);
        if ($(event.currentTarget).hasClass('open')) {
          closeMobileMenu(event.currentTarget, "nav#mainMenu");
        }
        else {
          openMobileMenu(event.currentTarget, "nav#mainMenu");
        }
      });

      //Allow non-touch devices to get the hover on rollover for nav tree
      $('.no-touchevents nav#mainMenu .tierMenu').mouseenter(openChildHover).mouseleave(openChildHover);

    });

    function openMobileMenu(element, selector) {
      $(selector).slideDown(200, 'easeInSine');
      $(element).addClass('open');
    }

    function closeMobileMenu(element, selector) {
      $(selector).slideUp(200, 'easeOutSine');
      $(element).removeClass('open');
    }

    function openChildClick(event) {
      var $parentpress = $(event.currentTarget).parent(),
          $targetUl = $parentpress.find('>ul');

      $targetUl.stop(true, true);
      if ($parentpress.hasClass('over')) {
        $parentpress.removeClass('over');
        $targetUl.slideUp(200);
        return;
      }

      $parentpress.siblings('li.over').each(function(index, element) {
        $(element).find('> ul').slideUp(200);
        $(element).removeClass('over');
      });

      $parentpress.addClass('over');
      $targetUl.slideDown(200);
    }

    //Click to open nav tree
    $('nav.menuContainer .openChild').on('click', openChildClick);

    // Track current width
    var width = $(window).width();
    $(window).resize(function() {
      width = $(window).width();
    });


    function openChildHover(event) {
      if (width > 1184) {
        var $parenthover = $(event.currentTarget),
            $targetUlhover = $parenthover.find('>ul');

        $targetUlhover.stop(true, true);
        if ($parenthover.hasClass('over')) {
          $parenthover.removeClass('over');
          $targetUlhover.slideUp(200);
          return;
        }

        $parenthover.siblings('li.over').each(function(index, element) {
          $(element).find('> ul').slideUp(200);
          $(element).removeClass('over');
        });

        $parenthover.addClass('over');
        $targetUlhover.slideDown(200);
      }
    }
    
    
  
  // Search Box
  $(".searchPanel_open").click(function() {
    $("#searchFormModulePanel").fadeIn(1000, function(){
      var searchForm = document.getElementById('edit-search-block-form--2');
      if (searchForm !== null) {
        searchForm.click();
      }
    });
  });

  $(".searchPanel_close").click(function() {
    $("#searchFormModulePanel").fadeOut("fast");
  });
  
})(jQuery);


//-------------------------------------------------------------------------------//


//Aria assignments
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var menuItems = document.querySelectorAll('.openChild');
  
  var myFunc = function(){ 
    if (this.parentNode.classList.contains('over')) {
        this.setAttribute('aria-expanded', "true");
        this.querySelector('.accessibility-hidden').innerText = 'hide submenu';
    } else {
        this.querySelector('.accessibility-hidden').innerText = 'show submenu';
        this.setAttribute('aria-expanded', "false");
    }
  };

  for (var z = 0; z < menuItems.length; z++) {
    var el = menuItems[z];
    el.addEventListener('click', myFunc);
    el.addEventListener('mouseenter', myFunc);
    el.addEventListener('mouseleave', myFunc);
  }
});


//-------------------------------------------------------------------------------//


//Accordions
const items = document.querySelectorAll(".accordion button");
function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}
items.forEach(item => item.addEventListener('click', toggleAccordion));


//-------------------------------------------------------------------------------//


/* Function to control testimonials messages */
const slideshow = document.querySelector('.slide-wrap');

if (slideshow != null ) { //make sure we don't run this script if the slideshow is not present

  var slides = document.querySelectorAll('.slide-entry');
  var slideCount = slides.length;
  var currentSlide = 0;
  var slideHeight = null;
  var initialHeight = slides[0].clientHeight;

  slides[0].classList.add('active'); //on load, activate the first slide

    function moveToSlide(n) { // set up our slide navigation functionality
      slides[currentSlide].className = 'slide-entry';
      currentSlide = (n+slideCount)%slideCount;
      slides[currentSlide].className = 'slide-entry active';
      slideHeight = slides[currentSlide].clientHeight;
      slideshow.style.height = slideHeight + 'px';
      window.addEventListener('resize', function(){
        resizedSlideHeight = slides[currentSlide].clientHeight;
        slideshow.style.height = resizedSlideHeight + 'px';
      });
    }

    function nextSlide(e){
      moveToSlide(currentSlide+1);
      var code = e.keyCode;
      if( code == 39 ) {
        moveToSlide(currentSlide+1);
      }
    };
    function prevSlide(e){
      moveToSlide(currentSlide+-1);
      var code = e.keyCode;
      if( code == 37 ) {
        moveToSlide(currentSlide+-1);
      }
   };

    const slideHandlers = {
      nextSlide: function(element){
        document.querySelector(element).addEventListener('click',nextSlide);
        document.body.addEventListener('keydown',nextSlide, false);
      },
      prevSlide: function(element){
        document.querySelector(element).addEventListener('click',prevSlide);
        document.body.addEventListener('keydown',prevSlide, false);
      }
    }

    slideHandlers.nextSlide('#next-slide');
    slideHandlers.prevSlide('#prev-slide');

// Dynamic slideshow height

  slideshow.style.height = initialHeight + 'px'; //on load, set the height of the slider to the first active slide

    window.addEventListener('resize', function(){ // adjust the height of the slidehow as the browser is resized
      var resizedHeight = slides[0].clientHeight;
      slideshow.style.height = resizedHeight + 'px';
    });

// Detect swipe events for touch devices, credit to Kirupa @ https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
var initialX = null;
var initialY = null;
function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};
function moveTouch(e) {
  if (initialX === null) {
    return;
  }
  if (initialY === null) {
    return;
  }
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
    // swiped left
    moveToSlide(currentSlide+1);
    } else {
    // swiped right
    moveToSlide(currentSlide+-1);
    }
    }
    initialX = null;
    initialY = null;
    e.preventDefault();
    };

    slideshow.addEventListener("touchstart", startTouch, false);
    slideshow.addEventListener("touchmove", moveTouch, false);

    // optional autoplay function
      //setInterval(function(){
        //nextSlide();
      //},8000);

} //end slideshow
