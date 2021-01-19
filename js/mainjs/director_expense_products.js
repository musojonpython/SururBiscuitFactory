
$(document).ready(function(){

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    makegraph();
    warehouseproducts();

    function makegraph(){
            
        var data = {
            labels: ["2020-11-01"
            , "2020-11-02"
            , "2020-11-03"
            , "2020-11-04"
            , "2020-11-05"
            , "2020-11-06"
            , "2020-11-07"
            , "2020-11-08"
            , "2020-11-09"
            , "2020-11-10"
            , "2020-11-11"
            , "2020-11-12"
            , "2020-11-13"
            , "2020-11-14"
        ],
            datasets: [
                {
                label: 'Un(kg)',
                fill: false,
                borderColor: "rgba(31, 58, 147, 1)",
                // borderDash: [10, 10],
                backgroundColor: "rgba(65, 131, 215, 1)",
                pointBackgroundColor: "red",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#green",
                pointHoverBorderColor: "#55bae7",
                data: [50, 15, 15, 87, 78, 45, 12, 2024, 0, 0, 76, 8]
                },
                {
                label: "yo'g(litr)",
                fill: false,
                borderColor: "#bae755",
                // borderDash: [10, 10],
                backgroundColor: "rgba(25, 181, 254, 1)",
                pointBackgroundColor: "#55bae7",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#55bae7",
                pointHoverBorderColor: "#55bae7",
                data: [10, 65, 155, 187, 748, 945, 570, 670]
                },
                {
                label: 'Qaymoq(kg)',
                fill: false,
                borderColor: "rgba(44, 62, 80, 1)",
                // borderDash: [10, 10],
                backgroundColor: "rgba(44, 62, 80, 1)",
                pointBackgroundColor: "rgba(44, 62, 80, 1)",
                pointBorderColor: "rgba(44, 62, 80, 1)",
                pointHoverBackgroundColor: "#rgba(44, 62, 80, 1)",
                pointHoverBorderColor: "rgba(44, 62, 80, 1)",
                data: [104, 165, 155, 187, 0, 545, 270, 370, 41, 0, 0, 0]
                },
                {
                label: 'Qiyom(kg)',
                fill: false,
                borderColor: "#bae755",
                // borderDash: [10, 10],
                backgroundColor: "rgba(25, 181, 142, 1)",
                pointBackgroundColor: "#11bae7",
                pointBorderColor: "#11bae7",
                pointHoverBackgroundColor: "#11bae7",
                pointHoverBorderColor: "#11bae7",
                data: [110, 65, 155, 87, 78, 94, 50, 70]
                }
            ]
        }
        console.log(data.labels);

        var cv = document.getElementById("canvas").getContext("2d");
        var lineChart = new Chart(cv,{
        type: 'line',
        data: data,
        options: {
            animation: {
            duration: 2500 // general animation time
                },
            responsive: true,
            title:{
                display:true,
                // text:'Kirim maxsulotlari'
            },
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
                        labelString: 'Hora'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Valor'
                    }
                }]
            }
        }
    })
    }

    function warehouseproducts() {
        let date1 = ("2020-11-03"), date2 = ("2020-11-13");
        fetch(`http://206.189.145.94/api/v1/warehouse/income/?date_one=${date1}&date_two=${date2}&is_enter=False`)
        .then(res=>res.json())
        .then((data)=>{
            console.log(data);
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            let count = data.length;
            let productlistid = [];
            let productlistname = [];
            let datelist = [];
            let quantitylist = [];
            let measurementlist = [];
            let pricelist = [];
            let totalpricelist = [];


            for (let i = 0; i < count; i++){
                // datelist.push(data[i].date);
                
                productlistid.push(data[i].product["id"]);
            }

            // datelist = datelist.filter(onlyUnique);
            productlistid = productlistid.filter(onlyUnique);
            // productlistname = productlistname.filter(onlyUnique);

            let productcount = productlistid.length;
            
            

            for (let i = 0; i < productcount; i++){
                let summa = 0, mesure, name, price, totalprice = 0, date;
                for (let k = 0; k < count; k++){
                    if (data[k].product["id"] == productlistid[i]){
                        summa += parseFloat(data[k].quantity);
                        mesure = data[k].product["unit_of_measurement"];
                        name = data[k].product["name"];
                        price = data[k].product["price"];
                        totalprice += data[k].price;
                        date = data[k].product["date"];
                    }
                }
                productlistname.push(name);
                measurementlist.push(mesure);
                pricelist.push(price);
                totalpricelist.push(totalprice);
                quantitylist.push(summa); 
                datelist.push(date)
            }
            let size = 0, output = "";
            for (let i = 0; i < productcount; i++){
                size++;
                // let {product:{name},  product:{unit_of_measurement}, product:{date}, product:{price}, quantity, total_price} = elem;
                let date = datelist[i]; 
                date = date.slice(0, 10);
                output =  output + `
                <tr>
                    <th scope="row">${size}</th>
                    <td>${productlistname[i]}</td>
                    <td>${quantitylist[i]}</td>
                    <td>${measurementlist[i]}</td>
                    <td>${pricelist[i]}</td>
                    <td>${totalpricelist[i]}</td>
                    <td>${date}</td>
                </tr>`
            }
            document.getElementById('dynamictable').innerHTML=output;
        });
    }

    document.querySelector('.demo-container').style.height = "auto";
})