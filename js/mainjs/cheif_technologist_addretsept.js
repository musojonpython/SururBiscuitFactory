$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }

    let token = Cookies.get('cheifTechnologistToken');
    
    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )

    let producttable = false;
    let biscuittable = true;

    getproducts();
    getproducts1();
    getBiscuit();
    getXomashyo();
    warehouseproducts();


    // Begin Creating dynamic rows for new type biscuit
    
    $("button#addNewTypeBiscuitrow").click(function(){
        let div, div0, input1, div1, div2;

        div = document.querySelector("#newTypeBiscuitAddRowid");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 4; i++){
            div1 = document.createElement("div");
            div1.classList.add("col-md-3");
            div1.classList.add("col-sm-3");

            div2 = document.createElement("div");
            div2.classList.add("form-group");

            input1 = document.createElement("input")
            input1.setAttribute("required", "required");
            input1.setAttribute("type", "text");
            input1.classList.add("form-control");

            if (i == 2){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "1");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "2px";
                let opt = document.createElement("option");
                opt.appendChild(document.createTextNode("Pechenie"))
                opt.value = "biscuit"
                let opt1 = document.createElement("option");
                opt1.appendChild(document.createTextNode("Xomashyo"))
                opt1.value = "product"
                input1.appendChild(opt);
                input1.appendChild(opt1);
            }

            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }
        div.appendChild(div0);
    })

    // End Creating dynamic rows for new type biscuit

    // Begin creating dynamic rows for Retsept

    $("button#addBiscuitretseptrow").click(function(){
        getproducts1();
        getBiscuit();
        let div, div0, input1;

        div = document.querySelector("#addBiscuitretseptrowId");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 3; i++){
            div1 = document.createElement("div");
            div1.classList.add("col");
            div2 = document.createElement("div");
            div2.classList.add("form-group");    

            if (i == 1){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "BiscuitName");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
            if (i == 2){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "ProductName1");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
           if (i == 3){
            input1 = document.createElement("input")
            input1.setAttribute("required", "required");
            input1.setAttribute("type", "number");
            input1.setAttribute("step", "0.001");
            input1.classList.add("form-control");
            }
            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }

        div.appendChild(div0);
       
    })

    $("button#addProductretseptrow").click(function(){
        getproducts()
        getXomashyo();
        let div, div0, input1;

        div = document.querySelector("#addProductretseptrowId");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 3; i++){
            div1 = document.createElement("div");
            div1.classList.add("col");
            div2 = document.createElement("div");
            div2.classList.add("form-group");    

            if (i == 1){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "XomashyoName");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
            if (i == 2){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "ProductName");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
           if (i == 3){
            input1 = document.createElement("input")
            input1.setAttribute("required", "required");
            input1.setAttribute("type", "number");
            input1.setAttribute("step", "0.001");
            input1.classList.add("form-control");
            }
            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }

        div.appendChild(div0);
       
    })
  
    // End creating dynamic row for Retsept

    // Begin remove rows from form

    $("button#removeBiscuitretseptrow").click(function() {
        let div = document.querySelector("#addBiscuitretseptrowId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    $("button#removeProductretseptrow").click(function() {
        let div = document.querySelector("#addProductretseptrowId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    $("button#removeNewTypeBiscuitrow").click(function() {
        let div = document.querySelector("#newTypeBiscuitAddRowid");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    $(document).on("click", "#editbutton", function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 3;
        if (biscuittable){
            for (let i = 2; i <= p; i++){
                let elem = par.children(`td:nth-child(${i})`);
                
                if (i == 2){
                    elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='BiscuitName'> </select> `)
                }else{
                    elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
                }
            }
        }else{
            for (let i = 2; i <= p; i++){
                let elem = par.children(`td:nth-child(${i})`);
                
                if (i == 2){
                    elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='XomashyoName'> </select> `)
                }else{
                    elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
                }
            }
        }
        getBiscuit();
        getXomashyo();
    })

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })


    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        let p = par.children().length - 3;
        let idd, data = {};

        for (let i = 1; i <= p; i++){
            elem = par.children().eq(i); i++;
            data.name = elem.children().children('option:selected').text();
            idd = elem.children().children('option:selected').val();
            
            elem = par.children().eq(i);
            data.price = elem.children().val(); i++;

            elem = par.children().eq(i);
            data.unit_of_measurement = elem.children().val(); i++;

            elem = par.children().eq(i);
            data.description = elem.children().val(); i++;
        }
        data = JSON.stringify(data);
        
        if (producttable){
            url = `http://206.189.145.94/api/v1/product/manufacture/list/${idd}/`
        }else{
            url = `http://206.189.145.94/api/v1/biscuit/${idd}/`; 
        }
        $.ajax({
            type: "PUT",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            url: url,
            data: data,
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    })
    
    $('#showtables').on('change', function(){
        let text = $('#showtables').val();

        if (text == 'product'){
            producttable = true;
            biscuittable = false;
        }else{
            biscuittable = true;
            producttable = false;
        }
        warehouseproducts();
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
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
                $("#counter").text(count + " ta topildi")
            }else{
                $(this).hide();
            }
        })
    }

    // End remove rows from form

    // Begin  save new type biscuit data to server

    $("form#formbiscuit").submit(function(event){
        let biscuit = "", bisc_type = "", measr = "", price, desc = "yaxshi";
        
        event.preventDefault();

        let count = event.target.length - 3;

        for (let i = 0; i < count; i++){
            biscuit = event.target[i].value; i++;
            bisc_type = event.target[i].value; i++;
            measr = event.target[i].value; i++;
            price = parseFloat(event.target[i].value);

            if (bisc_type == 'biscuit'){
                biscuittable = true;
                producttable = false;

                $('.biscuitlist').css("display", "block")
                $('.productlist').css("display", "none")

                let data = {
                    name: biscuit,
                    description: desc,
                    unit_of_measurement: measr,
                    price: price
                }
                
                $.ajax({
                    type: "POST",
                    url: 'http://206.189.145.94/api/v1/biscuit/',
                    headers: {
                        'Authorization': `token ${token}`
                    },
                    data: data,
                })
                .done(function(data){
                    location.reload();
                })
                .fail(function(){
                    alert("Internet yo'q");
                })    
        }
        if (bisc_type == 'product'){
            producttable = true;
            biscuittable = false;

            $('.biscuitlist').css("display", "none");
            $('.productlist').css("display", "block");

            let data = {
                name: biscuit,
                description: desc,
                Unit_of_measurement: measr,
                price: price
            }
            $.ajax({
                type: "POST",
                url: 'http://206.189.145.94/api/v1/product/manufacture/list/',
                headers: {
                    'Authorization': `token ${token}`
                },
                data: data,
            })
            .done(function(data){
                location.reload();
            })
            .fail(function(res) {
                alert("Internet yo'q");
            })
        }   
      }
    })

       // End save add retsept data to server

    // Begin Save retsept biscuit data to server
    
    $("form#formBiscuitRetsept").submit(function(event){
        event.preventDefault();

        let idBiscuit, idProduct, weight, retseptdata=[], aaa = {};
        let count = event.target.length - 3;

        for (let i = 0; i < count; i++){
            idBiscuit   = parseFloat(event.target[i].value); i++;
            idProduct   = parseFloat(event.target[i].value); i++;
            weight      = parseFloat(event.target[i].value);
            aaa.biscuit = idBiscuit;
            aaa.product = idProduct;
            aaa.value   = weight;
            retseptdata.push(aaa);
            aaa = {};
        }

        fetch('http://206.189.145.94/api/v1/recipe/', {
            method:'POST',
                headers:{
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
                },
                body: JSON.stringify (retseptdata),
        })
        .then(res => {
          location.reload()
        })
    })
    
    // End save retsept biscuit data to server

    // Begin save product retsept data to server

    $("form#formProductRetsept").submit(function(event){
        event.preventDefault();

        let idBiscuit, idProduct, weight, retseptdata=[], aaa = {};
        let count = event.target.length - 3;

        for (let i = 0; i < count; i++){
            idBiscuit   = parseFloat(event.target[i].value); i++;
            idProduct   = parseFloat(event.target[i].value); i++;
            weight      = parseFloat(event.target[i].value);
            aaa.manufactured_product = idBiscuit;
            aaa.product = idProduct;
            aaa.value   = weight;
            retseptdata.push(aaa);
            aaa = {};   
        }

        fetch('http://206.189.145.94/api/v1/recipe/manufactured_product/', {
            method:'POST',
            headers:{
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            },
            body: JSON.stringify (retseptdata),
        })
        .then(res => {
          location.reload()
        })
    })

    // End save product retsept data to server XomashyoName

    // Begin  get information from data for select element

    function getXomashyo(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/product/manufacture/list/",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#XomashyoName");
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
            alert("INternet yo'q");
        })
    }

    function getBiscuit(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/biscuit/",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#BiscuitName");
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
            alert("INternet yo'q");
        })
    }

    function getproducts(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/warehouse/products",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let product = document.querySelectorAll("#ProductName");
            let count = product.length - 1;                                                                                                                                                                                                                              

            data.forEach(elem=>{
                const {product:{id: code}, product:{name: ism}} = elem;
                let element = document.createElement("option");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                element.textContent = ism;
                element.setAttribute("value", code);
                product[count].appendChild(element);
            })
        })
        .fail(function(){                                                                                                                                                           
            alert("INternet yo'q");
            })  
        }      

    function getproducts1(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/warehouse/products",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let product = document.querySelectorAll("#ProductName1");
            let count = product.length - 1;                                                                                                                                                                                                                              

            data.forEach(elem=>{
                const {product:{id: code}, product:{name: ism}} = elem;
                let element = document.createElement("option");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                element.textContent = ism;
                element.setAttribute("value", code);
                product[count].appendChild(element);
            })
        })
        .fail(function(){                                                                                                                                                           
            alert("INternet yo'q");
        })
    }

    // End get information from data for select element
    
    function warehouseproducts() {
        let url = "";

        if (producttable){            
            url = 'http://206.189.145.94/api/v1/product/manufacture/list/';
        }else{
            url = 'http://206.189.145.94/api/v1/biscuit/'
        }

        $.ajax({
            type: "GET",
            url: url,
            headers: {
                'Authorization': `Token ${token}`
            },
            success: function(data){
                let output = "", size = 0;

                data.forEach(elem=>{
                    size++;
                    var {name, id,  price, unit_of_measurement, description, created_date, modified_date} = elem;
                    modified_date1 = modified_date.slice(0, 10);
                    created_date = created_date.slice(0, 10);
                    
                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td id="nameproduct" data-id=${id}>${name}</td>
                        <td>${price}</td>
                        <td>${unit_of_measurement}</td>
                        <td>${description}</td>
                        <td>${created_date}</td>
                        <td>${modified_date1}</td>
                        <td style="display: flex; flex-direction: row">
                        <p style="font-size: 20px; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                        <p style="font-size: 20px; display: none; margin-right:5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                        <p style="font-size: 20px; display: none; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
                        </td>
                    </tr>
                    `
                })
                document.getElementById('dynamictable').innerHTML=output;
            },
            failure: function(r){
                alert("Internet yo'q");
            }
        })
    }
    
})