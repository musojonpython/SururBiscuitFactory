$(document).ready(function(){

    let mycookie = Cookies.get('director')
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    // makegraph();
    warehouseproducts();

    function makegraph(){
            
        var data = {
            labels: ["2020-11-01"
            , "2020-11-02"
            , "2020-11-03"
            , "2020-11-04"
            , "2020-11-05"
            , "2020-11-06"
            , "2020-11-07"
            , "2020-11-08"
            , "2020-11-09"
            , "2020-11-10"
            , "2020-11-11"
            , "2020-11-12"
            , "2020-11-13"
            , "2020-11-14"
        ],
            datasets: [
                {
                label: 'Pechoniy1(kg)',
                fill: false,
                borderColor: "rgba(31, 58, 147, 1)",
                // borderDash: [10, 10],
                backgroundColor: "rgba(65, 131, 215, 1)",
                pointBackgroundColor: "red",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#green",
                pointHoverBorderColor: "#55bae7",
                data: [50, 15, 15, 87, 78, 45, 12, 2024, 0, 0, 76, 8]
                },
                {
                label: "Pechoniy2(kg)",
                fill: false,
                borderColor: "#bae755",
                // borderDash: [10, 10],
                backgroundColor: "rgba(25, 181, 254, 1)",
                pointBackgroundColor: "#55bae7",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#55bae7",
                pointHoverBorderColor: "#55bae7",
                data: [10, 65, 155, 187, 748, 945, 570, 670]
                },
                {
                label: 'Pechoniy3(kg)',
                fill: false,
                borderColor: "rgba(44, 62, 80, 1)",
                // borderDash: [10, 10],
                backgroundColor: "rgba(44, 62, 80, 1)",
                pointBackgroundColor: "rgba(44, 62, 80, 1)",
                pointBorderColor: "rgba(44, 62, 80, 1)",
                pointHoverBackgroundColor: "#rgba(44, 62, 80, 1)",
                pointHoverBorderColor: "rgba(44, 62, 80, 1)",
                data: [104, 165, 155, 187, 0, 545, 270, 370, 41, 0, 0, 0]
                },
                {
                label: 'Pechoniy3(kg)',
                fill: false,
                borderColor: "#bae755",
                // borderDash: [10, 10],
                backgroundColor: "rgba(25, 181, 142, 1)",
                pointBackgroundColor: "#11bae7",
                pointBorderColor: "#11bae7",
                pointHoverBackgroundColor: "#11bae7",
                pointHoverBorderColor: "#11bae7",
                data: [110, 65, 155, 87, 78, 94, 50, 70]
                }
            ]
        }
        console.log(data.labels);

        var cv = document.getElementById("canvas").getContext("2d");
        var lineChart = new Chart(cv,{
        type: 'line',
        data: data,
        options: {
            animation: {
            duration: 2500 // general animation time
                },
            responsive: true,
            title:{
                display:true,
                // text:'Kirim maxsulotlari'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Hora'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Valor'
                    }
                }]
            }
        }
    })
    }

    function warehouseproducts(){
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
                let {
                    biscuit:{name}, quantity, created_date, id, biscuit:{description}, 
                    biscuit:{price}, total_price, average_price, unit_of_measurement, currency} = elem;
                
                quantity = parseFloat(quantity.slice(0, -3));
                price = parseFloat(price.slice(0, -3));
                total_price = parseFloat(total_price.slice(0, -3));
                average_price = parseFloat(average_price.slice(0, -3));
                created_date1 = created_date.slice(0, 10);
                time = created_date.slice(11, 16)

                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-id=${id} id="nameproduct">${name}</td>
                    <td>${quantity}</td>
                    <td>${unit_of_measurement}</td>
                    <td>${price}</td>
                    <td>${total_price}</td>
                    <td>${average_price}</td>
                    <td>${currency}</td>
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
                $("#counter").text(count + " ta topildi")
                $(this).show();
            }else{
                $(this).hide();
            }
        })
    }
})