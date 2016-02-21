

var charClass=[];
var mdown = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
var mup =  ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
var classDB
var statsPointDB
var jobBonusDB
var maxJobSwitch = false;
var maxJob = 50;
var char = {
    "charBonusStr":"0",
    "charBonusAgi":"0",
    "charBonusVit":"0",
    "charBonusInt":"0",
    "charBonusDex":"0",
    "charBonusLuk":"0",  
    "charTotalStr":"0",
    "charTotalAgi":"0",
    "charTotalVit":"0",
    "charTotalInt":"0",
    "charTotalDex":"0",
    "charTotalLuk":"0",  
}


$(document).ready(function(){
    /*enable popover*/
    $('[data-toggle="popover"]').popover();
    /*import class database*/
    Tabletop.init( { key: '1lK4auOQYRzUMnikY0zfraeYnoPGZZSPg6oOGPo5hqZE',
                   callback: getInfo,
                   simpleSheet: false 
    });
    
    /*DB init*/
    function getInfo(data, tabletop) {
        classDB = tabletop.sheets('class').all(); 
        statsPointDB = tabletop.sheets('statspoint').all();
        jobBonusDB = tabletop.sheets('job_bonus').all(); 
        //init first element
        charClass[0]=classDB[0]
    }
    
    /*reset stats to 1*/
    $("#btnStatsReset").on(mdown, function(){
        $("#panelStats").find(":input").val('1');
        updateStats();        
    });
    
    /*remove annoying focus state on buttons*/
    $(".btn").on(mup,function(){
        $(this).blur();
    });
    
    /*limit input to 99*/
    $("#baseInput").change( function(){
        if($(this).val()<1) $(this).val(1); 
        if($(this).val()>99) $(this).val(99); 
        updateStats();
    });
    $("#jobInput").change( function(){
        if($(this).val()<1) $(this).val(1); 
        if($(this).val()>maxJob) $(this).val(maxJob);
        maxJobSwitch = false;
        updateStats();
    });
    
    
        
    function getClassByName(name) {
        return classDB.filter(
            function(data){
                return data.class_name == name; }
        );
    };
    $('.btn-weapon').on(mup, function(){
        $('.btn-weapon').removeClass('active');
        $(this).addClass('active'); 
    });
    
    $('[data-toggle="tooltip"]').tooltip(); 
    $('.classSelect').on(mdown, function(){
        
        $(".classB").button('reset');
        $(".classB").removeClass('active');
        var found = getClassByName($(this).text());
        charClass[0]=found[0];
        $("#classLabel").text(charClass[0].class_name);
        $("#classL").text(charClass[0].class_name);
        
    });
    $('.classSelect').on(mup, function(){
        /*change button label*/
        if ($(this).hasClass("btn")){
            $(this).html($(this).text()+' <span class="label label-default">Selected</span>');
            $(this).val($(this).text());
            $(this).addClass('active');
        } else{
            $(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="label label-default">Selected</span> <span class="caret"></span>');
            $(this).parent().parent().siblings(".btn:first-child").val($(this).text());
            $(this).parent().parent().siblings(".btn:first-child").addClass('active');
            console.log(eval('jobBonusDB[2].'+charClass[0].class)); 
            
        }
        /*change background on release*/
        if ($(window).width() > 768) { 
            $('body').css({"background-image":"url(/img/class-e/"+charClass[0].bg_link_f+")"});
        };
        
        /*set panel heading by class*/
        $('#panel-class-heading').css({"color":"white"});
        $('#panel-class-heading').css({"background-color":charClass[0].color_hex_dark});
        /*set label color by class*/
        $('#classLabel').css({"background":charClass[0].color_hex_dark})
        $('#classL').css({"background":charClass[0].color_hex_dark})
        
        /*set image*/
        $('#classImg').attr('src',"img/class/"+charClass[0].image_link);
        $('#classImg').attr('alt',charClass[0].class_name);
        updateMaxJob();
        updateStats();
        
    });
    
    /* background when resize*/
     $(window).resize(function() {
        if ($(window).width() > 768) { 
            $('body').css({"background-image":"url(/img/class-e/"+charClass[0].bg_link_f+")"});} else{
            $('body').css({"background-image":"url()"});
            }
        });
     
    
    /*focus when hovered*/
    $(".input-xs").mouseenter(function(){
        $(this).focus();   
    });
    
    $(".input-xs").mouseleave(function(){
        updateStats();
        $(this).blur();
    });
    
    $(".input-xs").focus(function(){
       $(this).select(); 
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

     /*max base/job*/
    $("#buttonMaxBase").click(function(){
        $("#baseInput").val(99);
        updateStats();
    });
    $("#buttonMaxJob").click(function(){
        maxJobSwitch=true;
        updateMaxJob();
        updateStats();
    });
    
    function updateMaxJob(){
        
        if(charClass[0].trans==1){
            maxJob = 70;
        }else if(charClass[0].class=="super_novice"){
            maxJob = 99;
        }else if(charClass[0].class=="novice"||charClass[0].class=="high_novice"){
            maxJob = 10;
        }else{
            maxJob = 50;
        }
        if(maxJobSwitch){
        $("#jobInput").val(maxJob);
        }
        if ($("#jobInput").val()>maxJob){
            $("#jobInput").val(maxJob);
        }
    };
    
    /*very important function*/
    function updateStats (){
        var i=0;
        var baseHP=35;
        var jobBonusStr=0;
        var jobBonusAgi=0;
        var jobBonusVit=0;
        var jobBonusInt=0;
        var jobBonusDex=0;
        var jobBonusLuk=0;
        var filter;
        var statsTotal=48;
        var baseLevel=$("#baseInput").val()
        var jobLevel=$("#jobInput").val()
        var hpModB = charClass[0].hp_mod_b;
        var hpModA = charClass[0].hp_mod;
        
        //base HP calculation
        baseHP += baseLevel*hpModB;
        for(i=2;i<=baseLevel;i++){
            baseHP += Math.round(hpModA*i);
        }
        
        //MaxHP display
        $("#statsMHP").text(baseHP);
        
        //statspoints calculation
        filter = statsPointDB.filter( function(data){
            return data.level == baseLevel;
        });
        if (charClass[0].trans == 0){
            statsTotal=parseInt(filter[0].total);
        } else{
            statsTotal=parseInt(filter[0].total)+52;
        }
        
        /*stats from job function*/ 
        for(i=0;i<jobLevel;i++){
            switch (parseInt(eval('jobBonusDB['+i+'].'+charClass[0].class))){
                case 0:break;
                case 1:jobBonusStr+=1;break;
                case 2:jobBonusAgi+=1;break;
                case 3:jobBonusVit+=1;break;
                case 4:jobBonusInt+=1;break;
                case 5:jobBonusDex+=1;break;
                case 6:jobBonusLuk+=1;break;
            }
             
        }
        
        char.charBonusStr=jobBonusStr;
        char.charBonusAgi=jobBonusAgi;
        char.charBonusVit=jobBonusVit;
        char.charBonusInt=jobBonusInt;
        char.charBonusDex=jobBonusDex;
        char.charBonusLuk=jobBonusLuk;
        
        char.charTotalStr=parseInt($("#iStr").val())+parseInt(char.charBonusStr);
        char.charTotalAgi=parseInt($("#iAgi").val())+parseInt(char.charBonusAgi);
        char.charTotalVit=parseInt($("#iVit").val())+parseInt(char.charBonusVit);
        char.charTotalInt=parseInt($("#iInt").val())+parseInt(char.charBonusInt);
        char.charTotalDex=parseInt($("#iDex").val())+parseInt(char.charBonusDex);
        char.charTotalLuk=parseInt($("#iLuk").val())+parseInt(char.charBonusLuk);
        
        
        $("#sBonusStr").text(char.charBonusStr);
        $("#sBonusAgi").text(char.charBonusAgi);
        $("#sBonusVit").text(char.charBonusVit);
        $("#sBonusInt").text(char.charBonusInt);
        $("#sBonusDex").text(char.charBonusDex);
        $("#sBonusLuk").text(char.charBonusLuk);
        
        $("#sTotalStr").text(char.charTotalStr);
        $("#sTotalAgi").text(char.charTotalAgi);
        $("#sTotalVit").text(char.charTotalVit);
        $("#sTotalInt").text(char.charTotalInt);
        $("#sTotalDex").text(char.charTotalDex);
        $("#sTotalLuk").text(char.charTotalLuk);
        
        $("#statsPointsLeft").text(statsTotal);
        
    }

});


