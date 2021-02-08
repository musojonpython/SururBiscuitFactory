$(document).ready(function(){
    
    let mycookie = Cookies.get("manager");

    if(mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    var token = Cookies.get("managerToken");

    $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
    $('#helperinfocheif').load('helperManager.html div#helperinfocheif');

    getBiscuits();  
    getClients();  
    warehouseSaledProducts();    

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $('#search').keyup(function(){
        let count = 0;
        // let searchWords = $(this).val();
        search_table($(this).val(), count)
    })

    $("#form").submit(function(event){
        event.preventDefault();
        let count = event.target.length - 5;
        let biscuit, quantity, sellcost, client, payment_type, comment;
        
        for (let i = 0; i < count; i++){
            biscuit = parseFloat(event.target[i].value); i++;
            sellcost = parseFloat(event.target[i].value); i++;
            quantity = parseFloat(event.target[i].value); i++;
            client = parseFloat(event.target[i].value); i++;
            payment_type = event.target[i].value; i++;
            comment = event.target[i].value;
            
            senddata = {
                "biscuit":biscuit,
                "sale_price":sellcost
            }
            senddata = JSON.stringify(senddata);

            $.ajax({
                type: 'post',
                url: `http://206.189.145.94/api/v1/biscuit/sale/price/`,
                headers:{
                    'Authorization': `Token ${token}`,
                },
                data:senddata,
            })
            .done(function(json){
                // location.reload();
            })
            .fail(function(xhr, errorThrown, status){
                infojson = xhr.responseJSON;
                
                if (status == 'Bad Request' || errorThrown == 'Bad Request'){
                    alert(infojson['non_field_errors'][0])
                }else{
                    alert("Internet yo'q");
                }
            })    

            let data = {
                "biscuit":biscuit,
                "quantity":quantity,
                "comment":comment,
                "payment_type":payment_type,
                "client":client
                // "sale_price": sellcost ertaga ochilishi kerak
            }
            
            data = JSON.stringify(data);

            $.ajax({
                type: 'post',
                url: `http://206.189.145.94/api/v1/biscuit/company/sale/`,
                data: data,
                headers: {
                    'Authorization': `Token ${token}`,
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                }
            })
            .done(function(json){
                location.reload();
            })
            .fail(function(xhr, errorThrown, status){
                infojson = xhr.responseJSON;
                console.log("🚀 ~ file: manager_buy_biscuits.js ~ line 94 ~ .fail ~ infojson", infojson)
                
                if (status == 'Bad Request' || errorThrown == 'Bad Request'){
                    alert(infojson['error'][0])
                }else{
                    alert("Internet yo'q");
                }
            })    
        }
    })
  
    $("button#addbuyformrow").click(function(){
        getBiscuits();
        getClients();

        let div, div0, div1_1, div1_2, input1, option;

        div = document.querySelector("#addbuyformId");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 6; i++){
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
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.width = '10rem';
            }
            if (i == 4){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "clientId");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.width = '10rem'
            }
            if(i == 5){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.width = '10rem'
                option = document.createElement("option");
                option.value = 'credit_card';
                option.text = 'Plastik karta'
                input1.appendChild(option);
                option = document.createElement("option");
                option.value = 'debt';
                option.text = 'Nasiya'
                input1.appendChild(option);
                option = document.createElement("option");
                option.value = 'cash';
                option.text = 'Naqd pul'
                input1.appendChild(option);
            }
            if (i == 3 || i == 2){
                input1 = document.createElement("input");
                input1.setAttribute("required", "required");
                input1.setAttribute("type", "number");
                input1.classList.add("form-control");
            }
            
            div1_2.appendChild(input1);
            div1_1.appendChild(div1_2);
            div0.appendChild(div1_1);
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
        let p = par.children().length - 2;

        for (let i = 2; i < p; i++){
            elem = par.children(`td:nth-child(${i})`);

            if (i == 3 || i == 5 || i == 6 || i == 10){
                elem.html(`<input  style='width:100%' type='text' value='${elem.text()}' required/>`);
            }
            
            if(i == 2){
                elem.html(`<select style='width:100px' class="select2_single" tabindex="1" id='buscuitId'> </select> `)
            }
            if(i == 7){
                elem.html(`<select class="select2_single" tabindex="0" required style='width:100px'>
                                <option value="credit_card">Plastik karta</option>
                                <option value="debt">Nasiya</option>
                                <option value="cash">Naqd pul</option>
                            </select>`
                )
            }
            if (i == 9){
                elem.html(`<select style='width:100px' class="select2_single" tabindex="1" id='clientId'> </select> `)
            }
        }
        getBiscuits();  
        getClients();  
    })

    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        // let p = par.children().length - 1;

        // Nomi	Og'irligi	O'lchov birligi	Sotilgan narxi	Pul birligi	Tolov turi	Umumiy pul	Kompaniya	Izoh	Sotilgan kun	Sotilgan vaqt
        let elem, biscuit, quantity, sellcost, currency, payment_type, client, comment;

        elem = par.children('#namecompany');
        el = par.children().eq(0);
        console.log(el);
        elem = par.children('#namecompany').attr("data-id");

        elem = par.children().eq(1);
        biscuit = elem.children().val();

        elem = par.children().eq(2);
        quantity = elem.children().val();

        elem = par.children().eq(3);
        measure = elem.children().val();

        elem = par.children().eq(4);
        sellcost = elem.children().val();

        elem = par.children().eq(5);
        currency = elem.children().val();

        elem = par.children().eq(6);
        payment_type = elem.children().val();

        elem = par.children().eq(8);
        client = elem.children().val();

        elem = par.children().eq(9);
        comment = elem.children().val();

        senddata = {
            "biscuit":biscuit,
            "sale_price":sellcost
        }
        senddata = JSON.stringify(senddata);

        $.ajax({
            type: 'put',
            url: `http://206.189.145.94/api/v1/biscuit/sale/price/${biscuit}/`,
            headers:{
                'Authorization': `Token ${token}`,
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            data:senddata,
        })
        .done(function(json){
            // location.reload();
        })
        .fail(function(json){
            alert("Internet yo'q");
        })

        let data = {
            "biscuit":biscuit,
            "quantity":quantity,
            "comment":comment,
            "payment_type":payment_type,
            "client":client,
            "currency": currency
        }
        
        data = JSON.stringify(data);

        $.ajax({
            type: 'put',
            url: `http://206.189.145.94/api/v1/biscuit/company/sale/${biscuit}/`,
            data: data,
            headers: {
                'Authorization': `Token ${token}`,
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        })
        .done(function(json){
            location.reload();
        })
        .fail(function(xhr, errorThrown, status){
            infojson = xhr.responseJSON;
            
            if (status == 'Bad Request' || errorThrown == 'Bad Request'){
                alert(infojson['non_field_errors'][0])
            }else{
                alert("Internet yo'q");
            }
        })    
    })

    function getClients(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/client/",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#clientId");
                let count = biscuits.length - 1;
            
                data.forEach(elem=>{
                    let element = document.createElement("option");
                    element.textContent = elem.company;
                    element.setAttribute("value", elem.id);
                    biscuits[count].appendChild(element);
                })
            })
            .fail(function(){
                alert("Internet yo'q");
        })
    }

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
    
    function warehouseSaledProducts() {
        let size = 1
        $.ajax({
            type: "get",
            url: "http://206.189.145.94/api/v1/biscuit/company/sale/",
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done (function(vitaldata){
                let output = "";
                console.log(vitaldata);
                vitaldata.forEach(elem=>{
                    size = 1;
                    let sale_price1, total_price1;
                    
                    let {
                        id, biscuit:{name}, quantity, 
                        client:{company}, payment_type, modified_date, 
                        currency, biscuit:{unit_of_measurement}, comment
                        } = elem;
                    // sale_price1 = elem.sale_price; ertaga ochilish kerak

                    if (payment_type == 'credit_card'){
                        payment_type = "Plastik yoki bank o'tkazma"
                    }
                    if(payment_type == 'debt'){
                        payment_type = 'Nasiya';
                    }
                    if(payment_type == 'cash'){
                        payment_type = "Naqd pul"
                    }

                    time = modified_date.slice(11, 16);
                    modified_date = modified_date.slice(0, 10);
                    
                    $.ajax({
                        type: "get",
                        url: `http://206.189.145.94/api/v1/biscuit/sale/price/${id}/`,
                        headers: {
                            'Authorization': `Token ${token}`    
                        },
                    })
                    .done(function(data){
                        let {sale_price,  default_price} = data;
                        sale_price1 = sale_price;
                        default_price1 = default_price

                        sale_price = parseFloat(sale_price.slice(0, -3))
                        quantity = parseFloat(quantity.slice(0, -3))
                        
                        total_price1 = sale_price * quantity;   
                        output =  output + `
                        <tr>
                            <th data-id=${id} id="namecompany" scope="row">${size}</th>
                            <td>${name}</td>
                            <td>${quantity}</td>
                            <td>${unit_of_measurement}</td>
                            <td>${sale_price1}</td>
                            <td>${currency}</td>
                            <td>${payment_type}</td>
                            <td>${total_price1}</td>
                            <td>${company}</td>
                            <td>${comment}</td>
                            <td>${modified_date}</td>
                            <td>${time}</td>
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
                        document.getElementById('dynamictable').innerHTML=output;
                        size++;
                    })
                    .fail(function(){
                            alert("Internet yo'q");
                        })                        
                })
            })
            .fail(function(){
                alert("Internet yo'q");
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
