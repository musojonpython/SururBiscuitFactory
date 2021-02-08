$(document).ready(function(){

    let mycookie = Cookies.get('director')
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    // warehouseproducts();
    warehouseExpense();

    function warehouseExpense() {
        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/expense/add/quantity/',
            headers: {
                'Authorization': `Token ${token}`
            },
        })
        .done(function(data){
            let output = "", size = 0;
            data.forEach(elem=>{
                size++;
                var {expense: {name}, expense: {id},  cost, currency, created_date, modified_date} = elem;
                console.log(id)
                created_date = created_date.slice(0, 10);
                modified_date = modified_date.slice(0, 10);

                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td id="nameproduct" data-id=${id}>${name}</td>
                    <td>${cost}</td>
                    <td>${currency}</td>
                    <td>${created_date}</td>
                    <td>${modified_date}</td>
                    <td style="display: flex; flex-direction: row">
                    <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                    <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                    <p style="font-size: 20px; margin-right: 10px; display:none; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Orqaga qaytarish" id="undobutton"><i class="fa fa-undo"></i></p>
                    </td>
                </tr>
                `
            })
            $("#expensesList").html(output);
        })
        .fail(function(){
            alert("Internet yo'q")
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
        var expenseList = {}
        var dataPoints = []
        
        function doAjaxCall(ajaxurl) { 
            return $.ajax({
                url: ajaxurl,
                type: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        };
        getexpenseList('http://206.189.145.94/api/v1/expense/add/quantity/');
        
        async function getexpenseList(ajaxurl) {
            try {
                expenseList = await doAjaxCall(ajaxurl)
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
                for (let j = 0; j < expenseList.length; j++){
                    let created_date = (expenseList[j].created_date).slice(0, 10)
                    if (daysOfYearlist[i] == created_date){
                        quantity += parseFloat(expenseList[j].cost)
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
                    text: "Kunlik chiqimlar grafigi"
                },
                axisY: {
                    title: "Summa(so'm)"
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