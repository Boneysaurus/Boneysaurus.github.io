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

var gmcList = ["blacktalon","boreas","seiren","howl","shiris","muui","sushi","gemini"]

var gmcAccount = [];

var gmcTime=[[0,11,15],[2,12,16],[4,14,18],[6,14,20],[8,18],[0,11,15,20],[2,12,18]];

$(document).ready(function(){    
    var loadAcc = localStorage.getItem("storeAccount");
    if(localStorage.getItem("storeAccount") != null){
        gmcAccount = JSON.parse(loadAcc);
    }
    function storeAcc(){
        localStorage.setItem("storeAccount",JSON.stringify(gmcAccount));
    }
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
            gmcTD.date(today.tz(zone).date());
            gmcTD.hour(gmcTime[today.tz(zone).day()][i]);
            gmcTD.minute(0);
            gmcTD.second(0);
            gmcTD.millisecond(0);
            var x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
            x.tz(moment.tz.guess());
            x.locale(locale);
            var y = moment(x);
            y.add(2,'h')
            gmcToday.push(" "+x.calendar());
            if(moment()>x && moment()<y){
                $('#finishGMC').text(moment().countdown(y,countdown.HOURS|countdown.MINUTES|countdown.SECONDS,2))
                $('#currentStatus').removeClass('alert-info').addClass('alert-success');
                $('#statusOngoing').show();
            }
            else if(moment()>y) {
                $('#statusOngoing').hide();
                $('#currentStatus').removeClass('alert-success').addClass('alert-info');
            }
            if (moment()<x && gmcNextThreeIndex<3){
                if (gmcCheck == false){
                    gmcNext = x;
                    gmcCheck = true;
                }
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
                if (gmcCheck == false){
                    gmcNext = x;
                    gmcCheck = true;
                }
                gmcNextThree.push(" "+x.calendar());
                gmcNextThreeIndex++;
            }
        }

        $("#nextThreeGMC").text(gmcNextThree);
        $("#todayGMC").text(gmcToday);
        $('#upcomingGMC').text(moment().countdown(gmcNext,countdown.HOURS|countdown.MINUTES|countdown.SECONDS,2)+" ("+gmcNext.format('LT')+")");
        setTimeout(nextTime,1000);
    }
    
    /*list account temp*/
    function updateEditAcc(){
        var list = document.getElementById('listAccount')
        $(list).empty();
        for (var i = 0; i<gmcAccount.length; i++){
            var account = document.createElement('li');
            account.className = 'list-group-item';
            account.appendChild(document.createTextNode(gmcAccount[i].name));
            var button = document.createElement('button');
            button.innerHTML ='<i class="fa fa-trash"></i> Delete';
            button.onclick = deleteAccount;
            button.setAttribute('class','btn btn-danger btn-xs pull-right btnDeleteAcc')
            account.appendChild(button);
            /*account.innerHTML = gmcAccount[i].name+
                '<button type="button" class="btn btn-danger btn-xs pull-right btnDeleteAcc"><i class="fa fa-trash"></i> Delete</button>'*/
            list.appendChild(account);
        }
        storeAcc();
    }
    function emptyEditAcc(){
        var list = document.getElementById('listAccount')
        $(list).empty();
        alert('yes')
    }
    
    //put this in button edit later!!!!!!
    updateEditAcc();
    
    //button delete
    function deleteAccount(){
        gmcAccount.splice($(this).parent().index(),1);
        updateEditAcc();
        updateTable();
    }
    
    $('#buttonAddAcc').on('click',function(){
        var name = $('#formAddAcc').val();
        var newAcc = new account(name,0,0,0,0,0,0,0,0,0)
        gmcAccount.push(newAcc)
        updateEditAcc();
        updateTable();
    })
    
    /*cooldown & token table*/
    function updateTable(){
        var tokenTable = document.getElementById('tableCD');
        $(tokenTable).empty();
        var ttH, ttR, ttC;
        ttR = tokenTable.insertRow(0);
        ttC = ttR.insertCell(0);
        ttC.style.width = '200px';
        ttC.innerHTML = "<h4>GMC</h4>";
        for (var i = 0; i<gmcAccount.length; i++){
            ttC = ttR.insertCell(i+1);
            ttC.style.width = '80px';
            ttC.innerHTML = '<h5><span style="margin:auto">'+gmcAccount[i].name+'</span></h5>';
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
        
        for (var h=0; h<gmcList.length;h++){
            ttR = tokenTable.insertRow(h+2);
            ttC = ttR.insertCell(0);
            ttC.innerHTML = '<img src="../img/gmc/'+gmcList[h]+'.gif" align="bottom"></img><b> '+gmcList[h].charAt(0).toUpperCase()+gmcList[h].slice(1)+'</b>';
            for (var i = 0; i<gmcAccount.length; i++){
                ttC = ttR.insertCell(i+1);            
                ttC.appendChild(document.createTextNode(gmcAccount[i][gmcList[h]]));
                var buttonGroup = document.createElement('div');
                $(buttonGroup).data('gmc', gmcList[h]);
                $(buttonGroup).data('col', i);
                buttonGroup.setAttribute('class', 'btn-group btn-group-xs pull-right');
                buttonGroup.setAttribute('role', 'group');
                buttonGroup.setAttribute('aria-label', '...')
                var buttonP = document.createElement('button')
                buttonP.innerHTML = '<i class="fa fa-plus"></i>';
                buttonP.setAttribute('class', 'btn btn-success');
                buttonP.onclick = addToken;
                buttonGroup.appendChild(buttonP);
                var buttonM = document.createElement('button')
                buttonM.innerHTML = '<i class="fa fa-minus"></i>';
                buttonM.setAttribute('class', 'btn btn-danger');
                buttonM.onclick = delToken;
                buttonGroup.appendChild(buttonM);
                ttC.appendChild(buttonGroup);
            }
            ttC = ttR.insertCell(gmcAccount.length+1);
        }
    }
    
   function addToken(){
        var gmc = $(this).parent().data('gmc');
        var accIndex = $(this).parent().data('col');
        console.log(gmcAccount[accIndex][gmc])
        gmcAccount[accIndex][gmc] += 1;
        updateTable();
        storeAcc();
    }
    
    function delToken(){
        var gmc = $(this).parent().data('gmc');
        var accIndex = $(this).parent().data('col');
        console.log(gmcAccount[accIndex][gmc]);
        gmcAccount[accIndex][gmc] -= 1;
        updateTable();
        storeAcc();
    
    }
    
    updateTable();
    nextTime();
    compareTime();    
    getTime();
    
});