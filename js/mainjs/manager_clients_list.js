$(document).ready(function(){

        let mycookie = Cookies.get("manager");
        
        if(mycookie == "false" || mycookie == undefined){
            window.open("index.html", "_self");
        }

        let token = Cookies.get("managerToken");
        
        $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
        $('#helperinfocheif').load('helperManager.html div#helperinfocheif');

        warehouseProducts();

        $(document).on("click", "#undobutton", function(){
            location.reload();
        })

        $('#search').keyup(function(){
            let count = 0;
            search_table($(this).val(), count)
        })

        $("form").submit(function (event){
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
                    "company": f_name,
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
                    url: 'http://206.189.145.94/api/v1/client/',
                    data: senddata
                })
                    .done(function(data){
                        location.reload();
                    })
                    .fail(function(xhr, errorThrown, status){
                        info = xhr.responseText;

                        if (status == 'Bad Request'){
                            alert(info)
                        }else{
                            alert("Internet yo'q");
                        }
                    })
                }
            }
        )
    
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
        
        $("button#removebuyformrow").click(function(){
            let div = document.querySelector("#addbuyformId");
            let count = div.childElementCount;
            if (count > 1){
                div.removeChild(div.lastChild);
            }
        })

        $('tbody').on("click", '#editbutton', function(){
            $(this).next().css("display", "block");
            $(this).nextAll().eq(1).css("display", "block");
    
            let par = $(this).parent().parent(); 
            let p = par.children().length - 1;
    
            for (let i = 2; i < p; i++){
                elem = par.children(`td:nth-child(${i})`);
                elem.html(`<input  style='width:100%' type='text' value="${elem.text()}" required/>`);
            }
        })

        $(document).on("click", "#saveupdatebutton", function(){
            let par = $(this).parent().parent();
            let p = par.children().length - 1;
            const companyid = parseFloat(par.children("#namecompany").attr("data-id"));
            
            let elem, com, fname, lname, xp, mf, inn, phnumber, add;
            
            elem = par.children().eq(1);
            com = elem.children().val();
            
            elem = par.children().eq(2);
            fname = elem.children().val();

            elem = par.children().eq(3);
            lname = elem.children().val();

            elem = par.children().eq(4);
            phnumber = elem.children().val();

            elem = par.children().eq(5);
            add = elem.children().val();

            elem = par.children().eq(6);
            xp = elem.children().val();

            elem = par.children().eq(7);
            mf = elem.children().val();

            elem = par.children().eq(8);
            inn = elem.children().val();

            let data = {
                 "company": com,
                "first_name": fname,
                "last_name": lname,
                "address": add,
                "x_p": xp,
                "m_f_o": mf,
                "inn": inn,
                "phone_number": phnumber,
            }
            data = JSON.stringify(data);

            $.ajax({
                type: "put",
                url: `http://206.189.145.94/api/v1/client/${companyid}/`,
                headers: {
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
                },
                data: data,
            })
            .done(function(data){
                location.reload();
            })
            .fail(function(xhr, errorThrown, status){
                info = xhr.responseText;

                if (status == 'Bad Request'){
                    alert(info)
                }else{
                    alert("Internet yo'q");
                }
            })
        })

        function warehouseProducts(){
            $.ajax({
                type: "get",
                headers: {
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                url: 'http://206.189.145.94/api/v1/client/',
            })
            .done(function(data){
                let output = "", size = 0;
    
                data.forEach(elem=>{
                    size++;
                    let {company, first_name, last_name, address, x_p, m_f_o, 
                        inn, phone_number, created_date, id} = elem;

                    created_date = created_date.slice(0, 10);
                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td data-id=${id} id="namecompany">${company}</td>
                        <td>${first_name}</td>
                        <td>${last_name}</td>
                        <td>${phone_number}</td>
                        <td>${address}</td>
                        <td>${x_p}</td>
                        <td>${m_f_o}</td>
                        <td>${inn}</td>
                        <td>${created_date}</td>
                        <td style="display: flex; flex-direction:row">
                            <p style="font-size: 20px; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton">
                                <i class="fa fa-edit"></i>
                            </p>
                            <p style="font-size: 20px; display: none; margin-right:5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton">
                                <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                            </p>
                            <p style="font-size: 20px; display:none; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton">
                                <i class="fa fa-undo"></i>
                            </p>
                        </td>
                    </tr>
                    `
                })
                document.getElementById('dynamictable').innerHTML=output;
            })
            .fail(function(xhr, errorThrown, status){
                info = xhr.responseText;

                if (status == 'Bad Request'){
                    alert(info)
                }else{
                    alert("Internet yo'q");
                }
            })  
        }

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
                    $("#counter").text(count + " ta topildi");
                }
            })
        }

    })