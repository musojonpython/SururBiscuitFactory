$(document).ready(function(){
    
    let mycookie = Cookies.get('cheifTechnologist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    let token = Cookies.get('cheifTechnologistToken');

    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )

    getBiscuit();
    warehouseproducts();

    // Begin creating dynamic rows for Retsept

    $("button#addretseptrow").click(function(){
        getBiscuit();
        let div, div0, input1, div1, div2;

        div = document.querySelector("#addretseptrowId");
        div0 = document.createElement("div");
        div0.classList.add('row');

        for (let i = 1; i <= 4; i++){
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
                input1.style.width = "200px";
            }
            if (i == 2){
                input1 = document.createElement("select")
                input1.setAttribute("tabindex", "0");
                input1.setAttribute("id", "ProductName");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                let opt = document.createElement("option");
                opt.appendChild(document.createTextNode("Brak"))
                opt.value = "recyclable";
                let opt1 = document.createElement("option");
                opt1.appendChild(document.createTextNode("Drabilka"))
                opt1.value = "unrecyclable";
                input1.style.marginLeft = "20px";
                input1.style.width = "200px";
                input1.appendChild(opt);
                input1.appendChild(opt1);
            }
            if (i == 3){
                input1 = document.createElement("input");
                input1.setAttribute("required", "required");
                input1.setAttribute("type", "number");
                input1.classList.add("form-control");
                input1.style.marginLeft = "20px";
            }
            if (i == 4) {
                input1 = document.createElement("textarea");
                input1.style.width = "200px";
                input1.classList.add("form-control");
                input1.style.marginLeft = "20px";
                input1.setAttribute("rows", "1");
            }
            div2.appendChild(input1);
            div1.appendChild(div2);
            div0.appendChild(div1);
        }

        div.appendChild(div0);
    })
    
    // End creating dynamic row for Retsept

    // Begin remove rows from form

    $("button#removeretseptrow").click(function(){
        let div = document.querySelector("#addretseptrowId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    // End remove rows from form

    // Begin Save retsept biscuit data to server

    $("form#addrecyclableform").submit(function(event){
        event.preventDefault();

        let idBiscuit, weight, status;
        let count = event.target.length - 4;

        for (let i = 0; i < count; i++){
            let data = {};
            idBiscuit = parseFloat(event.target[i].value); i++;
            status = event.target[i].value; i++;
            weight = parseFloat(event.target[i].value); i++;
            desc = event.target[i].value;

            data.biscuit = idBiscuit
            data.quantity = weight;
            data.description = desc;
            data.status = status
            data = JSON.stringify(data)

            $.ajax({
                type: "post",
                url: 'http://206.189.145.94/api/v1/biscuit/add/unfit/',
                data: data,
                headers:{
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
                },
            })
            .done(function(data){
                location.reload();
            })
            .fail(function(){
                alert("Internet yo'q")
            })
        }
    })
    // End save retsept biscuit data to server

    // Begin  get information from data for select element

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

    $(document).on("click", "#selectoptions", function(){
        warehouseproducts()
    })

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $(document).on("click", "#editbutton", function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 3; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);
            if (i == 3){
                elem.html(`<select class="select2_single form-control" tabindex="1" style="width: 100%;">
                <option value="unrecyclable">Brak</option>
                <option value="recyclable">Drabilka</option>
                </select>`)
            }else{
                elem.html(`<input style='width:100%' class="form-control" type='text' value='${elem.text()}' required/>`)
            }
        }
    })

    $(document).on("click", "#saveupdatebutton", function(){
        let data = {}, name;
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        elem = par.children().eq(1);
        name = elem.children().val();

        idBiscuit = parseInt(elem.parent().children('#nameproduct').attr("data-id"));
        elem = par.children().eq(2);
        status = elem.children().val();

        elem = par.children().eq(3);
        weight = parseInt(elem.children().val());

        data.biscuit = idBiscuit
        data.quantity = weight;
        data.status = status;
        data.description='yaxshi';
        data = JSON.stringify(data);
        
        $.ajax({
            type: "PUT",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/biscuit/add/unfit/${idBiscuit}/`,
            data: data,
        })
        .done(function(data){
            // location.reload();
        })
        .fail(function(xhr, status, errorThrown){
            infojson = xhr.responseText
            
            if (errorThrown == 'Bad Request'){
                 alert(infojson)
            }else{
                 alert("Internet yo'q");
            }
        })
    })
    
    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
    })

    function search_table(value, count){
        $('#clientTable tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
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
        let option = "";
        let turi = "";

        option = $("#selectoptions").val();

        if (option == "recyclable"){
            turi = "Drabilka"
            $.ajax({
                type: "get",
                url: "http://206.189.145.94/api/v1/warehouse/unfit/recyclable/biscuit/",
                headers: {
                    'Authorization': `Token ${token}`    
                },
            })
            .done(function(data){
                let output = "", size = 0;
                data.forEach(elem=>{
                    size++;
                    let {biscuit:{name}, quantity,  total_price, created, id} = elem;
                    created_date = created.slice(0, 10);

                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td data-id=${id} id="nameproduct">${name}</td>
                        <td>${turi}</td>
                        <td>${quantity}</td>
                        <td>${total_price}</td>
                        <td>${created_date}</td>
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
            })
            document.getElementById('dynamictable').innerHTML=output;
        })
        .fail(function(){
            alert("Internet yo'q");
        })
        }else{
            turi = "Brak";
            $.ajax({
                type: "get",
                url: "http://206.189.145.94/api/v1/warehouse/unfit/unrecyclable/biscuit/",
                headers: {
                    'Authorization': `Token ${token}`    
                },
            })
            .done(function(data){
                let output = "", size = 1;

                data.forEach(elem=>{
                    size++;

                    let {biscuit:{name}, quantity,  total_price, created, id} = elem;
                    created_date = created.slice(0, 10);

                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td data-id=${id} id="nameproduct">${name}</td>
                        <td>${turi}</td>
                        <td>${quantity}</td>
                        <td>${total_price}</td>
                        <td>${created_date}</td>
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
                })
                    document.getElementById('dynamictable').innerHTML=output;
            })
            .fail(function(){
                alert("Internet yo'q");
            })
        }
    }
    
    // End get information from data for select element
})