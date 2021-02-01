$(document).ready(function(){

    mycookie = Cookies.get("jobAdministrator");
    
    if (mycookie == "false" || mycookie == undefined){
        window.open('index.html', "_self");
    }
    
    let token = Cookies.get("jobAdministratorToken");
    
    $('#helpersubmenu').load('helperjobAdministrator.html div#helpersubmenu') 
    $('#helperinfocheif').load('helperjobAdministrator.html div#helperinfoCheif' )
    
    warehouseWorkers();

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
    })

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })
  
    $(document).on("click", "#editbutton", function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 1;

        for (let i = 2; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);
            elem.html(`<input style='width:100%' class="form-control" type='text' value='${elem.text()}' required/>`)
        }
    })

    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        let p = par.children().length - 1;
        const clientId = parseFloat(par.children("#attrclientid").attr("data-clientId"));

        for (let i = 1; i < p; i++){
            f_name =      par.children().eq(i).children().val(); i++;
            first_name =  par.children().eq(i).children().val(); i++;
            last_name =   par.children().eq(i).children().val(); i++;
            phonenumber = par.children().eq(i).children().val(); i++;
            address =     par.children().eq(i).children().val(); i++;
            mfo =         par.children().eq(i).children().val(); i++;
            inn =         par.children().eq(i).children().val(); i++;
            xp =          par.children().eq(i).children().val();
        }

        data = {
            "first_name": first_name,
            "last_name": last_name,
            "company_name": f_name,
            "address": address,
            "x_p": xp,
            "m_f_o": mfo,
            "inn": inn,
            "phone_number": phonenumber
        }
        data = JSON.stringify(data);
        
        $.ajax({
            type: "put",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/supplier/${clientId}/`,
            data: data,
        })
        .done(function(json){
            location.reload();
        })
        .fail(function(xhr, errorThrown, status){
            info = xhr.responseJSON;
            if (status == 'Bad Request'){
                alert(info[0])
            }else{
                alert("Internet yo'q");
            }
        })    
    })

    $("button#addbuyformrow").click(function(){
        let div, div0, div1, div2, input1;

        div = document.querySelector("#addbuyformId");
        div0 = document.createElement("div");
        div0.classList.add('row');
        
        for (let i = 1; i <= 8; i++){
            
            div1 = document.createElement("div");
            div1.classList.add("col");

            div2 = document.createElement("div");
            div2.classList.add("form-group");

            input1 = document.createElement("input");
            input1.setAttribute("required", "required");
            input1.setAttribute("type", "text");
            input1.classList.add("form-control");

            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }
        div.appendChild(div0);
    })

    $("button#removebiscuitrow").click(function(){
        let div = document.querySelector("#addbuyformId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    $("#form").submit(function(event){
        event.preventDefault();
        
        let count = event.target.length - 3;
        let f_name, address, xp, mfo, inn, phonenumber;
        
        for (let i = 0; i < count; i++){
                
            f_name = (event.target[i].value); i++;
            address = (event.target[i].value); i++;
            xp = (event.target[i].value); i++;
            mfo = (event.target[i].value); i++;
            inn = (event.target[i].value); i++;
            phonenumber = (event.target[i].value); i++;
            first_name = (event.target[i].value); i++;
            last_name = (event.target[i].value);

            let data = {
                "first_name": first_name,
                "last_name": last_name,
                "company_name": f_name,
                "address": address,
                "x_p": xp,
                "m_f_o": mfo,
                "inn": inn,
                "phone_number": phonenumber
            }
                        
            senddata = JSON.stringify(data);
            
            $.ajax({
                type: "POST",
                headers: {
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                url: 'http://206.189.145.94/api/v1/supplier/',
                data: senddata,
            })
              .done(function(json){
                    location.reload();
              })
              .fail(function(xhr, errorThrown, status){
                info = xhr.responseJSON;
                console.log(info['phone_number'])
                console.log(xhr)
                if (status == 'Bad Request'){
                    alert(info.phone_number)
                }else{
                    alert("Internet yo'q");
                }
            })    
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
            if(found){
                $("#counter").text(count + " ta topildi");
                $(this).show();
            }else{
                $(this).hide();
                $("#counter").text(count + " ta topildi");
            }
        })
    }
    
    function warehouseWorkers() {
        $.ajax({
            type: "GET",
            headers: {
                'Authorization': `Token ${token}`
            },
            url: 'http://206.189.145.94/api/v1/supplier/',
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let {company_name,  first_name, last_name, phone_number, address, m_f_o, inn, x_p, id} = elem;
                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-clientId="${id}" id='attrclientid'>${company_name}</td>
                    <td>${first_name}</td>
                    <td>${last_name}</td>
                    <td>${phone_number}</td>
                    <td>${address}</td>
                    <td>${m_f_o}</td>
                    <td>${inn}</td>
                    <td>${x_p}</td>
                    <td sytle='display:flex; flex-direction:row'>
                        <p style="font-size:20px; margin-right: 5px; cursor:pointer" data-toogle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                        <p style="font-size:20px; display:none; margin-right:5px; cursor:pointer"  data-toogle="tooltip" data-placemaent="bottom" title="Saqlash" id="saveupdatebutton"> 
                        <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                        <p style="font-size:20px; margin-right: 5px; cursor:pointer; display:none" data-toogle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
                    </td>
                </tr>
                `
        })
        document.getElementById('dynamictable').innerHTML=output;
        })
        .fail(function(xhr, status, errorThrown){
            info = xhr.responseJSON;

            if (errorThrown == 'Bad Request'){
                alert(info[0] + ' xatolik berish')
            }else{
                alert("Internet yo'q");
            }
        })
    }
})