$(document).ready(function(){
    
    mycookie = Cookies.get("director");

    if (mycookie == "false" || mycookie == undefined){
        window.open('index.html', "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');
    
    $("button#changetable").click(function(){
        let button = $(this).parent().parent().children();
        let array = []

        for (let i = 1; i <= button.length - 4; i++){
            array.push(button[i].outerText);
        }

        const [fam, name, role, phone, pass, perc, ext] = array;

        console.log(fam, name, role, phone, pass, perc, ext);
        
    })

    $("button#savetable".click(function(){
        let button = $(this).parent().parent().children();
        let array = [];

        for (let i = 1; i <= button.length - 4; i++){
            array.push(button[i].outerText);
        }

        const [fam, name, role, pass, perc, extr] = array;
        let data = {};
        $.ajax({
            url: 'https:...',
            type: 'POST'
        }).done(function (data) {
            alert("Malumotlar muvaffaqiyali saqlandi");
        }).fail(function () {
            alert("Internet yo'q");
        })
    }))

    $("button#delete").click(function() {
        let button = $(this).parent().parent().children();
    })
})