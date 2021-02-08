$(document).ready(function(){

    let mycookie = Cookies.get("manager");
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    let token = Cookies.get('managerToken');
  
    $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
    $('#helperinfocheif').load('helperManager.html div#helperinfocheif');

    getBiscuit();
    warehouseOrders();

    $(document).on("click", "#undoButton", function(){
        location.reload();
    })

    $("button#removeOrderForm").click(function(){
        let div = document.querySelector("#addOrdersId");
        let count = div.childElementCount;
        if (count > 1){
            div.removeChild(div.lastChild);
        }
    })

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
    
    $(document).on("click", "#editButton", function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        for (let i = 2; i <= p; i++){
            let elem = par.children(`td:nth-child(${i})`);
            elem.html(
                    `<input style='width:100%'  type='text' value='${elem.text()}' required/>`
                );

            if (i == 2) {
                elem.html(
                    `<select tabindex="1" style="width: 100%;" id="BiscuitName"></select>`
                )
            }
            if (i == 3){
                elem.html(
                    `<select tabindex="1" style="width: 100%;">
                        <option value="pending">Buyurtma berildi</option>
                        <option value="completed">Tugatilgan</option>
                    </select>`
                )
            }
        }
        getBiscuit();
    })

    $(document).on("click", "#saveUpdateButton", function(){
        let data = {}, name;
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        elem = par.children().eq(1);
        biscuitId = parseInt(elem.parent().children('#nameProduct').attr("data-biscuitId"));
        orderId = parseInt(elem.parent().children('#nameProduct').attr("data-orderId"));

        elem = par.children().eq(2);
        status = elem.children().val();

        elem = par.children().eq(3);
        weight = elem.children().val();

        elem = par.children().eq(4);
        comment = elem.children().val();

        data.biscuit = biscuitId
        data.quantity = weight;
        data.status = status;
        data.comment = comment;
        data = JSON.stringify(data);
        console.log(data, orderId);

        $.ajax({
            type: 'put',
            headers: {
                'Authorization': `Token ${token}`
            },
            data: data,
            url: `http://206.189.145.94/api/v1/order/client/orders/${orderId}/`,
            
        })
        .done(function(data){
            // location.reload();
        })
        .fail(function(xhr, status, errorThrown){
            console.log(xhr)
            infojson = xhr.responseText
            
            if (errorThrown == 'Bad Request' || status == 'Bad Request'){
                 alert(infojson)
            }else{
                 alert("Internet yo'q");
            }
        })
    })

    $("button#addOrderForm").click(function(){
        getBiscuit();
        let div, div0, input1, div1, div2;

        div = document.querySelector("#addOrdersId");
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
                input1.style.width = "200px";
            }
            if (i == 2){
                input1 = document.createElement("input");
                input1.setAttribute("required", "required");
                input1.setAttribute("type", "number");
                input1.classList.add("form-control");
                input1.style.marginLeft = "20px";
            }
            if (i == 3) {
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

    $("form#addOrdersForm").submit(function(event){
        event.preventDefault();

        let idBiscuit, weight;
        let count = event.target.length - 4;

        for (let i = 0; i < count; i++){
            let data = {};
            idBiscuit = parseFloat(event.target[i].value); i++;
            weight = parseFloat(event.target[i].value); i++;
            desc = event.target[i].value;

            data.biscuit = idBiscuit;
            data.quantity = weight;
            data.comment = desc;
            data = JSON.stringify(data)

            console.log(data);
            $.ajax({
                type: "post",
                url: 'http://206.189.145.94/api/v1/order/client/orders/',
                data: data,
                headers:{
                    'Authorization': `token ${token}`
                },
            })
            .done(function(data){
                // location.reload();
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
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
    })

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

    function search_table(value, count){
        $('#ordersTable tbody tr').each(function(){
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
                $("#counter").text(count + " ta topildi");
            }
        })
    }

    function warehouseOrders() {
        $.ajax({
            type: "get",
            url: "http://206.189.145.94/api/v1/order/client/orders/",
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;

                let {biscuit:{name}, quantity,  comment, created_date, biscuit:{id}, status} = elem;
                let orderId = elem.id;

                date = created_date.slice(0, 10);
                time = created_date.slice(12, 16);
                if (status === 'pending') {
                    status = 'Buyurtma berilgan';
                }
                if (status === 'completed') {
                    status = "Buyurtma tugallanib bo'lgan";
                }
                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-biscuitId=${id} data-orderId=${orderId} id="nameProduct">${name}</td>
                    <td>${status}</td>
                    <td>${quantity}</td>
                    <td>${comment}</td>
                    <td>${date}</td>
                    <td>${time}</td>
                    <td style="display: flex; flex-direction: row">
                        <p style="font-size: 20px; margin-right: 10px; cursor:pointer" 
                            data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editButton">
                            <i class="fa fa-edit"></i>
                        </p>
                        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" 
                            data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveUpdateButton">
                            <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                        </p>
                        <p style="font-size: 20px; display:none; margin-right: 10px; cursor:pointer" 
                            data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undoButton">
                            <i class="fa fa-undo"></i>
                        </p>
                    </td>
                </tr>
                `    
            })
                document.getElementById('ordersList').innerHTML=output;
        })
        .fail(function(xhr, errorThrown, status){
                info = xhr.responseText;
                if (status == 'Bad Request' || errorThrown == 'Bad Request'){
                    alert(info)
                }else{
                    alert("Internet yo'q");
                }
        })    
    }
})