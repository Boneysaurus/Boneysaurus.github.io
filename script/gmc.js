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
        $('#formAddAcc').val('');
    })
    
    /*cooldown & token table*/
    function updateTable(){
        var tokenTable = document.getElementById('tableCD');
        $(tokenTable).empty();
        var ttH, ttR, ttC;
        ttR = tokenTable.insertRow(0);
        ttC = ttR.insertCell(0);
        ttC.style.width = '170px';
        ttC.innerHTML = "<h4>GMC</h4>";
        for (var i = 0; i<gmcAccount.length; i++){
            ttC = ttR.insertCell(i+1);
            ttC.style.width = '100px';
            ttC.innerHTML = '<h5><b>'+gmcAccount[i].name+'</b></h5>';
        }
        ttC = ttR.insertCell(gmcAccount.length+1);
        
        ttR = tokenTable.insertRow(1);
        ttC = ttR.insertCell(0);
        ttC.innerHTML = "<b>Cooldown</b>";
        for (var i = 0; i<gmcAccount.length; i++){
            ttC = ttR.insertCell(i+1);
            var cutOff = moment(gmcAccount[i].cooldown);
            var now = new moment();
            ttC.appendChild(document.createTextNode(moment.duration(cutOff.diff(now)).format('h [h] m [m]')));
            
            var hr = document.createElement('hr');
            hr.setAttribute('class','small')
            ttC.appendChild(hr)
            
            var buttonGroup = document.createElement('div');
            buttonGroup.setAttribute('class', 'btn-group btn-group-xs btn-group-justified');
            buttonGroup.setAttribute('role', 'group');
            buttonGroup.setAttribute('aria-label', '...');
            $(buttonGroup).data('col', i);
            var buttonE = document.createElement('a');
            buttonE.innerHTML='<i class="fa fa-edit"></i>'
            buttonE.setAttribute('class', 'btn btn-primary');
            buttonE.onclick = editCD;
            buttonGroup.appendChild(buttonE);
            var buttonR = document.createElement('a');
            buttonR.innerHTML='<i class="fa fa-remove"></i>'
            buttonR.setAttribute('class', 'btn btn-danger');
            buttonR.onclick = removeCD;
            buttonGroup.appendChild(buttonR);
            ttC.appendChild(buttonGroup);
            
            var buttonGroup2 = document.createElement('div');
            buttonGroup2.setAttribute('class', 'btn-group btn-group-xs btn-group-justified');
            buttonGroup2.setAttribute('role', 'group');
            buttonGroup2.setAttribute('aria-label', '...');
            $(buttonGroup2).data('col', i);
            var buttonD = document.createElement('a');
            buttonD.innerHTML='Dual'
            buttonD.setAttribute('class', 'btn btn-info');
            buttonD.onclick = dualCD;
            buttonGroup2.appendChild(buttonD);
            var buttonF = document.createElement('a');
            buttonF.innerHTML='Fail'
            buttonF.setAttribute('class', 'btn btn-warning');
            buttonF.onclick = failCD;
            buttonGroup2.appendChild(buttonF);
            ttC.appendChild(buttonGroup2);
        }
        ttC = ttR.insertCell(gmcAccount.length+1);
        
        for (var h=0; h<gmcList.length;h++){
            ttR = tokenTable.insertRow(h+2);
            ttC = ttR.insertCell(0);
            ttC.innerHTML = '<img src="../img/gmc/'+gmcList[h]+'.gif" align="bottom"></img> '+gmcList[h].charAt(0).toUpperCase()+gmcList[h].slice(1);
            for (var i = 0; i<gmcAccount.length; i++){
                ttC = ttR.insertCell(i+1);            
                ttC.appendChild(document.createTextNode(gmcAccount[i][gmcList[h]]));
                var buttonGroup = document.createElement('div');
                $(buttonGroup).data('gmc', gmcList[h]);
                $(buttonGroup).data('col', i);
                buttonGroup.setAttribute('class', 'btn-group btn-group-xs pull-right');
                buttonGroup.setAttribute('role', 'group');
                buttonGroup.setAttribute('aria-label', '...');
                var buttonP = document.createElement('button');
                buttonP.innerHTML = '<i class="fa fa-plus"></i>';
                buttonP.setAttribute('class', 'btn btn-success');
                buttonP.onclick = addToken;
                buttonGroup.appendChild(buttonP);
                var buttonM = document.createElement('button')
                buttonM.innerHTML = '<i class="fa fa-minus"></i>';
                buttonM.setAttribute('class', 'btn btn-danger');
                if (gmcAccount[i][gmcList[h]]==0){$(buttonM).prop('disabled',true)}
                buttonM.onclick = delToken;
                buttonGroup.appendChild(buttonM);
                ttC.appendChild(buttonGroup);
            }
            ttC = ttR.insertCell(gmcAccount.length+1);
        }
        
        
        //other actions
        ttR = tokenTable.insertRow(gmcList.length+2);
        ttC = ttR.insertCell(0);
        ttC.innerHTML = "<b>Claim Box</b>";
        for (var i = 0; i<gmcAccount.length; i++){
            ttC = ttR.insertCell(i+1);
            
            var normBox = gmcAccount[i].blacktalon > 0 && gmcAccount[i].boreas > 0 && gmcAccount[i].seiren > 0 && gmcAccount[i].howl > 0 && gmcAccount[i].shiris > 0 && gmcAccount[i].muui > 0 && gmcAccount[i].sushi > 0;
            var crimBox = gmcAccount[i].muui > 2 && gmcAccount[i].shiris > 2 && gmcAccount[i].howl > 2 && gmcAccount[i].gemini > 0;
            var ceruBox = gmcAccount[i].seiren > 2 && gmcAccount[i].blacktalon > 2 && gmcAccount[i].howl > 2 && gmcAccount[i].gemini > 0 ;
            var saffBox = gmcAccount[i].sushi > 2 && gmcAccount[i].shiris > 2 && gmcAccount[i].boreas > 2 && gmcAccount[i].gemini > 0;
            //box things
            
            if (!(normBox || crimBox || ceruBox || saffBox)){
                ttC.appendChild(document.createTextNode("None"));}
            
            var buttonGroupV = document.createElement('div');
            buttonGroupV.setAttribute('class', 'btn-group-vertical btn-group-xs btn-block');
            buttonGroupV.setAttribute('role', 'group');
            buttonGroupV.setAttribute('aria-label', '...');
            $(buttonGroupV).data('col', i);
            var buttonG = document.createElement('button');
            buttonG.innerHTML='Normal'
            buttonG.setAttribute('class', 'btn btn-default');
            buttonG.onclick = claimNormal;
            $(buttonG).prop('disabled',true);
            if (normBox){$(buttonG).prop('disabled',false)
            buttonGroupV.appendChild(buttonG)};
            var buttonCrimson = document.createElement('button');
            buttonCrimson.innerHTML='Crimson'
            buttonCrimson.setAttribute('class', 'btn btn-danger');
            buttonCrimson.onclick = claimCrimson;
            $(buttonCrimson).prop('disabled',true);
            if (crimBox){$(buttonCrimson).prop('disabled',false)
            buttonGroupV.appendChild(buttonCrimson)};
            var buttonCerulean = document.createElement('button');
            buttonCerulean.innerHTML='Cerulean'
            buttonCerulean.setAttribute('class', 'btn btn-info');
            buttonCerulean.onclick = claimCerulean;
            $(buttonCerulean).prop('disabled',true);
            if (ceruBox){$(buttonCerulean).prop('disabled',false)
            buttonGroupV.appendChild(buttonCerulean)};
            var buttonSaffron = document.createElement('button');
            buttonSaffron.innerHTML='Saffron'
            buttonSaffron.setAttribute('class', 'btn btn-warning');
            buttonSaffron.onclick = claimSaffron;
            $(buttonSaffron).prop('disabled',true);
            if (saffBox){$(buttonSaffron).prop('disabled',false)
            buttonGroupV.appendChild(buttonSaffron)};
            ttC.appendChild(buttonGroupV);
        }
        ttC = ttR.insertCell(gmcAccount.length+1);
        
    }
    
   function addToken(){
        var gmc = $(this).parent().data('gmc');
        var accIndex = $(this).parent().data('col');
        console.log(gmcAccount[accIndex][gmc])
        gmcAccount[accIndex][gmc] += 1;
        gmcAccount[accIndex].cooldown = new moment().add(48, 'hours');
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
    
    //box functions
    function claimNormal(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].blacktalon -= 1;
        gmcAccount[accIndex].boreas -= 1;
        gmcAccount[accIndex].seiren -= 1;
        gmcAccount[accIndex].howl -= 1;
        gmcAccount[accIndex].shiris -= 1;
        gmcAccount[accIndex].muui -= 1;
        gmcAccount[accIndex].sushi -= 1;
        updateTable();
        storeAcc();
    }
    function claimCrimson(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].muui -= 3;
        gmcAccount[accIndex].shiris -= 3;
        gmcAccount[accIndex].howl -= 3;
        gmcAccount[accIndex].gemini -= 1;
        updateTable();
        storeAcc();
    }
    function claimCerulean(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].howl -= 3;
        gmcAccount[accIndex].seiren -= 3;
        gmcAccount[accIndex].blacktalon -= 3;
        gmcAccount[accIndex].gemini -= 1;
        updateTable();
        storeAcc();
    }
    function claimSaffron(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].sushi -= 3;
        gmcAccount[accIndex].boreas -= 3;
        gmcAccount[accIndex].shiris -= 3;
        gmcAccount[accIndex].gemini -= 1;
        updateTable();
        storeAcc();
    }
    
    //cooldown functions
    function editCD(){
        var accIndex = $(this).parent().data('col');
        updateTable();
        storeAcc();
    }
    function removeCD(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].cooldown = null;
        updateTable();
        storeAcc();
    }
    function dualCD(){
        var accIndex = $(this).parent().data('col');
        gmcAccount[accIndex].cooldown = new moment().add(48, 'hours');
        updateTable();
        storeAcc();
    }
    function failCD(){
        var accIndex = $(this).parent().data('col');
        var gmcTD = new moment();
        var x = new moment();
        gmcTD.date(tomorrow.tz(zone).date());
        gmcTD.hour();                
        gmcTD.minute(0);
        gmcTD.second(0);
        gmcTD.millisecond(0);
        x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
        x.tz(moment.tz.guess());
        gmcAccount[accIndex].cooldown = x;
        updateTable();
        storeAcc();
    }
    
    updateTable();
    nextTime();
    compareTime();    
    getTime();
    
});