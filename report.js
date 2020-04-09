"use strict";
(function () {
    $(function () {

        window.graphExistFlag = false;
        $(document).on("click", "#reportLink", function () {

            if (!$("#reportLink").hasClass("active-tab")) { //prevent graph rendering on each other
                graph();
            }
            if (selectedCoins.length !== 0) { //if there is selected coins, report link becomes active
                $("#reportLink").addClass("active-tab"); // button with active css 
            }
            $("#homeLink").removeClass("active-tab");
            $("#aboutLink").removeClass("active-tab");
        });

        function getCoinRate() {
            let coinsToSearch = '';
            let coinToShowOnGraph = selectedCoins; // the selected coins Id array
            for (let coindId of coinToShowOnGraph) {
                coinsToSearch += coindId + ",";
            }
            coinsToSearch = coinsToSearch.substring(0, coinsToSearch.length - 1);


            function arr_diff(a1, a2) { //get the not found coins that were selected to show on the graph

                var a = [],
                    diff = [];

                for (var i = 0; i < a1.length; i++) {
                    a[a1[i]] = true;
                }

                for (var i = 0; i < a2.length; i++) {
                    if (a[a2[i]]) {
                        delete a[a2[i]];
                    } else {
                        a[a2[i]] = true;
                    }
                }

                for (var k in a) {
                    diff.push(k);
                }
                let coinsWithNoInfoForGraph = '';
                for (let coin of diff) {
                    coinsWithNoInfoForGraph += coin + ",";
                }

                return coinsWithNoInfoForGraph;
            }


            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "get",
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsToSearch}&tsyms=USD`,
                    success: function (response) {
                        //validations for missed response 
                        if (response.Type == 2) {
                            if (coinToShowOnGraph.length > 1) {
                                $("#reportLink").removeClass("active-tab");
                                graphExistFlag = false;
                                reject(`the coins: ${coinsToSearch} aren't found and couldn't be shown on the graph!`);
                            } else {
                                $("#reportLink").removeClass("active-tab");
                                graphExistFlag = false;
                                reject(`the coin: ${coinsToSearch} wasn't found and couldn't be shown on the graph!`);
                            }
                        }
                        if (Object.keys(response).length === 0) {
                            if (coinToShowOnGraph.length > 1) {
                                $("#reportLink").removeClass("active-tab");
                                graphExistFlag = false;
                                reject(`the coins: ${coinsToSearch} aren't found and couldn't be shown on the graph!`);
                                return;

                            } else {
                                $("#reportLink").removeClass("active-tab");
                                graphExistFlag = false;
                                reject(`the coin: ${coinsToSearch} wasn't found and couldn't be shown on the graph!`);
                            }
                        }
                        //get the coins names that doesn't have graph info  
                        let receivedCoins = Object.keys(response).map(coin => coin.toLowerCase());
                        let coinsWithNoInfoToShowOnGraph = arr_diff(selectedCoins, receivedCoins);
                        coinsWithNoInfoToShowOnGraph = coinsWithNoInfoToShowOnGraph.substring(0, coinsWithNoInfoToShowOnGraph.length - 1);
                        if (receivedCoins.length < 5) {
                            if (coinsWithNoInfoToShowOnGraph == "") {
                                resolve(response);
                            } else {
                                if (flagForMessage) {
                                    flagForMessage = !flagForMessage;
                                    alert(`the coin/s: ${coinsWithNoInfoToShowOnGraph} wasn't found and cannot be seen on the graph!`);
                                    return;
                                }
                            }
                        }
                        resolve(response);
                    },
                    error: err => reject("ERROR: 404")
                });
            })

        }


        window.graph = function () {
            window.flagForMessage = true;
            if (selectedCoins.length === 0) {
                alert("please select a coin to show on the graph");
                return;
            }

            let dataPoints1 = [],
                dataPoints2 = [],
                dataPoints3 = [],
                dataPoints4 = [],
                dataPoints5 = [],
                dataPointsArr = [dataPoints1, dataPoints2, dataPoints3, dataPoints4, dataPoints5],
                options = {
                    title: {
                        text: ""
                    },
                    axisX: {
                        title: "chart updates every 2 secs"
                    },
                    axisY: {
                        prefix: "$",
                        includeZero: false,
                    },
                    toolTip: {
                        shared: false
                    },
                    legend: {
                        cursor: "pointer",
                        verticalAlign: "top",
                        fontSize: 22,
                        fontColor: "dimGrey",
                        itemclick: toggleDataSeries
                    },
                    data: [{

                            type: "line",
                            xValueType: "dateTime",
                            yValueFormatString: "###.wh",
                            xValueFormatString: "hh:mm:ss TT",
                            showInLegend: true,
                            name: "Turbine 1",
                            dataPoints: dataPoints1,

                        },
                        {
                            type: "line",
                            xValueType: "dateTime",
                            yValueFormatString: "###.wh",
                            showInLegend: true,
                            name: "Turbine 2",
                            dataPoints: dataPoints2
                        }, {
                            type: "line",
                            xValueType: "dateTime",
                            yValueFormatString: "###.wh",
                            showInLegend: true,
                            name: "Turbine 2",
                            dataPoints: dataPoints3
                        }, {
                            type: "line",
                            xValueType: "dateTime",
                            yValueFormatString: "###.wh",
                            showInLegend: true,
                            name: "Turbine 2",
                            dataPoints: dataPoints4
                        },
                        {
                            type: "line",
                            xValueType: "dateTime",
                            yValueFormatString: "###.wh",
                            showInLegend: true,
                            name: "Turbine 2",
                            dataPoints: dataPoints5
                        }
                    ]
                };



            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }




            function updateChart(count) {
                count = count || 1;
                for (let i = 0; i < count; i++) {
                    let time = new Date();
                    time.setTime(time.getTime() + 1000)
                    // pushing the new value
                    renderGraph(time);
                }
            }

            async function renderGraph(time) {
                try {

                    const info = await getCoinRate();
                    let chart = $("#chartContainer").CanvasJSChart(options);
                    
                    const coinsAsArray = Object.entries(info);
                    let title = '';
                    for (let i = 0; i < coinsAsArray.length; i++) {
                        dataPointsArr[i].push({
                            toolTipContent: `${"$" + coinsAsArray[i][1].USD  + "<br>"+ time.toLocaleTimeString()+ "<br>" +time.toLocaleDateString()}`,
                            x: time.getTime(),
                            y: coinsAsArray[i][1].USD,
                        })
                        options.data[i].legendText = coinsAsArray[i][0] + ": " + "$" + coinsAsArray[i][1].USD; //updating upper text
                        title += coinsAsArray[i][0] + ",";
                    }
                    title = title.substring(0, title.length - 1)
                    graphExistFlag = true;
                    $("#coin-container").css("display", "none"); //hide cards
                    $("#about-container").hide();
                    options.title.text = title + " to USD";
                    $("#chartContainer").CanvasJSChart().render();
                    
                    
                } catch (err) {
                    if ($("#chartContainer").CanvasJSChart()) {// if the chart exists
                        $("#chartContainer").CanvasJSChart().destroy();
                        clearInterval(interval);
                        setTimeout(() => {
                            alert(err)
                        }, 100)
                    }else{
                        clearInterval(interval);
                        setTimeout(() => {
                            alert(err)
                        }, 100)
                    }
   
                }

            }
            window.interval = setInterval(function () {
                updateChart()
            }, 2000)

        }


    })
}())