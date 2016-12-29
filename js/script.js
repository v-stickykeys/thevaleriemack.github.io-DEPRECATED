$(document).ready(function(){

  // sticky
  $('.ui.sticky')
  .sticky({
    context: '#mnCntnt'
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
    $('.ui.card')
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

  $(document).on('scroll', function(e){

    // fade to white on scroll
    // $('#hdrImg').css('opacity',
    //   ( 1 - ( $(document).scrollTop() / 400 ) )
    // );
  
    // parallax move on scroll
    $('#hdrImg').css('margin-top',
      ( -200 - ( $(document).scrollTop() * 1.2) )+'px'
      );

    // if ($(document).scrollTop() > 150) {
    //   $('#about')
    //     .css('visibility', 'hidden');
    // } else {
    //   $('#about')
    //     .css('visibility', 'visible');
    // };

  });

// cards dimmer
  $('.card .image').dimmer({
  on: 'hover'
});


if (document.documentElement.clientWidth < 700) {
  document.getElementById("mnCntnt").className = "sixteen wide column";
} else {
  document.getElementById("leftSide").className = "four wide column";
  document.getElementById("mnCntnt").className = "eleven wide column";
}

// loop
// $(document).scroll(function(){
//       if (document.documentElement.clientHeight + $(window).scrollTop() >= $(document).height()) {
//         $(document).scrollTop(0);
//       }
// });


});