$(document).ready(function(){

    let mycookie = Cookies.get('director');
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
    })

    warehouseClients();
    
    function warehouseClients(){
        $.ajax({
            type: "get",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            url: 'http://206.189.145.94/api/v1/client/',
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let {company, first_name, last_name, address, x_p, m_f_o, 
                    inn, phone_number, created_date, id} = elem;

                created_date = created_date.slice(0, 10);
                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-id=${id} id="namecompany">${company}</td>
                    <td>${first_name}</td>
                    <td>${last_name}</td>
                    <td>${phone_number}</td>
                    <td>${address}</td>
                    <td>${x_p}</td>
                    <td>${m_f_o}</td>
                    <td>${inn}</td>
                    <td>${created_date}</td>
                </tr>
                `
            })
            document.getElementById('dynamicClientsData').innerHTML=output;
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
                $('#counter').html(count + ' ta topildi');
            }else{
                $(this).hide();
                $("#counter").text(count + " ta topildi");
            }
        })
    }

})