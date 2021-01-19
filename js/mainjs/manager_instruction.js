$(document).ready(function(){
    
    let mycookie = Cookies.get("manager");
    
    if(mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    let token = Cookies.get("managerToken");
    
    $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
    $('#helperinfocheif').load('helperManager.html div#helperinfocheif');
})