$(document).ready(function(){

    let mycookie = Cookies.get("manager");
    
    if(mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    
    let token = Cookies.get("managerToken");
    
    $('#helpersubmenu').load('helperManager.html div#helpersubmenu');
    $('#helperinfocheif').load('helperManager.html div#helperinfocheif');
    
    warehouseProducts();

    $('#search').keyup(function(){
        let count = 0;
        searchTable($(this).val(), count)
    })

    function searchTable(value, count){
        $('#client_table tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                    console.log(count);
                }
            })
            if(found){
                $("#counter").text(count + " ta topildi")
                $(this).show();
                console.log("show worked");
            }else{
                // count = 0;
                console.log("hide worked");
                $("#counter").text(count + " ta topildi")
                $(this).hide();
            }
        })
    }
    
    function warehouseProducts(){
        $.ajax({
            type: "get",
            url: 'http://206.189.145.94/api/v1/warehouse/biscuits/',
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let {biscuit:{name}, quantity, created_date, id, biscuit:{description}, unit_of_measurement} = elem;
                
                quantity = parseFloat(quantity.slice(0, -3));
                created_date1 = created_date.slice(0, 10);
                time = created_date.slice(11, 16)

                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-id=${id} id="nameproduct">${name}</td>
                    <td>${quantity}</td>
                    <td>${unit_of_measurement}</td>
                    <td>${description}</td>
                    <td>${created_date1}</td>
                    <td>${time}</td>
                </tr>
                `    
            })
            document.getElementById('dynamictable').innerHTML=output;
        })
        .fail(function(){
            alert("Internet yo'q");
        })
    }
})



