"use strict";
(function () {
    $(function () {

        $(document).on("click", "#homeLink", function () {

            $("#reportLink").removeClass("active-tab");
            $("#aboutLink").removeClass("active-tab");
            $("#coin-container").css("display", "block");
            $("#about-container").hide();
            $("#homeLink").addClass("active-tab");
            if (graphExistFlag) {
                clearInterval(interval);
                $("#chartContainer").CanvasJSChart().destroy();
                $("#chartContainer").empty();

                graphExistFlag = false;
            }

        });

        $(document).on("click", "#searchBtn",async function () {
            try {
                let coinName = $("#coinSearch").val();
                $("#coinSearch").val("");
                if (coinName === "" || !isNaN(coinName)) {
                    alert("please insert valid coin name");
                    return;
                }
                let coinD = await getCoin(coinName.toLowerCase());
                let arr = [coinD];
                showCoins(arr);
            } catch (err) {
                alert(err.responseJSON.error);
                console.log(err);
            }
        });

        function getCoin(coin) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "get",
                    url: `https://api.coingecko.com/api/v3/coins/${coin}`,
                    success: function (coinInfo) {
                        resolve(coinInfo)
                    },
                    error: err => reject(err)
                });
            })

        }
    })
    //get more Info on the coin
    window.getCoinInfo = function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "get",
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                success: function (coinsInfo) {
                    resolve(coinsInfo)
                },
                error: err => reject(err)
            });
        })
    }

})()