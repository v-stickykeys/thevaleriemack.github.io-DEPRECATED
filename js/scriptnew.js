$(document).ready(function(){

  // sticky
  $('.ui.sticky')
  .sticky({
    context: '#rightSide'
  });

  // modal
  $('#closeButton').click(function() {
    $('.ui.small.modal').modal('hide');
  });

  $('.ui.medium.image').click(function() {
    var img = this;
    $('#modalHeader').html(img.alt);
    $('#modalImage').attr('src', img.src);
    $('.ui.small.modal')
      .modal('setting', 'transition', 'scale')
      .modal('show')
      ;
  });

  // show hidden content
  $('.card').click(function() {
    var card = this;
    $(card)
      .css('display', 'none');
    $('#'+card.id+'1')
      .css('display', 'block')
    ;
  });

  // hide hidden content
  $('.item.allpjcts').click(function() {
    $('.ui.centered.fluid.card')
      .css('display', 'flex')
      ;
    $('.hider.ui.segment')
    .css('display', 'none')
    ;
  });
	
	// smooth scroll
	$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

  $(window).scroll( function(){

    // Check the location of each desired element
    $('.card').each( function(i) {
      var bottom_of_object = $(this).offset().top + $(this).outerHeight();
      var bottom_of_window = $(window).scrollTop() + $(window).height();
            
      // If the object is completely visible in the window, fade it it
      if( bottom_of_window > bottom_of_object ) {
        console.log('YES!');
        var card = this;
        $('#'+card.id+'1').animate({'opacity':'1'},500);
      }
    });
  });

  $(document).on('scroll', function(e){
  
    // parallax move on scroll
    $('#hdrImg').css('margin-top',
      ( -200 - ( $(document).scrollTop() * 1.2) )+'px'
      );

  });

// cards dimmer
  $('.card .image').dimmer({
  on: 'hover'
});


if (document.documentElement.clientWidth < 700) {
  document.getElementById("leftSide").className = "two wide";
  document.getElementById("mnCntnt").className = "fourteen wide column";
} else {
  document.getElementById("leftSide").className = "four wide column";
  document.getElementById("mnCntnt").className = "twelve wide column";
}

// loop
// $(document).scroll(function(){
//       if (document.documentElement.clientHeight + $(window).scrollTop() >= $(document).height()) {
//         $(document).scrollTop(0);
//       }
// });


});