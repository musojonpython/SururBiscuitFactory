$(document).ready(function () {

    mycookie = Cookies.get("director");

    if (mycookie == "false" || mycookie == undefined) {
        window.open('index.html', "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    warehouseproducts();    

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
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
                $("#counter").text(count + " ta topildi");
            }
        })
    }


    function warehouseproducts() {
        $.ajax({
            type: 'get',
            headers: {
                'Authorization': `token ${token}`
            },
            url: 'http://206.189.145.94/api/v1/warehouse/products/',
            success: function (data) {
                let output = "", count = 0, size = 0;

                data.forEach(elem => {
                    count++;
                })

                data.forEach(elem => {
                    size++;
                    let { product: { name }, product: { unit_of_measurement },
                        product: { modified_date }, average_price, quantity, total_price,
                        product: { description } } = elem;

                    modified_date = modified_date.slice(0, 10);
                    output = output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td>${name}</td>
                    <td>${quantity}</td>
                    <td>${unit_of_measurement}</td>
                    <td>${average_price}</td>
                    <td>${total_price}</td>
                    <td>${description}</td>
                    <td>${modified_date}</td>
                </tr>
                `
                })
                document.getElementById('dynamictable').innerHTML = output;
            },
            failure: function (res) {
                alert("Internet yo'q");
            }
        });
    }

})