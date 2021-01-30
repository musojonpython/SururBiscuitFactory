$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');

    if (mycookie === "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    let token = Cookies.get('cheifTechnologistToken');

    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu');
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif');

    warehouseProduceProduct();
    getBiscuit();
    getStaff();
    

    $("form#addbiscuitform").submit(function(event){
        event.preventDefault();

        let count = event.target.length - 3;
        let biscuitid, quantity, staff;

        for (let i = 0; i < count; i++){
            biscuitid = parseFloat(event.target[i].value); i++;
            staff = (event.target[i].value); i++;
            quantity = parseFloat(event.target[i].value);

            let data = {
                quantity: quantity,
                staff: staff,
                biscuit: biscuitid
            }

            data = JSON.stringify(data);
            
            $.ajax({
                type: 'post',
                url: `http://206.189.145.94/api/v1/biscuit/staff/produce/`,
                data: data,
                headers: {
                    'Accept':'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'Authorization': `token ${token}`
                }
            })
            .done(function(json){
                // location.reload();
            })
           .fail(function(xhr, status, errorThrown){
               console.log(xhr);
               console.log(status);
               console.log(errorThrown);
               infojson = xhr.responseText
               infojson = infojson[0];
               
               if (errorThrown == 'Bad Request'){
                    alert(infojson)
               }else{
                    alert("Internet yo'q");
               }
           })
        }
    })

    // Begin creating dynamic rows for Retsept

    $("button#addretseptrow").click(function(){
        getStaff();
        getBiscuit();

        let div, div0, input1, div1, div2;

        div = document.querySelector("#addretseptrowId");
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
                input1.setAttribute("id", "staffname");
                input1.classList.add("form-control");
                input1.classList.add("select2_single");
                input1.style.marginLeft = "20px";
                input1.style.width = "300px";
            }
            if (i == 3){
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
    
    // End creating dynamic row for Retsept

    // Begin remove rows from form
  
    $("button#removeretseptrow").click(function(){
        let div = document.querySelector("#addretseptrowId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })
    
    $(document).on("click", "#editbutton", function(){
        
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 2; i < p; i++){
            let elem = par.children(`td:nth-child(${i})`);

            elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
            
            if(i == 2){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='BiscuitName'> </select> `)
            }
            if (i == 4){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='staffname'> </select> `)
            }
            
        }
        getBiscuit();
        getStaff();
    })
    
    $(document).on("click", "#saveupdatebutton", function(){
        let par = $(this).parent().parent();
        let elem, biscuitid, staff, quantity;
        
        elem = par.children().eq(0);
        id = elem.attr("data-id")

        elem = par.children().eq(1);
        biscuitid = elem.children().val();
        
        elem = par.children().eq(2);
        quantity = elem.children().val();
        
        elem = par.children().eq(3);
        staff = elem.children().val();
        

        let data = {
            quantity: quantity,
            staff: staff,
            biscuit: biscuitid
        }
        data = JSON.stringify(data);
        $.ajax({
            type: 'put',
            url: `http://206.189.145.94/api/v1/biscuit/staff/produce/${id}/`,
            data: data,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            }
        })
        .done(function(json){
            location.reload();
        })
       .fail(function(xhr, status, errorThrown){
           infojson = xhr.responseJSON
           infojson = infojson[0];
           
           if (errorThrown == 'Bad Request'){
                alert(infojson)
           }else{
                alert("Internet yo'q");
           }
       })
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
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

    // End remove rows from form

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
        .fail(function(res) {
            alert("Internet yo'q");
        })            
    }

    function getStaff(){
        
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/user/filter/?role=staff",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let staff = document.querySelectorAll("#staffname");
            count = staff.length - 1;
            console.log(data)
            data.forEach(elem=>{
                    fio = ""
                    element = document.createElement("option");
                    fio = elem.first_name + " " + elem.last_name;
                    element.textContent = fio;
                    element.setAttribute("value", elem.user);
                    staff[count].appendChild(element);
                })
            })
        .fail(function(){
            alert("Internet yo'q");
        })
    }    

    function warehouseProduceProduct() {
        console.log("worked")
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/biscuit/staff/produce/',
            headers: {
                'Authorization': `Token ${token}`
            },
        })
        .done(function(data){
            console.log(data);
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let checkStaff = elem.staff;
                if (checkStaff != null){
                    let {biscuit:{name}, id,  quantity, staff:{last_name}, 
                        staff:{first_name}, status, modified_date} = elem;

                    modified_date1 = modified_date.slice(0, 10);
                    modified_time = modified_date.slice(11, 16)
                    if (status == 'unpaid'){
                        status = "Oylik berilmagan"
                    }else{
                        status = "Oylik berilgan"
                    }
                    output =  output + `
                    <tr>
                        <th scope="row" id="nameproduct" data-id=${id}>${size}</th>
                        <td>${name}</td>
                        <td>${quantity}</td>
                        <td>${first_name} ${last_name}</td>
                        <td>${status}</td>
                        <td>${modified_date1}</td>
                        <td>${modified_time}</td>
                        <td style="display: flex; flex-direction: row">
                            <p style="font-size: 20px; margin-right: 5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton">
                                <i class="fa fa-edit"></i>
                            </p>
                            <p style="font-size: 20px; display: none; margin-right:5px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton">
                                <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                            </p>
                            <p style="font-size: 20px; margin-right: 5px; cursor:pointer; display:none" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton">
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

    // End get information from data for select element

})