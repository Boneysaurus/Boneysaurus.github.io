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
    Tabletop.init( { key: '1_XxByE8YSW05_-Ye4RsX8fzeMhkBFNXZGGX86-VXCGQ',
                   callback: getInfo,
                   simpleSheet: false 
    });
    
    /*DB init*/
    function getInfo(data, tabletop) {
        cosDB = tabletop.sheets('costumes').all(); 
        initTable();
    }
    function initTable(){
        $('#tableCostumes').DataTable({
            data: cosDB,
            columns: [
                { data: 'event',"width": "10%"},
                { data: 'details',"width": "10%"},
                { data: 'year_added',"width": "5%"},
                { data: 'id',"width": "10%"},
                { data: 'name',"width": "25%"},
                { data: 'small',"width": "15%", 
                "render": function(data, type, row) {
                    return '<img src="'+data+'" />';}},
                { data: 'large', "width": "25%",
                "render": function(data, type, row) {
                    return '<img src="'+data+'" />';}},
            ]
        }
        
        );
    }
    
    
});