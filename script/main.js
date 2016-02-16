

var charClass = "";
var mdown = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
var mup =  ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
$(document).ready(function(){
    
    $('[data-toggle="tooltip"]').tooltip(); 
    $('a.classSelect').on(mdown, function(){
        
        $(".btn").button('reset');
        $(".btn").removeClass('active');
        charClass= $(this).text();
        $("#classLabel").text(charClass);
        $("#classL").text(charClass);
    });
    $('a.classSelect').on(mup, function(){
        $(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="label label-default">Selected</span> <span class="caret"></span>');
        $(this).parent().parent().siblings(".btn:first-child").val($(this).text());
        $(this).parent().parent().siblings(".btn:first-child").addClass('active');
        
    });
    
    /*focus when hovered*/
    $(".input-sm").hover(function(){
        $(this).focus()
    }, function () {
        $(this).blur().val('');
    });
    
    /* Back to top*/
       	var offset = 250,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});


});


