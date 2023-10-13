var kahoDB;
$(document).ready(function(){
    /*enable popover*/
    $('[data-toggle="popover"]').popover();
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

    /*import class database*/
    Tabletop.init( { key: '1vmM0rO5nbMhmaf46x7zrNViSouxZrsN0e3_IPGJCi3Y',
                   callback: getInfo,
                   simpleSheet: false 
    });
    
    /*DB init*/
    function getInfo(data, tabletop) {
        kahoDB = tabletop.sheets('kaho').all(); 
        initTable();
    }
    function initTable(){
        $('#tableKaho').DataTable({
            data: kahoDB,
            columns: [
                { data: 'name',"width": "40%"},
                { data: 'id',"width": "10%"},
                { data: 'small',"width": "20%", 
                "render": function(data, type, row) {
                    return '<img src="'+data+'" />';}},
                { data: 'big', "width": "20%",
                "render": function(data, type, row) {
                    return '<img src="'+data+'" />';}},
            ]
        }
        
        );
    }
    
    
});