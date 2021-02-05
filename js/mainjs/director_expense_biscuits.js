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
    biscuitcosts();

    let graphdata = {};

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

    // makegraph()
    
    testGraph();

    function  testGraph(){
    //     const chart = document.getElementById("myChart");
    //     console.log("🚀 ~ file: director_expense_biscuits.js ~ line 73 ~ testGraph ~ chart", chart)
    //     let lineChart = new Chart(Chart, {
    //         type: 'line',
    //         data:{
    //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //             datasets: [{
    //                 label: 'My First dataset',
    //                 backgroundColor: 'rgb(255, 99, 132)',
    //                 borderColor: 'rgb(255, 99, 132)',
    //                 data: [0, 10, 5, 2, 20, 30, 45]
    //             }
    //         ]
    //     }
    // })
        
        // let labels1 = ['YES', 'YES BUT IN GREEN', 'YES BUT IN GREEN'];
        // let data1 = [20, 31, 20];
        // let color1 = ['#49A9EA', '#36CAAB', '#36CAAB'];

        // let myChart1 = document.getElementById("myChart").getContext('2d');
        // let chart1 = new Chart(myChart1, {
        //     type: 'line', // doughnut
        //     data: {
        //         labels: labels1,
        //         datasets: [{
        //             data: data1,
        //             backgroundColor: color1
        //         }]
        //     },
        //     options: {
        //         title: "Do you like dddd",
        //         display: true
        //     }
        // })
    }

    function makegraph(){
        var ctx = document.getElementById('myChart');
        var ctx = document.getElementById('myChart').getContext('2d');
        var ctx = $('#myChart');
        var ctx = 'myChart';
        // var ctx = document.getElementById('myChart');
        searchDataUsingDates();

        var myChart = new Chart(ctx,{
            type: 'line',
            data: graphdata,
            options: {
                animation: {
                duration: 2500 
                    },
                responsive: true,        
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
                            labelString: "Sanasi"
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Og'irligi"
                        }
                    }]
                }
            } 
        })
    }
    // searchDataUsingDates();
    $('button#searchDates').click(function(){
        makegraph();
    });

    function searchDataUsingDates() {
        date1 = $('#date1from').val()
        date2 = $('#date2to').val()

        let now = new Date(date2);

        let daysOfYearlist = [];

        for (let d = new Date(date1); d <= now; d.setDate(d.getDate() + 1)) {
            let p = d;
            p = p.toISOString().slice(0, 10);
            daysOfYearlist.push(p);
        }
        let url = `http://206.189.145.94/api/v1/biscuit/saled/filter/?date_one=${date1}&date_two=${date2}`
        // console.log(url);

        $.ajax({
            type:"get",
            url: url,
            headers: {'Authorization': `Token ${token}`}
        })
        .done(function(data){
            console.log(data)
            // data = JSON.parse(data);
            // console.log(data);
            data = JSON.stringify(data);
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            function getRandomColor() {
                let letters = '0123456789abcdef';
                let color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            let count = data.length;
            let productlistid = [];
            let productlistname = [];
            let datelist = [];


            for (let i = 0; i < count; i++) {
                datelist.push(data[i].date);
                productlistname.push(data[i].biscuit["name"]);
                productlistid.push(data[i].biscuit["id"]);

            }

            datelist = datelist.filter(onlyUnique);
            productlistid = productlistid.filter(onlyUnique);
            productlistname = productlistname.filter(onlyUnique);

            let productcount = productlistid.length;

            graphdata["labels"] = daysOfYearlist;
            let datasets = [];
            let datas = [];
            let tests = {};

            for (let i = 0; i < productcount; i++) {
                tests.label = (productlistname[i]).toString();
                tests.fill = false;
                tests.borderColor = getRandomColor();
                tests.pointBackgroundColor = getRandomColor();

                for (let j = 0; j < daysOfYearlist.length; j++) {
                    let summa = 0;
                    for (let k = 0; k < count; k++) {
                        if (data[k].biscuit["id"] == productlistid[i]) {
                            if (daysOfYearlist[j] == data[k].created_date) {
                                summa += parseFloat(data[k].quantity);
                            }
                        }
                    }
                    datas.push(summa);
                }
                tests.data = datas;
                datasets.unshift(tests);
                tests = {};
                datas = [];
            }

            graphdata["datasets"] = datasets;
            // console.log("🚀 ~ file: director_expense_biscuits.js ~ line 224 ~ .done ~ graphdata", graphdata)
            
           
        })
    }

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
    
    $("button#hidetable").click(function(){
        $("#hidetable").css("display", "none");
        biscuitcosts();
        $("#tannarxiTable").css("display", "none");
    })

    $("button#showtable").click(function(){
        $("button#hidetable").css("display", "block");
        $("#tannarxiTable").css("display", "block");
        biscuitcosts();
        
    })

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