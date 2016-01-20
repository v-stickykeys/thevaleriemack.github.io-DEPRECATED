$(document).ready(function(){

  // sticky
  $('.ui.sticky')
  .sticky({
    context: '#mnCntnt'
  });

  // modal
  $('#img-jk').click(function() {
    $('#modal-jk').modal('show');
});

  $('#closeButton').click(function() {
    $('.ui.small.modal').modal('hide');
  });

  $('.ui.medium.image').click(function() {
    var img = this;
    $('#modalHeader').html(img.alt);
    $('#modalImage').attr('src', img.src);
    $('.ui.small.modal').modal('show');
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

// fade to white on scroll
  $(document).on('scroll', function(e){
    $('#hdrImg').css('opacity',
      ( 1 - ( $(document).scrollTop() / 560 ) )
    );
  });

// cards dimmer
  $('.special.cards .image').dimmer({
  on: 'hover'
});


});