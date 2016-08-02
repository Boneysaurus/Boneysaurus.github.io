var locale = window.navigator.userLanguage || window.navigator.language;
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";


var previousGMC;
var nextGMC=[];
var fullGMC=[];

var zone = "Europe/Berlin";
var today = new moment();
var tomorrow = new moment().add(1,'day');
var autoCoolState = true;
var gAccIndex;
moment.locale(locale);

//notification states;
function notif(state,time,sound,played){
    this.state = state;
    this.time = time;
    this.sound = sound;
    this.played = played;
}
var notifSet = new notif();

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

var gmcTime=[[2,12,16],[4,14,18],[6,14,20],[8,18],[0,11,15,20],[2,12,18],[0,11,15]];

function gmcSchedule(){
    var nextGMCCount=0;
    var a = 0;
    var tempWeek = moment();
    tempWeek.startOf('isoweek');
    var weekStart = moment.tz(zone);
    moment.tz(weekStart,zone);
    weekStart.startOf('isoweek');
    for (var i=0; i< gmcTime.length;i++){
        var dayPlus=moment(weekStart).add(i,'days');
        for (var j=0; j< gmcTime[i].length;j++){
            var dayGMC = moment(dayPlus);
            dayGMC.hour(gmcTime[i][j]);
            var tempGMC = moment(dayGMC);
            if(moment(tempGMC).local().startOf('isoweek').isBefore(moment(dayGMC).startOf('isoweek'))){
                dayGMC.add(7,'days')
            }
            fullGMC[a] = dayGMC.format();
            a++;
        }
    }
    fullGMC.sort();
    
    var x = moment().tz(zone)
    moment.tz(x,zone)
    for (var i = 0; i < fullGMC.length; i++){
        if (x.isAfter(moment(fullGMC[i]))){
            previousGMC = moment(fullGMC[i]);
        }
        if (x.isBefore(moment(fullGMC[i])) && nextGMCCount<3){
            nextGMC[nextGMCCount] = moment(fullGMC[i]);
            nextGMCCount++;
        }
    }
    
    //check next week or last week
    if(nextGMC[0]==null){
        nextGMC[0]=moment(moment.tz(fullGMC[0],zone)).add(7,'days').format();
        nextGMC[1]=moment(moment.tz(fullGMC[1],zone)).add(7,'days').format();
        nextGMC[2]=moment(moment.tz(fullGMC[2],zone)).add(7,'days').format();
    }
    if (nextGMC[1]==null){
        nextGMC[1]=moment(moment.tz(fullGMC[0],zone)).add(7,'days').format();
        nextGMC[2]=moment(moment.tz(fullGMC[1],zone)).add(7,'days').format();
    }
    if (nextGMC[2]==null){;
        nextGMC[2]=moment(moment.tz(fullGMC[0],zone)).add(7,'days').format();
    }
    if(previousGMC==0){
        previousGMC=moment(moment.tz(fullGMC[fullGMC.length],zone)).subtract(7,'days').format();
    }
}
function updateNextGMCs(){
    var y = document.createElement('span')
    y = moment(nextGMC[0]).calendar()+', '+moment(nextGMC[1]).calendar()+', '+moment(nextGMC[2]).calendar();
    $('#nextThreeGMC').text(y);



    //make schedule table
    var t = document.getElementById('scheduleTable');
    var colorCode=[];
    var colorHex=['#fff4f4','#fffaf4','#fffef4','#f3fdf3','#f3fbfc','#f4f3fc','#f9f3fc']
    var gmcGroup=[[],[],[],[],[],[],[]];
    var colorGroup=[[],[],[],[],[],[],[]];



    $(t).empty();
    var r,c;
    r = t.insertRow(0);
    for (var i =1; i<8;i++){
        /*
        c = r.insertCell(i-1);
        c.appendChild(document.createTextNode(moment().isoWeekday(i).startOf('day').format('dddd')))*/
        var q = document.createElement('td');
        q.setAttribute('width', '14%');
        q.setAttribute('class', 'text-center');
        var p = document.createElement('span');
        p.setAttribute('style','font-weight:bold;');
        p.innerHTML = moment().isoWeekday(i).startOf('day').format('dddd');
        q.appendChild(p);
        r.appendChild(q);
    }
    for(var i = 0; i<fullGMC.length;i++){
        for (var j = 1; j < 8; j++ ){
            if(moment(fullGMC[i]).tz(zone).isoWeekday()==j){
                colorCode[i]=j;
            }
        }
    }
    for(var i = 0; i<fullGMC.length;i++){
        for (var j = 1; j < 8; j++ ){
            if(moment(fullGMC[i]).isoWeekday()==j){
                gmcGroup[j-1].push(moment(fullGMC[i]).format());
                colorGroup[j-1].push(colorCode[i]);

            }
        }
    }


    var tempHTML='';
    for (var i = 0; i<5; i++){
        tempHTML += '<tr>'
        for (var j = 0; j < 7; j++){
            if (gmcGroup[j][i] != undefined){
                if (moment(gmcGroup[j][i]).isSame(moment(nextGMC[0]))){
                    tempHTML += '<td style="background-color:'+colorHex[colorGroup[j][i]-1]+'";>'+moment(gmcGroup[j][i]).format('LT')+'<span class="label label-default pull-right">Next</span></td>'
                }
                else{
                    tempHTML += '<td style="background-color:'+colorHex[colorGroup[j][i]-1]+'";>'+moment(gmcGroup[j][i]).format('LT')+'</td>'
                }
            }
            else{
                tempHTML += '<td></td>'
            }
        }
        tempHTML += '</tr>'
    }
    notifSet.played = false;
    $(tempHTML).appendTo(t)
    console.log(gmcGroup)
}
function countdown(){
    var currentTime= new moment();
    $('#dateLocal').text(currentTime.format('LTS dddd'));

    var x = new moment();
    var nextOne = moment(nextGMC[0]);
    var previousOne = moment(previousGMC);
    var previousOnePlusTwo = moment(previousGMC).add(2, 'hours');
    $('#upcomingGMC').text(moment().countdown(nextOne,countdown.HOURS|countdown.MINUTES|countdown.SECONDS,2)+' ('+moment(nextOne).format('LT')+')');
    if (x.isBetween(previousOne, previousOnePlusTwo)){
        $('#finishGMC').text(moment().countdown(previousOnePlusTwo,countdown.HOURS|countdown.MINUTES|countdown.SECONDS,2)+' ('+moment(previousOnePlusTwo).format('LT')+')');
        $('#currentStatus').removeClass('alert-info').addClass('alert-success');
        $('#statusOngoing').show();
    }
    else{
        $('#statusOngoing').hide();
        $('#currentStatus').removeClass('alert-success').addClass('alert-info');
    }
    if (x.isAfter(nextOne)){
        gmcSchedule();
        updateNextGMCs();
    }
    if (x.isAfter(moment(nextOne).subtract(notifSet.time,'minutes')) && notifSet.played == false && notifSet.sound !=undefined){
        $.playSound('../sound/'+notifSet.sound);
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            message: 'Next GMC is in less than '+notifSet.time+ ' minutes',
        },{
            type: 'danger',
            delay:'10000',
            placement: {
                from: "bottom",
                align: "right"
            }
        });
        notifSet.played = true;
    }
    
}
$(document).ready(function(){
    
    //init
    gmcSchedule();
    updateNextGMCs();
    countdown();
    setInterval(countdown,1000);
    
    
    $('.pull-down').each(function() {
      var $this = $(this);
      $this.css('margin-top', $this.parent().height() - $this.height())
    });
    
    //load accounts from local
    var loadAcc = localStorage.getItem("storeAccount");
    if(localStorage.getItem("storeAccount") != null){
        gmcAccount = JSON.parse(loadAcc);
    }
    function storeAcc(){
        localStorage.setItem("storeAccount",JSON.stringify(gmcAccount));
    }
    //load notification settings from local
    var loadNot = localStorage.getItem("storeNotif");
    if(localStorage.getItem("storeNotif") != null){
        notifSet = JSON.parse(loadNot);
    }
    function storeNotification(){
        localStorage.setItem("storeNotif",JSON.stringify(notifSet));
    }
    
    
    //notifications stuffs
    $('#soundSel').prop('disabled', !$('#notifCheck').is(':checked'));
    $('#timeSel').prop('disabled', !$('#notifCheck').is(':checked'));
    $('#soundSel').val(notifSet.sound);
    $('#timeSel').val(notifSet.time);
    $('#notifCheck').prop('checked', notifSet.state);
    updateNotif();
    function updateNotif(){
        $('#soundSel').prop('disabled', !$('#notifCheck').is(':checked'));
        $('#timeSel').prop('disabled', !$('#notifCheck').is(':checked'));
    }
    $('#notifCheck').change(updateNotif)
    $('#saveSettings').on('click',function(){
        notifSet = new notif($('#notifCheck').is(':checked'),$('#timeSel').val(),$('#soundSel').val(),false);
        storeNotification();
    })
    
    
    
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
        var newAcc = new account(name,null,0,0,0,0,0,0,0,0)
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
            var tempSpan = document.createElement('span')
            if(gmcAccount[i].cooldown != null) {
                if (moment(cutOff).isAfter(now)){
                    tempSpan.textContent=moment.duration(cutOff.diff(now)).format('h [h] m [m]');
                    tempSpan.setAttribute('class', 'label label-danger');
                }
                else {gmcAccount[i].cooldown != null;
                    tempSpan.textContent='No CD';
                    tempSpan.setAttribute('class', 'label label-default');
                }
            }
            else{
                tempSpan.textContent='No CD';
                tempSpan.setAttribute('class', 'label label-default');
            }
            console.log(tempSpan)
            ttC.appendChild(tempSpan)
            
            
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
            buttonE.setAttribute('class', 'btn btn-primary testbutt');
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
        setTimeout(updateTable,60000);
        
    }
    
   function addToken(){
        var gmc = $(this).parent().data('gmc');
        var accIndex = $(this).parent().data('col');
        console.log(gmcAccount[accIndex][gmc])
        gmcAccount[accIndex][gmc] += 1;
        if (autoCoolState) {gmcAccount[accIndex].cooldown = new moment().add(48, 'hours')};
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
        gAccIndex = $(this).parent().data('col');
        
        $('#timePicker').modal({backdrop: 'static', keyboard: false});
        updateTable();
        storeAcc();
    }
    
    $('#timePicker').on('shown.bs.modal', function () {
        var picker = $('#completePicker').datetimepicker({locale:locale});
        var cd = moment(gmcAccount[gAccIndex].cooldown).format();
        picker.data("DateTimePicker").minDate(moment());
        if (gmcAccount[gAccIndex].cooldown != null) {picker.data("DateTimePicker").date(moment(cd));}
        else {picker.data("DateTimePicker").date(moment());}
    })
    $('#cancelCD').on('click',function(){
        
    })
    $('#saveCD').on('click',function(){
        var picker = document.getElementById('completePicker')
        gmcAccount[gAccIndex].cooldown= moment($(picker).data("DateTimePicker").date());
        updateTable();
        storeAcc();
    })
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
        gmcTD.hour(0);                
        gmcTD.minute(0);
        gmcTD.second(0);
        gmcTD.millisecond(0);
        x = moment.tz(gmcTD.format("YYYY-MM-DD HH:mm:ss"),zone)
        x.tz(moment.tz.guess());
        gmcAccount[accIndex].cooldown = x;
        updateTable();
        storeAcc();
    }
    
    //edit mode button
    $('#autoCoolButton').on('click', function(){
        autoCoolState = !autoCoolState;
        if (autoCoolState){$(this).html('<b>Auto Cooldown: <span style="color:green">On</span></b>')}
        else{ $(this).html('<b>Auto Cooldown: <span style="color:red">Off</span></b>')}
        
    })
    
    //preview sound
    $('#previewSoundButt').on('click',function(){
        $.playSound('../sound/'+$('#soundSel').val());
    })
    
    updateTable();
    
    
    //guide functions
    $('.linkGuide').on('click', function(){
        var gmc = $(this).text();
        $('#guideHead').text(guide[gmc].name);
        $('#guideBody').html('<img class="center-block" src="../img/gmc/sprite/'+gmc+'.gif" align="middle">')
        $('#guideMap').html(guide[gmc].mapg);
        $('#guidef1').html(guide[gmc].f1);
        $('#guidef2').html(guide[gmc].f2);
        $('#guidef3').html(guide[gmc].f3);
        $('#guideMvp').html(guide[gmc].mvp);
        $('#guideArrow').html(guide[gmc].arrow);
        $('#guideGear').html(guide[gmc].gear);
        $('#guideStrategy').html(guide[gmc].general);
        $('#guideChampion').html(guide[gmc].champion);
        $('#guidePaladin').html(guide[gmc].paladin);
        $('#guideSniper').html(guide[gmc].sniper);
        $('#guideHpriest').html(guide[gmc].hpriest);
        $('#guideHwizard').html(guide[gmc].hwizard);
        $('#guideCreator').html(guide[gmc].creator);
    })
});