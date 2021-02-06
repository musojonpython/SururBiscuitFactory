$(document).ready(function(){

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }

    let token = Cookies.get("directorToken");
    
    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    warehouseproducts();
    // serchdatausingdate();
    // biscuitcosts();

    

     $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
    })

    $('#search2').keyup(function(){
        let count = 0;
        search_table2($(this).val(), count)
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
            if (found){
                $(this).show();
                $('#counter').html(count + ' ta topildi');
            }else{
                $(this).hide();
                $('#counter').html(count + ' ta topildi');
            }
        })
    }

    function search_table2(value, count){
        $('#client_table2 tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
            })
            if (found){
                $(this).show();
                $('#counter2').html(count + ' ta topildi');
            }else{
                $(this).hide();
                $('#counter2').html(count + ' ta topildi');
            }
        })
    }

    let datesFromPages = false;
    makingGraph();
    
    $('button#makeDynamicGraph').click(function(){
        datesFromPages = true;
        makingGraph();
    })
    
    function makingGraph(){
        
        var biscuitName = []
        var products = {}
        var vitalData = []

        getBiscuitName('http://206.189.145.94/api/v1/biscuit/');

        function doAjaxCall(ajaxurl) { 
            return $.ajax({
            url: ajaxurl,
            type: 'GET',
            headers: {'Authorization': `Token ${token}`}
            });
        };
    
        async function getBiscuitName(ajaxurl) {
            try {
            biscuitName = await doAjaxCall(ajaxurl)
            getProducts('http://206.189.145.94/api/v1/biscuit/saled/filter');
            } catch(err) {
            console.log(err);
            }
        }

        async function getProducts(ajaxurl) {
            try {
                products = await doAjaxCall(ajaxurl)
                getDataForGraph();
                startDrawGraph();
            } catch(err) {
                console.log(err);
            }
        }
        
        function getDataForGraph(){
            let graphData = {}
            let dataPoints = []
            let dataPoint = {}
            let today = new Date();
            let startDate = new Date();

            if (datesFromPages) {
                startDate = $('#startDate').val();
                today = $('#finishDate').val();
                today = new Date(today);
            } else {
                startDate = startDate.setDate(startDate.getDate() - 30);
                today = today.setDate(today.getDate() + 1);
            }
            console.log("🚀 ~ file: director_warehouse_products.js ~ line 136 ~ getDataForGraph ~ today", today)
            console.log("🚀 ~ file: director_warehouse_products.js ~ line 135 ~ getDataForGraph ~ startDate", startDate)
            
            
            let daysOfYearlist = [];
            
            for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
                let p = d;
                p = p.toISOString().slice(0, 10);
                daysOfYearlist.push(p);
            }
            console.log("🚀 ~ file: director_warehouse_products.js ~ line 140 ~ getDataForGraph ~ daysOfYearlist", daysOfYearlist)

            for (let i = 0; i < biscuitName.length; i++){
                graphData.type = "spline";
                graphData.axisYType = "secondary";
                graphData.name = biscuitName[i].name;
                graphData.showInLegend = true;
                graphData.markerSize = 0;
                graphData.dataPoints = "dps";

                for (let j = 0; j < daysOfYearlist.length; j++){
                    let quantity = 0;
                    for (let z = 0; z < products.length; z++){
                        if (biscuitName[i].name == products[z].biscuit.name){
                            let orderDate = products[z].created_date;
                            if (daysOfYearlist[j] == orderDate){
                                quantity += parseFloat(products[z].quantity);
                            }
                        }
                    }
                    dataPoint.x = new Date (daysOfYearlist[j])
                    dataPoint.y = parseFloat(quantity)
                    dataPoints.push(dataPoint);
                    dataPoint = {};
                }
                graphData.dataPoints = dataPoints;
                vitalData.push(graphData);
                dataPoints = [];
                graphData = {};
            }
        }
        
        function startDrawGraph(){

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Kirim bo'lgan maxsulotlar tarixi"
                },
                axisX: {
                    valueFormatString: "MMM YYYY DD"
                },
                axisY2: {
                    title: "Og'irligi",
                    // prefix: "$",
                    suffix: "Kg"
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true,
                    itemclick: toogleDataSeries
                },
                data: vitalData 
                
            });
                console.log("🚀 ~ file: director_warehouse_products.js ~ line 209 ~ startDrawGraph ~ vitalData", vitalData)
            chart.render();

            function toogleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else{
                    e.dataSeries.visible = true;
                }
                chart.render();
            }
        }
    }

  
    // searchDataUsingDates();
    // $('button#searchDates').click(function(){
    //     makegraph();
    // });

     function warehouseproducts() {
        let size = 1
        $.ajax({
            type: "get",
            url: "http://206.189.145.94/api/v1/biscuit/saled/filter",
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done (function(vitaldata){
                let output = "";
                vitaldata.forEach(elem=>{
                    size = 1;
                    let sale_price1, default_price1, total_price1;
                    
                    let {biscuit:{id}, biscuit:{name}, quantity, 
                            client:{company}, payment_type, modified_date, 
                            currency, biscuit:{unit_of_measurement}, comment, objid} = elem;
                    
                    if (payment_type == 'credit_card'){
                        payment_type = "Plastik va bank o'tkazma"
                    }
                    if(payment_type == 'debt'){
                        payment_type = 'Nasiya';
                    }
                    if(payment_type == 'cash'){
                        payment_type = "Naqd pul"
                    }

                    time = modified_date.slice(11, 16);
                    modified_date = modified_date.slice(0, 10);
                    
                    $.ajax({
                        type: "get",
                        url: `http://206.189.145.94/api/v1/biscuit/sale/price/${id}/`,
                        headers: {
                            'Authorization': `Token ${token}`    
                        },
                    })
                    .done(function(data){
                        let {sale_price,  default_price} = data;
                        sale_price1 = sale_price;
                        default_price1 = default_price

                        sale_price = parseFloat(sale_price.slice(0, -3))
                        quantity = parseFloat(quantity.slice(0, -3))
                        
                        total_price1 = sale_price * quantity;   
                        output =  output + `
                        <tr>
                            <th data-id=${objid} id="namecompany" scope="row">${size}</th>
                            <td>${name}</td>
                            <td>${quantity}</td>
                            <td>${unit_of_measurement}</td>
                            <td>${sale_price1}</td>
                            <td>${currency}</td>
                            <td>${payment_type}</td>
                            <td>${total_price1}</td>
                            <td>${company}</td>
                            <td>${comment}</td>
                            <td>${modified_date}</td>
                            <td>${time}</td>
                        </tr>
                        `                                 
                        document.getElementById('dynamictable').innerHTML=output;
                        size++;
                    })
                    .fail(function(){
                            alert("Internet yo'q");
                        })                        
                })
            })
            .fail(function(){
                alert("Internet yo'q");
            })   
    }
   
})