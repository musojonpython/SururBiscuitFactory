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
        var clientsName = [];
        var saledBiscuit = {};
        var vitalData = [];

        getClientsName('http://206.189.145.94/api/v1/client/');

        async function getClientsName(ajaxurl) {
            try {
                clientsName = await doAjaxCall(ajaxurl);
                getSaledBiscuit('http://206.189.145.94/api/v1/biscuit/company/sale/');
            } catch (err) {
                console.log(err);
            }
        }

        async function getSaledBiscuit(ajaxurl) {
            try {
                saledBiscuit = await doAjaxCall(ajaxurl);
                getDataForGraph();
                startDrawGraph();
            } catch(err) {
                console.log(err);
            }
        }

        function doAjaxCall(ajaxurl) {
            return $.ajax({
                url: ajaxurl,
                type: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        };

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

        for (let i = 0; i < clientsName.length; i++){
            graphData.type = "spline";
            graphData.axisYType = "secondary";
            graphData.name = clientsName[i].name;
            graphData.showInLegend = true;
            graphData.markerSize = 0;
            graphData.dataPoints = "dps";

            for (let j = 0; j < daysOfYearlist.length; j++){
                let quantity = 0;
                for (let z = 0; z < saledBiscuit.length; z++){
                    if (clientsName[i].id == saledBiscuit[z].biscuit.id){
                        let orderDate = saledBiscuit[z].created_date;
                        if (daysOfYearlist[j] == orderDate){
                            quantity += parseFloat(saledBiscuit[z].quantity);
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
                text: "Xaridorlarning sotib olish analiytikasi"
            },
            axisX: {
                valueFormatString: "MMM YYYY DD"
            },
            axisY2: {
                title: "Og'irligi",
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
        chart.render();

        function toogleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
        }
    }
    
    // function makingGraph(){
    //     var biscuitName = []
    //     var products = {}
    //     var vitalData = []

    //     getBiscuitName('http://206.189.145.94/api/v1/biscuit/');

    //     function doAjaxCall(ajaxurl) { 
    //         return $.ajax({
    //         url: ajaxurl,
    //         type: 'GET',
    //         headers: {'Authorization': `Token ${token}`}
    //         });
    //     };
    
    //     async function getBiscuitName(ajaxurl) {
    //         try {
    //         biscuitName = await doAjaxCall(ajaxurl)
    //         getProducts('http://206.189.145.94/api/v1/biscuit/staff/produce/');
    //         } catch(err) {
    //         console.log(err);
    //         }
    //     }

    //     async function getProducts(ajaxurl) {
    //         try {
    //             products = await doAjaxCall(ajaxurl)
    //             getDataForGraph();
    //             startDrawGraph();
    //         } catch(err) {
    //             console.log(err);
    //         }
    //     }
        
    //     function getDataForGraph(){
    //         let graphData = {}
    //         let dataPoints = []
    //         let dataPoint = {}
    //         let today = new Date();
    //         let startDate = new Date();

    //         if (datesFromPages) {
    //             startDate = $('#startDate').val();
    //             today = $('#finishDate').val();
    //             today = new Date(today);
    //         } else {
    //             startDate = startDate.setDate(startDate.getDate() - 30);
    //             today = today.setDate(today.getDate() + 1);
    //         }
    //         console.log("🚀 ~ file: director_warehouse_products.js ~ line 136 ~ getDataForGraph ~ today", today)
    //         console.log("🚀 ~ file: director_warehouse_products.js ~ line 135 ~ getDataForGraph ~ startDate", startDate)
            
            
    //         let daysOfYearlist = [];
            
    //         for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    //             let p = d;
    //             p = p.toISOString().slice(0, 10);
    //             daysOfYearlist.push(p);
    //         }
    //         console.log("🚀 ~ file: director_warehouse_products.js ~ line 140 ~ getDataForGraph ~ daysOfYearlist", daysOfYearlist)

    //         for (let i = 0; i < biscuitName.length; i++){
    //             graphData.type = "spline";
    //             graphData.axisYType = "secondary";
    //             graphData.name = biscuitName[i].name;
    //             graphData.showInLegend = true;
    //             graphData.markerSize = 0;
    //             graphData.dataPoints = "dps";

    //             for (let j = 0; j < daysOfYearlist.length; j++){
    //                 let quantity = 0;
    //                 for (let z = 0; z < products.length; z++){
    //                     if (biscuitName[i].name == products[z].biscuit.name){
    //                         let orderDate = products[z].created_date;
    //                         if (daysOfYearlist[j] == orderDate){
    //                             quantity += parseFloat(products[z].quantity);
    //                         }
    //                     }
    //                 }
    //                 dataPoint.x = new Date (daysOfYearlist[j])
    //                 dataPoint.y = parseFloat(quantity)
    //                 dataPoints.push(dataPoint);
    //                 dataPoint = {};
    //             }
    //             graphData.dataPoints = dataPoints;
    //             vitalData.push(graphData);
    //             dataPoints = [];
    //             graphData = {};
    //         }
    //     }
        
    //     function startDrawGraph(){

    //         var chart = new CanvasJS.Chart("chartContainer", {
    //             title: {
    //                 text: "Kirim bo'lgan maxsulotlar tarixi"
    //             },
    //             axisX: {
    //                 valueFormatString: "MMM YYYY DD"
    //             },
    //             axisY2: {
    //                 title: "Og'irligi",
    //                 // prefix: "$",
    //                 suffix: "Kg"
    //             },
    //             toolTip: {
    //                 shared: true
    //             },
    //             legend: {
    //                 cursor: "pointer",
    //                 verticalAlign: "top",
    //                 horizontalAlign: "center",
    //                 dockInsidePlotArea: true,
    //                 itemclick: toogleDataSeries
    //             },
    //             data: vitalData 
                
    //         });
    //             console.log("🚀 ~ file: director_warehouse_products.js ~ line 209 ~ startDrawGraph ~ vitalData", vitalData)
    //         chart.render();

    //         function toogleDataSeries(e){
    //             if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    //                 e.dataSeries.visible = false;
    //             } else{
    //                 e.dataSeries.visible = true;
    //             }
    //             chart.render();
    //         }
    //     }
    // }
})