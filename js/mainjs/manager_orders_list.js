$(document).ready(function(){

    let mycookie = Cookies.get("manager");
    if(mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }

    let token = Cookies.get("managerToken");
        
    $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
    $('#helperinfocheif').load('helperManager.html div#helperinfocheif');
    getBiscuits();
    
    function getBiscuits(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/biscuit/",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#buscuitId");
            let count = biscuits.length - 1;
        
            data.forEach(elem=>{
                let element = document.createElement("option");
                element.textContent = elem.name;
                element.setAttribute("value", elem.id);
                biscuits[count].appendChild(element);
            })
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    }

    $("button#addOrderRow").click(function(){
        getBiscuits();

        let div, div0, div1_1, div1_2, input1;

        div = document.querySelector("#addOrderForm");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 3; i++){
            div1_1 = document.createElement("div");
            div1_1.classList.add("col");
            
            div1_2 = document.createElement("div");
            div1_2.classList.add("form-group");
            
            input1 = document.createElement("input");
            input1.setAttribute("type", "text");
            input1.classList.add("form-control");

            if (i == 1){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "buscuitId");
                input1.style.width = '15rem';
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
            }
            if (i == 3){
                input1 = document.createElement("textarea");
                input1.classList.add("form-control");
            }
            
            div1_2.appendChild(input1);
            div1_1.appendChild(div1_2);
            div0.appendChild(div1_1);
        }   
        div.appendChild(div0);
                
    })

    $("button#remOrderRow").click(function(){
        let div = document.querySelector("#addOrderForm");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    function search_table(value, count){
        $('#client_table tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
            })
            if (found){
                $(this).show();
                $('#counter').html(count + ' ta topildi');
            }else{
                $(this).hide();
            }
        })
    }
})