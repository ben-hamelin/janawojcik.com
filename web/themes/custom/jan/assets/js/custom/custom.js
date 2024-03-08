// General Onready
jQuery(document).ready(function() {
  
  // SVG Fallbacks
  if (!Modernizr.svg) {
	jQuery("").attr("src", "");
  }	
  
  // Header Scrolling
  var header = jQuery('header.site-header');
  var scrollState = 'top';  
  
  jQuery(window).scroll(function(){ 
	var scrollPos = jQuery(window).scrollTop();
	if (scrollPos != 0) {
	  if (scrollState === 'top') {
		scrollState = 'scrolled';
		header.addClass('scrolling');
	  }		
	}       
	else if(scrollPos === 0) {
	  if (scrollState === 'scrolled'){
		scrollState = 'top';
		header.removeClass('scrolling');
	  }
	}
  });
  
  // Calculate header offset when window is resized
  jQuery(window).bind('resize', calculateHeaderOffset).resize();

});

// Calculate Header Offset (when fixed at 1200px)
function calculateHeaderOffset() {
  if(Modernizr.mq('(min-width: 1800px)') ) {
	jQuery('header.site-header').next().css("margin-top", "135px");   
  }	
  else if(Modernizr.mq('(min-width: 1600px)') ) {
	jQuery('header.site-header').next().css("margin-top", "127px");   
  }
  else if(Modernizr.mq('(min-width: 1400px)') ) {
	jQuery('header.site-header').next().css("margin-top", "110px");   
  }
  else if(Modernizr.mq('(min-width: 1200px)') ) {
	jQuery('header.site-header').next().css("margin-top", "102px");   
  }			
  else if(Modernizr.mq('(min-width: 1100px)') ) {
	jQuery('header.site-header').next().css("margin-top", "84px");   
  } 
  else {
	jQuery('header.site-header').next().css("margin-top", "auto"); 
  }	
}

// Menu Functionality
jQuery('.mobileBtnWrapper a.mainMenuToggle').toggle(function() { 
  jQuery("nav#mainMenu").slideDown(200, 'easeInSine');
  jQuery(this).addClass('active');
},
 function() { 
   jQuery("nav#mainMenu").slideUp(200, 'easeOutSine');
   jQuery(this).removeClass('active');
});

// Upper Donation Counter Promo Move/Bind
jQuery(window).bind('resize', function(){  
  if(Modernizr.mq('(min-width: 960px)') ) {
	jQuery('.upper-promo.donation-counter').insertAfter('.upper-promo.saranac-lake');
  }	  
  else {
	jQuery('.upper-promo.donation-counter').insertBefore('.upper-promo.saranac-lake');
  }  
}).resize();

// Clean function to remove unwatned nodes from inside a DOM node (Support for inline-block grid layout)
var utils = {};
utils.clean = function(node) {
  var child, i, len = node.childNodes.length;
  if (len === 0) { return; }
  // iterate backwards, as we are removing unwanted nodes
  for (i = len; i > 0; i -= 1) {
	child = node.childNodes[i - 1];
	// comment node? or empty text node
	if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue) )) {
	  node.removeChild(child);
	}
	else {
	  if (child.nodeType === 1) {
		utils.clean(child);
	  }
	}
  }
};
// Add .inline-block-grid-parent class where needed
jQuery(".footer-contact-form form").addClass("inline-block-grid-parent");
// Run divs with class .inline-block-grid-parent through clean function
jQuery(".inline-block-grid-parent").each( function(){ 
  utils.clean(this);
})