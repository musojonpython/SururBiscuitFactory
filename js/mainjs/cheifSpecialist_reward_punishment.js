$(document).ready(function(){

    let mycookie = Cookies.get('cheifSpecialist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    
    let token = Cookies.get('cheifSpecialistToken');
    
    $('#helpersubmenu').load('helpercheifSpecialist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifSpecialist.html div#helperinfocheif' )
    
})