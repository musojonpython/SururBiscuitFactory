
$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');

    if (mycookie == "false" || mycookie == undefined){
         window.open("index.html", "_self")   
    }
    let token = Cookies.get('cheifTechnologistToken');
    
    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )

    warehouseproducts();
    getclients();

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
    })

    function search_table(value, count){
        $("#clienttable tbody tr").each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
            })
            if(found){
                $(this).show();
                $('#counter').text(count + ' ta topildi');
            }else{
                $(this).hide();
            }
        })
    }

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $("form#saveNewTypeProductForm").submit(function(event){
        let count = event.target.length - 3;
        let name = "", measurement = "", firm_name = "", showname="";
        
        for (let i = 0; i < count; i++){
            name = event.target[i].value;
            i++;
            firm_name = event.target[i].value;
            i++;
            measurement = event.target[i].value;
            i++;
            desc = event.target[i].value;

            data = {
                name: name,
                description: desc,
                supplier: firm_name,
                unit_of_measurement: measurement
            }
            console.log(data);

            $.ajax({
                type: "POST",
                headers: {
                    'Authorization': `Token ${token}`
                },
                url: 'http://206.189.145.94/api/v1/product/',
                data: data,
            })
            .done(function(data){
                // location.reload();
            })
            .fail(function(){
                alert("Internet yo'q");
            })
            }    
})

    // remove new rows new type product
    $("button#removenewtypeproductrow").click(function(){
        let div = document.querySelector("#addnewtypeproductrow");
        let count = div.childElementCount;
        if(count > 1){
            div.removeChild(div.lastChild);
        }
    })


    // Add new rows new type product
    $("button#addnewtypeproductrow").click(function(){
        getclients();
        let div, div0, input1, div2;

        div = document.querySelector("#addnewtypeproductrow");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 4; i++){
            div1 = document.createElement("div");    
            div1.classList.add("col-md-3");
            
            div2 = document.createElement("div");
            div2.classList.add("form-group");

            if(i == 2){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "1");            
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.setAttribute("id", "clientId");
                input1.style.width = '13rem';
            }else{
                input1 = document.createElement("input")
                input1.setAttribute("type", "text");
                input1.setAttribute("required", "required");
                input1.classList.add("form-control");
            }
            if (i == 3){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "1");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.width = '13rem';
                option = document.createElement("option");
                option.appendChild(document.createTextNode("kg"))
                option.value = "kg"
                input1.appendChild(option);
                option = document.createElement("option");
                option.appendChild(document.createTextNode("gramm"))
                option.value = "gramm"
                input1.appendChild(option);
                option = document.createElement("option");
                option.appendChild(document.createTextNode("litr"))
                option.value = "litr"
                input1.appendChild(option);
            }
            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }
        div.appendChild(div0);
    })
    

    $(document).on("click", "#editbutton", function(){
        getclients();
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 2; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);

            if (i == 3){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='clientId'> </select> `)
            }else{
                elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
            }
        }
    })


    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        let p = par.children().length - 3;
        let elem, val, name, desc, firm, meas;

        elem = par.children().eq(1);
        name = elem.children().val();
        id = elem.parent().children('#nameproduct').attr("data-id")
        console.log(id);

        elem = par.children().eq(2);
        firm = elem.children().val();

        elem = par.children().eq(3);
        meas = elem.children().val();

        elem = par.children().eq(4);
        desc = elem.children().val();

            
        let data = {
            name: name,
            description: desc,
            supplier: firm,
            unit_of_measurement: meas
        }
        $.ajax({
            type: "PUT",
            headers: {
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/product/${id}/`,
            data: data,
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
       })
    
    // Draw products from data
    function warehouseproducts() {
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/product/',
            headers: {
                'Authorization': `Token ${token}`
            },
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let companyname = elem.supplier;

                if (companyname != null){
                    var {name, id,  description, unit_of_measurement, supplier:{company_name}, created_date, modified_date} = elem;
                    created_date = created_date.slice(0, 10);
                    modified_date = modified_date.slice(0, 10);

                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td id="nameproduct" data-id=${id}>${name}</td>
                        <td>${company_name}</td>
                        <td>${unit_of_measurement}</td>
                        <td>${description}</td>
                        <td>${created_date}</td>
                        <td>${modified_date}</td>
                        <td style="display: flex; flex-direction: row">
                            <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton">
                                <i class="fa fa-edit"></i>
                            </p>
                            <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton">
                                <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                            </p>
                            <p style="font-size: 20px; display:none; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton">
                                <i class="fa fa-undo"></i>
                            </p>
                        </td>
                    </tr>
                    `
                }
            })
            document.getElementById('dynamictable').innerHTML=output;
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    }
    
    function getclients(){
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/supplier/',
            headers: {
                'Authorization': `Token ${token}`
            },
        })
        .done(function(data){
            let biscuits = document.querySelectorAll("#clientId");
            let count = biscuits.length - 1;
            
            data.forEach(elem=>{
                let element = document.createElement("option");
                element.textContent = elem.company_name;
                element.setAttribute("value", elem.id);
                biscuits[count].appendChild(element);
            })
        })
        .fail(function(){
            alert("Internet yo'q")
        })
    }
})