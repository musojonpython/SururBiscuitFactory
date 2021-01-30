$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }

    let token = Cookies.get('cheifTechnologistToken');
    
    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )    
    
    warehouseretsept();
    getmanufacturedProduct();
    warehouseproducts()

    let globalcountProduct = 1;
    let globalcountTableid = 1;
    let productId = [];
    
    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
    })

    $("form#addproductform").submit(function(event){
        event.preventDefault();

        let count = event.target.length - 3;
        let productid, quantity, pri = parseInt(1);

        for (let i = 0; i < count; i++){
            productid = parseFloat(event.target[i].value); i++;
            quantity = parseFloat(event.target[i].value);

            let data = {
                product: productid,
                quantity: quantity,
                price: pri
            }
            
            $.ajax({
                type: 'post',
                url: 'http://206.189.145.94/api/v1/product/manufacture/add/quantity/',
                headers: {
                    'Authorization': `token ${token}`
                },
                data: data,
            })
            .done(function(data){
                location.reload();
            })
            .fail(function(){
                alert("Internet yo'q")
            })
        }
    })

    $("button#addproductrow").click(function(){
        getmanufacturedProduct();

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
                input1.setAttribute("id", "manufacturedProduct");
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

    $(document).on("click", "#undobuttonproduct", function(){
        location.reload();
    })
    
    $(document).on("click", "#editbuttonproduct", function(){
        
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 3; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);

            elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
        }
    })
    
    $(document).on("click", "#saveupdatebuttonproduct", function(){
        let par = $(this).parent().parent();
        let p = par.children().length - 3;
        let price = parseInt(1);
        let elem, val, name, desc, firm, meas;

        elem = par.children().eq(1);
        name = elem.children().val();
        productid = elem.parent().children('#nameproduct').attr("data-id")

        elem = par.children().eq(2);
        quantity = elem.children().val();

        elem = par.children().eq(3);
        meas = elem.children().val();

        elem = par.children().eq(4);
        desc = elem.children().val();

            
        let data = {
            product: productid,
            quantity: quantity,
            price: price
        }
        $.ajax({
            type: "PUT",
            headers: {
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/product/manufacture/add/quantity/${productid}/`,
            data: data,
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    })

    $(document).on("click", "#addrowtable", function(){
        getXomashyo();

        let string = `<tr> <th scope="row">${globalcountProduct}</th> `;
        globalcountProduct++;
        
        string += ` <td> <select id = "XomashyoName" style='width:100%' class="select2_single" tabindex="0"></select> </td> `
        let qq;

        for (let i = 2; i <= globalcountTableid + 1; i++){
            qq = productId[i - 2];
            string += ` <td data-productId="${qq}" id='attrproductId'> <input style='width:100%' value="0" type="number" step="0.001" /></td> `
        }

        string += ` <td style="display:flex; flex-direction:row"> 
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qo'shish"     id="addrowtable"><i class="fa fa-plus-circle"></i></p>
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
        <p style="font-size: 20px; display: block; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="savebutton"><button type="button" class="btn btn-outline-success btn-sm">Saqlash</button></p>
        <p style="font-size: 20px; display: block; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
            </td> 
        `
        string += ' </tr>'
        $("#tblData tbody").append(string);

    })

    $(document).on("click", "#saveupdatebutton", function(){
        let arr = [];

        let par = $(this).parent().parent();
        let p = par.children().length - 1;
        const biscuitid = parseFloat(par.children("#attrbiscuitId").attr("data-biscuitId"));

        for (let i = 2; i < p; i++){
            let elem = par.children().eq(i);
            let val = parseFloat(elem.children().val())
            const productid = parseFloat(elem.attr("data-productid"));
            let dict = {
                "product": productid,
                "value": val,
                "manufactured_product": biscuitid
            }
            arr.push(dict);
            dict = {}
        }

        $.ajax({
            type: "put",
            url: `http://206.189.145.94/api/v1/recipe/manufactured_product/update_or_detail/?product_id=${biscuitid}`,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            },
            data: JSON.stringify(arr),
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    })

    $('tbody').on("click", "#savebutton", function(){
        let arr = []
        let par = $(this).parent().parent()
        let p = par.children().length - 1;
        
        const biscuitid = parseFloat(par.children().eq(1).children().val());

        for (let i = 2; i < p; i++){
            const elem = par.children().eq(i);
            const val = parseFloat(elem.children().val())

            let productid = parseFloat(par.children().eq(i).attr('data-productid'))

            let dict = {
                "product": productid,
                "value": val,
                "manufactured_product": biscuitid
            }
            arr.push(dict);
            dict={}
        }

        $.ajax({
            type: "POST",
            url: `http://206.189.145.94/api/v1/recipe/manufactured_product/`,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            },
            data: JSON.stringify(arr),
        })
        .done(function(data){
            location.reload();
        },
        fail(function(){
            alert("Internet yo'q");
        })        
    )
    })

    $('tbody').on("click", '#editbutton', function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(2).css("display", "block");

        let par = $(this).parent().parent(); 
        let p = par.children().length - 1;

        for (let i = 3; i <= p; i++){
            elem = par.children(`td:nth-child(${i})`);
            elem.html(`<input  style='width:100%' type='number' step='0.001' value='${elem.text()}' required/>`);
        }
    })

    function warehouseretsept(){
        let table = $("#retseptListHead");

        let thead = `<tr>
                        <th style="position: sticky; top:5px; font-size: 15px;" scope="col">#</th>
                        <th style="position: sticky; top:5px; font-size: 15px;" scope="col">Nomi</th> `

        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/warehouse/products/',
            headers: {
                'Authorization': `token ${token}`
                 }
            })
            .done(function(data){
                globalcountTableid = data.length;
                
                data.forEach(elem=>{
                    
                    let {product:{name}, product: {id}} = elem;
                    productId.push(id);

                    thead += ` <th style="position: sticky; top:5px; font-size: 15px;" scope="col" data-id="${id}">${name}</th> `
                })

                thead += ` 
                <th style="position: sticky; top:5px; font-size: 15px;" scope="col">Jarayon</th> </tr>`

                table.html(thead);
            })
            .fail(function(res){
                alert("Internet yo'q")
            })

        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/warehouse/manufacture/products/",
            headers: {
                'Authorization': `token ${token}`
            },
        }).done(function(biscuitdata){
            let count = biscuitdata.length;

                for (let j = 0; j < count; j++){
                    let biscuitid = parseInt(biscuitdata[j]["manufactured_product"].id)
                    
                    $.ajax({
                        type:"get",
                        url: `http://206.189.145.94/api/v1/recipe/manufactured_product/update_or_detail/?product_id=${biscuitid}`,
                        headers: {
                            'Authorization': `token ${token}`
                        },
                    })
                    .done(function(retseptdata){
                        let lengretsept = retseptdata.length, name;

                        if (lengretsept !== 0){
                            name = (retseptdata[0].manufactured_product["name"]);

                            tbody = `<tr>
                            <th scope="row">${globalcountProduct}</th>
                            <td style="font-size: 14px;" data-biscuitId="${biscuitid}" id='attrbiscuitId'>${name}</td> `

                            for (let i = 0; i < productId.length; i++){
                                let d = productId[i];
                                let find = false;

                                for (let k = 0; k < lengretsept; k++){

                                    if (retseptdata[k].product != null){
                                        if (retseptdata[k].product["id"] == d){
                                            tbody += `<td style="font-size: 14px;" data-productid="${d}" id='attrproductId'>${retseptdata[k].value}</td> `
                                            find = true;
                                            break;
                                        }
                                    }
                                }
                                if(find == false){
                                    tbody += `<td style="font-size: 14px;"  data-productid="${d}" id='attrproductId'>0</td> `
                                }
                            }
                            tbody += ` 
                            <td style="display:flex; flex-direction:row"> 
                                <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qo'shish"     id="addrowtable"><i class="fa fa-plus-circle"></i></p>
                                <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                                <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                                <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="savebutton"><button type="button" class="btn btn-outline-success btn-sm">Saqlash</button></p>
                                <p style="font-size: 20px; display: none; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
                            </td> 
                            `
                            tbody += ' </tr';
                            $("#retseptListBody").append(tbody);
                            globalcountProduct++;
                        }
                    }).fail(function(){
                        alert("Internet yo'q");
                    })
                }
            })
            .fail(function(){
                alert("Internet yo'q");
            })
    }
    
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
                let element = document.createElement("option");
                element.textContent = elem.name;
                element.setAttribute("value", elem.id);
                biscuits[count].append(element);
            })
        })
        .fail(function(){
            alert("INternet yo'q");
        }
        )
    }
    
    function getmanufacturedProduct(){
        $.ajax({
            type: "get",
            url: "http://206.189.145.94/api/v1/product/manufacture/list/",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let manufacturedproduct = document.querySelectorAll("#manufacturedProduct");
            let count = manufacturedproduct.length - 1;

            data.forEach(elem=>{
                let element = document.createElement("option");
                element.textContent = elem.name;
                element.setAttribute("value", elem.id);
                manufacturedproduct[count].appendChild(element);
            })
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    }


    function search_table(value, count){
        $('#tblData tbody tr').each(function(){
            let found = false;

            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                }
            })
            if (found){
                $(this).show();
                $('#counter').text(count + " ta topildi");
            }else{
                $(this).hide();
            }
        })
    }

    function warehouseproducts() {
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/warehouse/manufacture/products/',
            headers: {
                'Authorization': `Token ${token}`
               }
            })
            .done(function(data){
                let output = "", size = 0;

                data.forEach(elem=>{
                    size++;
                    var {manufactured_product:{name}, manufactured_product:{id},  
                    quantity, manufactured_product:{description}, manufactured_product:{created_date}, 
                    unit_of_measurement} = elem;
                    
                    modified_date1 = created_date.slice(0, 10);
                    modified_time = created_date.slice(11, 16)

                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td id="nameproduct" data-id=${id}>${name}</td>
                        <td>${quantity}</td>
                        <td>${unit_of_measurement}</td>
                        <td>${description}</td>
                        <td>${modified_date1}</td>
                        <td>${modified_time}</td>
                    </tr>
                    `
                })
                document.getElementById('manufacturedProductTable').innerHTML=output;
            })
            .fail(function(xhr, status, errorThrown){
                alert("Internet yo'q")
            })
        }
})
// Manufactured Product edit tabel
{/* <td style="display: flex; flex-direction: row">
<p style="font-size: 20px; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbuttonproduct">
    <i class="fa fa-edit"></i>
</p>
<p style="font-size: 20px; display: none; margin-right:5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebuttonproduct">
    <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
</p>
<p style="font-size: 20px; margin-right: 5px; cursor:pointer; display:none" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobuttonproduct">
    <i class="fa fa-undo"></i>
</p>
</td> */}