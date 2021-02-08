$(document).ready(function(){

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }

    let token = Cookies.get("directorToken");
    
    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    biscuitcosts();
    makingGraph();

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
            
            let daysOfYearlist = [];
            
            for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
                let p = d;
                p = p.toISOString().slice(0, 10);
                daysOfYearlist.push(p);
            }

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
                animationDuration: 2000,
                animationEnabled: true,
                title: {
                    text: "Kirim bo'lgan xomashyo tarixi"
                },
                axisX: {
                    lineColor: "black",
		            labelFontColor: "black",
                    valueFormatString: "MMM YYYY DD"
                },
                axisY2: {
                    gridThickness: 0,
                    titleFontColor: "black",
                    labelFontColor: "black",
                    title: "Og'irligi",
                    suffix: "Kg"
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemmouseover: function(e) {
                        e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness * 2;
                        e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
                        e.chart.render();
                    },
                    itemmouseout: function(e) {
                        e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness / 2;
                        e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
                        e.chart.render();
                    },
                    itemclick: function (e) {
                        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                            e.dataSeries.visible = false;
                        } else {
                            e.dataSeries.visible = true;
                        }
                        e.chart.render();
                    }
                },
                data: vitalData  
            });
            chart.render();
        }
    }

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
                document.getElementById('biscuitCostList').innerHTML=output;
            })
            .fail(function(){
                alert("Internet yo'q")
            })
    }

})