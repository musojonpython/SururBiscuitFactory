$(document).ready(function(){

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }

    let token = Cookies.get("directorToken");
    
    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    // serchdatausingdate();
    biscuitcosts();

    $('#search2').keyup(function(){
        let count = 0;
        search_table2($(this).val(), count)
    })
    
   

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

    // makegraph()
    
   

   

  
    // searchDataUsingDates();
   

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
            getProducts('http://206.189.145.94/api/v1/biscuit/staff/produce/');
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

   
   
    biscuitcosts();

    function biscuitcosts() {
        $.ajax({
                type: "get",
                url: "http://206.189.145.94/api/v1/biscuit/default/cost/",
                headers: {
                    'Authorization': `Token ${token}`    
                },
            })
            .done(function(data){
                let output = "", size = 1;

                data.forEach(elem=>{
                    size++;

                    let {biscuit:{name}, price,  currency, modified_date, id} = elem;
                    created_date = modified_date.slice(0, 10);
                    time = modified_date.slice(11, 16);

                    output =  output + `
                    <tr>
                        <th scope="row">${size}</th>
                        <td data-id=${id} id="nameproduct">${name}</td>
                        <td>${price}</td>
                        <td>${currency}</td>
                        <td>${created_date}</td>
                        <td>${time}</td>
                    </tr>
                    `    
                })
                document.getElementById('dynamictablecost').innerHTML=output;
            })
            .fail(function(){
                alert("Internet yo'q")
            })
    }

})