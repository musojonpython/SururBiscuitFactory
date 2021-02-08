$(document).ready(function(){

    let mycookie = Cookies.get('director')
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');
    
    warehouseProduceProduct();

    function doAjaxCall(ajaxurl) { 
        return $.ajax({
        url: ajaxurl,
        type: 'GET',
        headers: {'Authorization': `Token ${token}`}
        });
    };
    let staffProducedBiscuits, staffNames;

    function warehouseProduceProduct() {
            let output = "", size = 0;
            getStaffProduced('http://206.189.145.94/api/v1/staff/biscuit/add/');
            async function getStaffProduced(ajaxurl){
                try{
                    staffProducedBiscuits = await doAjaxCall(ajaxurl);
                    otherFunc();
                } catch(err) {
                    console.log(err);
                }
            }
            function otherFunc(){
            staffProducedBiscuits.forEach(elem=>{
                
                let {biscuit_quantity, id, staff, status, created_date} = elem;
                var first_name, last_name;
                getStaffName(`http://206.189.145.94/api/v1/user/account/list/${staff}`);
                async function getStaffName(ajaxurl) {
                    try {
                    staffNames = await doAjaxCall(ajaxurl);
                    first_name = staffNames["first_name"];
                    last_name = staffNames["last_name"];
                    fillStaffData();
                    } catch(err) {
                    console.log(err);
                    }
                }
                    // console.log("🚀 ~ file: cheif_technologist_addbiscuit.js ~ line 386 ~ .done ~ last_name", last_name)
                    function fillStaffData(){
                        size++;
                        date = created_date.slice(0, 10);
                        time = created_date.slice(11, 16)
                        if (status == 'calculated'){
                            status = "Oylik berilmagan"
                        }else{
                            status = "Oylik berilgan"
                        }
                        output =  output + `
                        <tr>
                            <th scope="row" id="nameproduct" data-id=${id}>${size}</th>
                            <td>${last_name}</td>
                            <td>${first_name}</td>
                            <td>${biscuit_quantity}</td>
                            <td>${status}</td>
                            <td>${date}</td>
                            <td>${time}</td>
                        </tr>
                        `
                        document.getElementById('staffProducedData').innerHTML=output;
                    }
                console.log("🚀 ~ file: cheif_technologist_addbiscuit.js ~ line 408 ~ fillStaffData ~ output", output)
            })
        }
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
        var staffNames = {}
        var saledBiscuit = {}
        var vitalData = []
        
        getstaffNames('http://206.189.145.94/api/v1/user/filter/?role=staff');
        
        function doAjaxCall(ajaxurl) { 
            return $.ajax({
                url: ajaxurl,
                type: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        };
        
        async function getstaffNames(ajaxurl) {
            try {
            staffNames = await doAjaxCall(ajaxurl)
                getSaledBiscuit('http://206.189.145.94/api/v1/staff/biscuit/add/');
            } catch(err) {
            console.log(err);
            }
        }

        async function getSaledBiscuit(ajaxurl) {
            try {
                saledBiscuit = await doAjaxCall(ajaxurl)
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

            for (let i = 0; i < staffNames.length; i++){
                graphData.type = "spline";
                graphData.axisYType = "secondary";
                graphData.name = staffNames[i].last_name + staffNames[i].first_name;
                graphData.showInLegend = true;
                graphData.markerSize = 5;
                graphData.dataPoints = "dps";

                for (let j = 0; j < daysOfYearlist.length; j++){
                    let quantity = 0;
                    for (let z = 0; z < saledBiscuit.length; z++){
                        if (staffNames[i].id == saledBiscuit[z].staff){
                            let orderDate = (saledBiscuit[z].created_date).slice(0, 10);
                            if (daysOfYearlist[j] == orderDate){
                                quantity += parseFloat(saledBiscuit[z].biscuit_quantity);
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