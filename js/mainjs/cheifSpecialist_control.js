$(document).ready(function(){
    
    let mycookie = Cookies.get('cheifSpecialist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    let token = Cookies.get('cheifSpecialistToken');

    $('#helpersubmenu').load('helpercheifSpecialist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifSpecialist.html div#helperinfocheif' )
    
    getexpenseName();
    warehouseproducts();

    $("#deletedata").click(function(){
        location.reload();
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)    
    })

    function search_table(value, count){        
        $('#client_table tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
                if (found){
                    $(this).show();
                    $('#counter').text(count + ' ta topildi');
                }else{
                    $(this).hide();
                    $('#counter').text(count + ' ta topildi');
                }
            })
        })
    }

    $("#savedata").click(function(){
        let name = $('#nameexpense').val();

        if (name != ''){
            let data = {
                "name": name
            }
            data = JSON.stringify(data);

            $.ajax({
                type: "post",
                url: "http://206.189.145.94/api/v1/expense/",
                headers:{
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
                },
                data: data,
            })
            .done(function(json){
                location.reload();
            }) 
            .fail(function(json){
                alert("Internet yo'q")
            })       
        }
    })

    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        let p = par.children().length - 3;
        let elem, name, desc, firm, meas;

        elem = par.children().eq(1);
        name = elem.children().val();
        id = elem.parent().children('#nameproduct').attr("data-id")

        elem = par.children().eq(2);
        cost = elem.children().val();

        elem = par.children().eq(3);
        currency = elem.children().val();
            
        let data = {
            expense: name,
            cost: cost,
            currency: currency
        }
        
        $.ajax({
            type: "PUT",
            headers: {
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/expense/add/quantity/${id}/`,
            data: data,
        })
        .done(function(json){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })   
    })

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $(document).on("click", "#editbutton", function(){
        getexpenseName();
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 2; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);

            if (i == 2){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='expenseName'> </select> `)
            }else{
                elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
            }
        }
    })


    $("form#addproductform").submit(function(event){
        event.preventDefault();

        let count = event.target.length - 3;
        let productid, quantity;

        for (let i = 0; i < count; i++){
            productid = parseFloat(event.target[i].value); i++;
            quantity = parseFloat(event.target[i].value);

            let data = {
                expense: productid,
                cost: quantity
            }
            
            $.ajax({
                type: 'post',
                url: 'http://206.189.145.94/api/v1/expense/add/quantity/',
                headers: {
                    'Authorization': `token ${token}`
                },
                data: data,
            })
            .done(function(json){
                location.reload();
            })
            .fail(function(){
                alert("Internet yo'q");
            })   
        }
    })
    
    

    function warehouseproducts() {
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/expense/add/quantity/',
            headers: {
                'Authorization': `Token ${token}`
            },
        })
        .done(function(data){
            let output = "", size = 0;
            data.forEach(elem=>{
                size++;
                var {expense: {name}, expense: {id},  cost, currency, created_date, modified_date} = elem;
                console.log(id)
                created_date = created_date.slice(0, 10);
                modified_date = modified_date.slice(0, 10);

                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td id="nameproduct" data-id=${id}>${name}</td>
                    <td>${cost}</td>
                    <td>${currency}</td>
                    <td>${created_date}</td>
                    <td>${modified_date}</td>
                    <td style="display: flex; flex-direction: row">
                    <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                    <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                    <p style="font-size: 20px; margin-right: 10px; display:none; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Orqaga qaytarish" id="undobutton"><i class="fa fa-undo"></i></p>
                    </td>
                </tr>
                `
            })
            $("#dynamictable").html(output);
        })
        .fail(function(){
            alert("Internet yo'q")
        })
    }


    $("button#addproductrow").click(function(){
        getexpenseName();

        let div, div0, input1, div1, div2;

        div = document.querySelector("#addproductrowId");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 2; i++){
            div1 = document.createElement("div");
            div1.classList.add("col");
        
            div2 = document.createElement("div");
            div2.classList.add("form-group");   
            
            if(i == 1){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "expenseName");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
            
            if (i == 2){
                input1 = document.createElement("input");
                input1.setAttribute("required", "required");
                input1.setAttribute("type", "number");
                input1.classList.add("form-control");
                input1.style.marginLeft = "20px";
            }
            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }

        div.appendChild(div0);
    })

    $("button#removeproductrow").click(function(){
        let div = document.querySelector("#addproductrowId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    function getexpenseName(){
        $.ajax({
            type: 'get',
            url: 'http://206.189.145.94/api/v1/expense/',
            headers:{
                'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#expenseName");
            let count = biscuits.length - 1;
        
            data.forEach(elem=>{
                const {name, id} = elem
                let element = document.createElement("option");
                element.textContent = name
                element.setAttribute("value", id);
                biscuits[count].appendChild(element);
                })
            })
            .fail(function(){
                alert("Internet yo'q");
            })
    }
})