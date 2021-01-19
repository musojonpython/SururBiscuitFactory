$(document).ready(function(){

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    let token = Cookies.get("directorToken");
    
    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie.cookie != ''){
            var cookies = document.cookie.split(';')
            for (var i = 0; i <  cookies.length; i++){
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')){
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

})