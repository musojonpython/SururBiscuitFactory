$(document).ready(function(){

    let mycookie = Cookies.get('director')
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    // warehouseproducts();

    function warehouseproducts(){
        $.ajax({
            type: "get",
            url: 'http://206.189.145.94/api/v1/biscuit/company/sale/',
            headers: {
                'Authorization': `Token ${token}`    
            },
        })
        .done(function(data){
            let output = "", size = 0;

            data.forEach(elem=>{
                size++;
                let {
                    biscuit:{name}, quantity, created_date, id, payment_type, 
                    status, client:{company}, comment, currency, biscuit:{unit_of_measurement}} = elem;
                if (payment_type === "debt")          payment_type = "Nasiya";
                if (payment_type === "cash")          payment_type = "Naqd pul";
                if (payment_type === "credit_card")   payment_type = "Plastik yoki bank o'tkazma";
                if (status === "pending") status = "Kutish holatida";
                else status = "Maxsulot yetkazilgan";

                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td data-id=${id} id="nameproduct">${name}</td>
                    <td>${quantity}</td>
                    <td>${unit_of_measurement}</td>
                    <td>${company}</td>
                    <td>${payment_type}</td>
                    <td>${status}</td>
                    <td>${comment}</td>
                    <td>${created_date}</td>
                </tr>
                `    
            })
            document.getElementById('saledBiscuitList').innerHTML=output;
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
        var saledBiscuit = {}
        var dataPoints = []
        
        function doAjaxCall(ajaxurl) { 
            return $.ajax({
                url: ajaxurl,
                type: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        };
        getSaledBiscuit('http://206.189.145.94/api/v1/biscuit/company/sale/');
        
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


            for (let i = 0; i <= daysOfYearlist.length; i++){
                let quantity = 0;
                for (let j = 0; j < saledBiscuit.length; j++){
                    if (daysOfYearlist[i] == saledBiscuit[j].created_date){
                        quantity += parseFloat(saledBiscuit[j].quantity)
                    }
                }
                dataPoint.y = quantity;
                dataPoint.label = daysOfYearlist[i];
                dataPoints.push(dataPoint);
                dataPoint = {};
            }
        }
        
        function startDrawGraph(){
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                animationDuration: 2000,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title:{
                    text: "Kunlik maxsulot sotish grafigi"
                },
                axisY: {
                    title: "Og'irlgi(kg)"
                },
                data: [{        
                    type: "column",  
                    showInLegend: false, 
                    legendMarkerColor: "grey",
                    // legendText: "Umumiy maxsulot miqdori",
                    dataPoints: dataPoints
                }]
            });
            chart.render();
        }
    }
})