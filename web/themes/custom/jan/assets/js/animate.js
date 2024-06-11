// ANIM CORE
// ---- This JS partial will handle all the global JS based micro-ineractions and animations.
(function($) {
  $(document).ready(function() {
  		// all things anim parent when entering into the screen will be assigned an active class
  	// ---------------------------------------------- CARD ANIMATION FUNCTION
  		$.fn.cardAnim = function() {
  			if ($(this).is(":in-viewport")) {
  				$(this).each(function() {
  					if ($(this).is(":in-viewport") && !$(this).hasClass("anim-item--active")) {
  						$(this).addClass("anim-item--active");
  					}
  				});
  			}
  		};
  
  	// ---------------------------------------------- SEQUENCE ANIMATION FUNCTION
  	function initSequenceAnims(index, element) {
      var $this = $(element),
          $children = $this.find(".anim-parent");
  
      if ($this.is(":in-viewport")) {
        var animItem = $this.find(".sequence-anim-item");
        var count = 0, length = animItem.length;
        var interval = setInterval(function(){
          if(count == length)
            clearInterval(interval);
  
          animItem.eq(count++).addClass('sequence-anim-item--active');
        }, 100)
      }
  
      $(window).on('load', function() {
        if ($this.is(":in-viewport")) {
          var animItem = $this.find(".sequence-anim-item");
          var count = 0, length = animItem.length;
          var interval = setInterval(function(){
            if(count == length)
              clearInterval(interval);
  
            animItem.eq(count++).addClass('sequence-anim-item--active');
          }, 100)
        }
      });
  
      $(window).scroll(function() {
        if ($this.is(":in-viewport")) {
          var animItem = $this.find(".sequence-anim-item");
          var count = 0, length = animItem.length;
          var interval = setInterval(function(){
            if(count == length)
              clearInterval(interval);
  
            animItem.eq(count++).addClass('sequence-anim-item--active');
          }, 100)
        }
      });
  	}
  
  	// ---------------------------------------------- COUNTUP ANIMATION FUNCTION
  	function initCounterUp(index, element) {
      var	$this = $(element),
          statNumber = $this.attr("data-number");
  
      if ($this.hasClass('counterUpFired')) {
        return;
      }
  
      $this.counterUp({
        delay: 10,
        time: 1500
      });
  
      $this.addClass('counterUpFired');
  	}
  
    /**
  	 * Drives the init of all of the various animations.
     * @param
     */
  	function initAnims() {
  		// Set up a custom event listener on the body so that the animation can
  		// be triggered from outside this scope.
  		$('body').on('admissionsFireAnims', function(){
  			$(".anim-item").cardAnim();
  		});
  
  		// Need to fire this immediately in case this is an AJAX request and the
  		// window load has already fired.
      $(".anim-item").cardAnim();
  
      $(window).on('load', function() {
        $(".anim-item").cardAnim();
      });
  
      $(window).scroll(function() {
        $(".anim-item").cardAnim();
      });
  
      $(".sequence-anim-parent").each(initSequenceAnims);
  
      $(".count-up").each(initCounterUp);
  	}
  
    // ======== INIT
    initAnims();
  });  
})(jQuery); // function
