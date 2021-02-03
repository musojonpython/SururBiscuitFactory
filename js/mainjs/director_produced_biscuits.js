$(document).ready(function(){

    let mycookie = Cookies.get('director')
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    warehouseproducts();

    function warehouseproducts(){
        $.ajax({
            type: "get",
            url: 'http://206.189.145.94/api/v1/biscuit/produced/filter/',
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let {
                    biscuit:{name}, quantity, biscuit:{unit_of_measurement}, created_date, id, biscuit:{description}, 
                     status, currency} = elem;
                
                quantity = parseFloat(quantity.slice(0, -3));
                created_date1 = created_date.slice(0, 10);
                time = created_date.slice(11, 16)
                if (status == 'unpaid'){
                    status = "Oylik to'lanmagan";
                }else{
                    status = "Oylik to'langan";
                }
                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-id=${id} id="nameproduct">${name}</td>
                    <td>${quantity}</td>
                    <td>${unit_of_measurement}</td>
                    <td>${status}</td>
                    <td>${description}</td>
                    <td>${created_date1}</td>
                </tr>
                `    
            })
            document.getElementById('producedProducts').innerHTML=output;
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
            })
            if(found){
                $("#counter").text(count + " ta topildi");
                $(this).show();
            }else{
                $(this).hide();
                $("#counter").text(count + " ta topildi");
            }
        })
    }
})