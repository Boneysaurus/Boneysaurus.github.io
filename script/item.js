var itemDB;
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
    Tabletop.init( { key: '1_DSOqzeFXMgHj2U_T_3sZPLOAA-0bOzIi_9iAu-Lvcc',
                   callback: getInfo,
                   simpleSheet: false 
    });
    
    /*DB init*/
    function getInfo(data, tabletop) {
        itemDB = tabletop.sheets('List').all(); 
        initTable();
    }
    function initTable(){
        $('table').DataTable({
            data: itemDB,
            columns: [
                { data: 'ingredients'},
                { data: 'type'},
                { data: 'dungeon'},
                { data: 'details'},
                { data: 'quantity'}
            ]
        }
        
        );
    }
    
});