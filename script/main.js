var charClass = "";
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
    $(".classB").click(function(){
        charClass= $(this).text();
        $("#classL").text(charClass);
    })
    
}
});


