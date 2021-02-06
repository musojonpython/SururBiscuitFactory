$(document).ready(function () {

    mycookie = Cookies.get("director");

    if (mycookie == "false" || mycookie == undefined) {
        window.open('index.html', "_self");
    }
    
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    warehouseProducts();    

    $('#search').keyup(function(){
        let count = 0;
        searchTable($(this).val(), count);
    })

    function searchTable(value, count){
        $("#productTable tbody tr").each(function(){
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

    function warehouseProducts() {
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
                document.getElementById('dynamicTable').innerHTML = output;
            },
            failure: function (res) {
                alert("Internet yo'q");
            }
        });
    }

    let datesFromPages = false;
    
    makingGraph();
    
    $('button#makeDynamicGraph').click(function(){
        datesFromPages = true;
        makingGraph();
    })
    
    function makingGraph(){
        var ProductsName = []
        var products = {}
        var vitalData = []

        getProductsName('http://206.189.145.94/api/v1/product/');

        function doAjaxCall(ajaxurl) { 
            return $.ajax({
            url: ajaxurl,
            type: 'GET',
            headers: {'Authorization': `Token ${token}`}
            });
        };
    
        async function getProductsName(ajaxurl) {
            try {
            ProductsName = await doAjaxCall(ajaxurl)
            getProducts('http://206.189.145.94/api/v1/product/add/quantity/');
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

            for (let i = 0; i < ProductsName.length; i++){
                graphData.type = "spline";
                graphData.axisYType = "secondary";
                graphData.name = ProductsName[i].name;
                graphData.showInLegend = true;
                graphData.markerSize = 0;
                graphData.dataPoints = "dps";

                for (let j = 0; j < daysOfYearlist.length; j++){
                    let quantity = 0;
                    for (let z = 0; z < products.length; z++){
                        if (ProductsName[i].name == products[z].product.name){
                            let orderDate = products[z].created_date;
                            orderDate = orderDate.slice(0, 10);
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
                    text: "Kirim bo'lgan xomashyo tarixi"
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
})