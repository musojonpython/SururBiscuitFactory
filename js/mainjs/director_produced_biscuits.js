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
                     status} = elem;
                
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

    let datesFromPages = false;
    
    makingGraph();
    
    $('button#makeDynamicGraph').click(function(){
        datesFromPages = true;
        makingGraph();
    })

    function makingGraph() {
        var biscuitName = {}
        var producedBiscuit = {}
        var vitalData = []
        
        getbiscuitName('http://206.189.145.94/api/v1/biscuit/');
        
        function doAjaxCall(ajaxurl) { 
            return $.ajax({
                url: ajaxurl,
                type: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        };
        
        async function getbiscuitName(ajaxurl) {
            try {
            biscuitName = await doAjaxCall(ajaxurl)
                getproducedBiscuit('http://206.189.145.94/api/v1/biscuit/produced/filter/');
            } catch(err) {
            console.log(err);
            }
        }

        async function getproducedBiscuit(ajaxurl) {
            try {
                producedBiscuit = await doAjaxCall(ajaxurl)
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
                graphData.markerSize = 5;
                graphData.dataPoints = "dps";

                for (let j = 0; j < daysOfYearlist.length; j++){
                    let quantity = 0;
                    for (let z = 0; z < producedBiscuit.length; z++){
                        if (biscuitName[i].id == producedBiscuit[z].biscuit.id){
                            let orderDate = producedBiscuit[z].created_date;
                            if (daysOfYearlist[j] == orderDate){
                                quantity += parseFloat(producedBiscuit[z].quantity);
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
                    text: ""
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
})