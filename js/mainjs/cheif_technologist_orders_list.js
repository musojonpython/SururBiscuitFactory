$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }
    let token = Cookies.get('cheifTechnologistToken');
  
    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )
    
    warehouseOrders();

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })
    
    $(document).on("click", "#editbutton", function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");
        let par = $(this).parent().parent();

        let elem = par.children(`td:nth-child(${3})`);
        elem.html(
            `<select class="select2_single form-control" tabindex="1" style="width: 100%;">
                <option value="pending">Zakaz berildi</option>
                <option value="completed">Tugatilgan</option>
            </select>`
        )

    })

    $(document).on("click", "#saveupdatebutton", function(){
        let data = {}, name;
        let par = $(this).parent().parent();
        let p = par.children().length - 3;

        elem = par.children().eq(1);
        biscuitId = parseInt(elem.parent().children('#nameProduct').attr("data-biscuitId"));
        orderId = parseInt(elem.parent().children('#nameProduct').attr("data-orderId"));

        elem = par.children().eq(2);
        status = elem.children().val();

        elem = par.children().eq(3);
        console.log(elem.text());
        weight = parseFloat(elem.text());

        elem = par.children().eq(4);
        comment = elem.text();

        data.biscuit = biscuitId
        data.quantity = weight;
        data.status = status;
        data.comment = comment;
        data = JSON.stringify(data);
        console.log(data, orderId, weight);

        $.ajax({
            type: "PUT",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            url: `http://206.189.145.94/api/v1/order/client/orders/${orderId}/`,
            data: data,
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(xhr, status, errorThrown){
            console.log(xhr, status, errorThrown)
            infojson = xhr.responseText
            
            if (errorThrown == 'Bad Request'){
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

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
    })

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
            console.log(data);

            data.forEach(elem=>{
                size++;

                let {biscuit:{name}, quantity,  comment, created_date, biscuit:{id}, status} = elem;
                let orderId = elem.id;

                date = created_date.slice(0, 10);
                console.log(data) 
                time = created_date.slice(11, 16);
                if (status === 'pending') {
                    status = 'Zakaz berilgan';
                }
                if (status === 'completed') {
                    status = "Zakaz tugallanib bo'lgan";
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
                document.getElementById('ordersList').innerHTML=output;
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