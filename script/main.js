

var charClass = "";

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
    $('a.classSelect').click(function(){
        charClass= $(this).text();
        $("#classLabel").text(charClass);
        $("#classL").text(charClass);
    });
    
});


