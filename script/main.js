

var charClass = "";

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
    $('a.classSelect').click(function(){
        charClass= $(this).text();
        $("#classL").text(charClass);
    });
    
});


