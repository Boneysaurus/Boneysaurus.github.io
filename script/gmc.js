var locale = window.navigator.userLanguage || window.navigator.language;
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

var zone = "Europe/Berlin";
var today = new moment();
var tomorrow = new moment().add(1,'day');
moment.locale(locale);

/*account object*/
function account(name,cooldown,blacktalon,boreas,seiren,howl,shiris,muui,sushi,gemini){
    this.name = name;
    this.cooldown = cooldown;
    this.blacktalon = blacktalon;
    this.boreas = boreas;
    this.seiren = seiren;
    this.howl = howl;
    this.shiris = shiris;
    this.muui = muui;
    this.sushi = sushi;
    this.gemini = gemini;
}

var gmcAccount = [
    new account("iela",0,0,0,0,0,0,0,0,0),
    new account("is",0,0,0,0,0,0,0,0,0),
    new account("cool",0,0,0,0,0,0,0,0,0)
]

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
    function nextTime(){
        var gmcToday=[];
        var gmcNextThree=[];
        var gmcNextThreeIndex = 0;
        var gmcNext= new moment();
        var gmcCheck =false;
        var currentTime = new moment();
        /*
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
            gmcToday.push(" "+x.calendar());
            if (moment().hour()<x.hour() && gmcCheck == false){
                gmcNext = x;
                gmcCheck =true;
            }
        }*/
        function getGMC(){
            
        }
        for (var i=0; i<gmcTime[today.tz(zone).day()].length;i++){
            var gmcTD = new moment();
            var x = new moment();
            gmcTD.date(today.tz(zone).date());
            gmcTD.hour(gmcTime[today.tz(zone).day()][i]);
            gmcTD.minute(0);
            gmcTD.second(0);
            gmcTD.millisecond(0);
            x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
            x.tz(moment.tz.guess());
            x.locale(locale);
            gmcToday.push(" "+x.calendar());
            if (moment()<x && gmcNextThreeIndex<3){
                gmcNextThree.push(" "+x.calendar());
                gmcNextThreeIndex++;
            }
        }
        for (var i=0; i<gmcTime[tomorrow.tz(zone).day()].length;i++){

            var gmcTD = new moment();
            var x = new moment();
            gmcTD.date(tomorrow.tz(zone).date());
            gmcTD.hour(gmcTime[tomorrow.tz(zone).day()][i]);                
            gmcTD.minute(0);
            gmcTD.second(0);
            gmcTD.millisecond(0);
            x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
            x.tz(moment.tz.guess());
            x.locale(locale);
            if (gmcNextThreeIndex<3){
                gmcNextThree.push(" "+x.calendar());
                gmcNextThreeIndex++;
            }
        }

        $("#nextThreeGMC").text(gmcNextThree);
        $("#todayGMC").text(gmcToday);
        $('#nextGMC').text(moment(gmcNext).countdown()+" ("+gmcNext.format('LT')+")");
        $('#nextGMCv2').text(moment(gmcNext).fromNow()+" ("+gmcNext.format('LT')+")");
        setTimeout(nextTime,1000);
    }
    
    /*list account temp*/
    var list = document.getElementById('listAccount')
    for (var i = 0; i<gmcAccount.length; i++){
        var account = document.createElement('li');
        account.className = 'list-group-item';
        account.appendChild(document.createTextNode(gmcAccount[i].name));
        list.appendChild(account);
    }
    
    /*cooldown & token table*/
    var tokenTable = document.getElementById('tableCD');
    var ttH, ttR, ttC;
    ttR = tokenTable.insertRow(0);
    ttC = ttR.insertCell(0);
    ttC.style.width = '200px';
    ttC.innerHTML = "<h4>GMC</h4>";
    for (var i = 0; i<gmcAccount.length; i++){
        ttC = ttR.insertCell(i+1);
        ttC.style.width = '80px';
        ttC.innerHTML = '<h4><span style="margin:auto">'+gmcAccount[i].name+'</span></h4>';
    }
    ttC = ttR.insertCell(gmcAccount.length+1);
    
    ttR = tokenTable.insertRow(1);
    ttC = ttR.insertCell(0);
    ttC.innerHTML = "<b>Cooldown</b>";
    for (var i = 0; i<gmcAccount.length; i++){
        ttC = ttR.insertCell(i+1);
        ttC.innerHTML = gmcAccount[i].cooldown;
    }
    ttC = ttR.insertCell(gmcAccount.length+1);    
    
    ttR = tokenTable.insertRow(2);
    ttC = ttR.insertCell(0);
    ttC.innerHTML = '<img src="../img/gmc/blacktalon.gif" align="bottom"></img><b> BlackTalon</b>';
    for (var i = 0; i<gmcAccount.length; i++){
        ttC = ttR.insertCell(i+1);
        ttC.innerHTML = gmcAccount[i].blacktalon+'<div class="btn-group btn-group-xs pull-right" role="group" aria-label="..."><button type="button" class="btn  btn-success"><i class="fa fa-plus"></i></button><button type="button" class="btn btn-danger"><i class="fa fa-minus"></i></button></div>';
    }
    ttC = ttR.insertCell(gmcAccount.length+1);
    
    nextTime();
    compareTime();    
    getTime();
    localStorage.setItem("storeAccount",JSON.stringify(gmcAccount));
    
});