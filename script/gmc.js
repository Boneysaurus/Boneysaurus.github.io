var locale = window.navigator.userLanguage || window.navigator.language;
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
var gmcToday=[];
var today = new moment();
var zone = "Europe/Berlin";


$(document).ready(function(){
    var gmcTime=[[0,11,15],[2,12,16],[4,14,18],[6,14,20],[8,18],[0,11,15,20],[2,12,18]];
    
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
    
    function getTime(){
        var d = new moment();
        d.locale(locale);
        $("#dateLocal").text(d.format('LTS') + " " + d.format('dddd'));
        
        setTimeout(getTime,1000);
    }
    function compareTime(){
        console.log(today.tz(zone).day());
        console.log(today.tz('Europe/Berlin').hour());
        console.log(today.tz('Europe/Berlin').minute());
    }
    compareTime();
    
    for (var i=0; i<gmcTime[today.tz(zone).day()].length;i++){
        var gmcTD = new moment();
        var x = new moment()
        gmcTD.date(today.date());
        gmcTD.hour(gmcTime[today.tz(zone).day()][i]);
        gmcTD.minute(0);
        gmcTD.second(0);
        gmcTD.millisecond(0);
        x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
        x.tz(moment.tz.guess());
        x.locale(locale);
        console.log(x.format())
        gmcToday.push(" "+x.calendar());
    }

    $("#todayGMC").text(gmcToday);
    getTime();
    
    
});