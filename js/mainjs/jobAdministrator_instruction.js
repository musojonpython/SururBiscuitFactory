
$(document).ready(function(){

    mycookie = Cookies.get("jobAdministrator");

    if (mycookie == "false" || mycookie == undefined){
        window.open('index.html', "_self");
    }
    let token = Cookies.get("jobAdministratorToken");

    $('#dataRightSubmenu').load('helperjobAdministrator.html div#helpersubmenu');
    $('#infoAboutCheif').load('helperjobAdministrator.html div#helperinfoCheif')
})