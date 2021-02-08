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