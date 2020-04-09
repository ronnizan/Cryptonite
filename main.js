"use strict";
// global variables
let oneHundredCoins = [],
    selectedCoins = [],
    index = 0,
    cancelModalArr = [],
    lastCoinChosen;
(function () {
    $(document).ready(function () {
        sessionStorage.clear(); //clean session storage on window refresh
        printCoinsOnPageLoad();
        toggleAddCoin();
        showCoinInfo();
        switchModalCoin();
        saveModal();
        closeModal();
    });
    

    function getCoins() {
        let randomNum = Math.floor(Math.random() * 5000)
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "get",
                url: "https://api.coingecko.com/api/v3/coins/list",
                success: function (allcoins) {
                    for (let i = 0; oneHundredCoins.length < 102; i++) {
                        oneHundredCoins.push(allcoins[randomNum])
                        randomNum = Math.floor(Math.random() * 6925)
                    }
                    resolve(oneHundredCoins)
                },
                error: err => reject(err)
            });
        })
    }

    async function printCoinsOnPageLoad() {
        try {
            let coins = await getCoins();
            showCoins(coins);
        } catch (error) {
            alert(error.statusText);
        }
    }

    window.showCoins = function (coins) {
        try {
            let html = '';
            for (let coin of coins) {
                let coinCard = `
                <div class="col-12 col-sm-6 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${coin.symbol}</h5>
                            <div class="custom-control custom-switch toggle-switch">
                                <input type="checkbox" class="custom-control-input input-coins-graph" id=${coin.symbol}>
                                <label class="custom-control-label" for=${coin.symbol}></label>
                            </div>
                            <p class="card-text">${coin.name}
                            </p>
                            <button id=${coin.id+"A"+index} class="btn btn-primary info-btn" data-toggle="collapse" data-target="#moreInfo-${coin.id+"A"+index}">More Info
                            </button>
                            <div class="progress">
                                <div id="prog+${index}" class="progress-bar progress-bar-striped progress-bar-animated" style="width:0%">
                                </div>
                            </div>
                            <div id="moreInfo-${coin.id+"A"+index}" class="collapse">
                                
                            </div>
                        </div>
                    </div>
                </div>`;
                html += coinCard;
                index = index + 1;
            }
            coins.length === 1 ? $(".searched-coins-container").prepend(html) : $(".random-coins-container").html(html);
            // if its searched coin print in searched coins container
        } catch (err) {
            console.log(err);
        }
    }

    function showCoinInfo() { //more info button
        $(document).on("click", ".info-btn", async function () {
            try {
                let coinId = this.id;
                let coinIdSplit = coinId.split("A"); //used to split between the index and the Id
                let coinIdToSearch = coinIdSplit[0];
                let moreInfoDiv = "#moreInfo-" + coinId; //used for a selector for the more info div;
                let moreInfoOnCoin = await getCoinInfo(coinIdToSearch);
                let coinInfo = {}; //objet to contain data on the coin

                if (!sessionStorage.getItem(coinId)) {
                    coinInfo = {
                        usd: moreInfoOnCoin.market_data.current_price.usd,
                        euro: moreInfoOnCoin.market_data.current_price.eur,
                        ils: moreInfoOnCoin.market_data.current_price.ils,
                        img: moreInfoOnCoin.image.small
                    }
                    sessionStorage.setItem(coinId, JSON.stringify(coinInfo));
                    setTimeout(function () {
                        sessionStorage.removeItem(coinId);
                        $("#" + coinId).next().children().css("width", "0%"); //delete progress bar
                    }, 1000 * 120); //delete obj from local storage after 2 minutes
                } else {
                    coinInfo = JSON.parse(sessionStorage.getItem(coinId));
                }

                $(moreInfoDiv).html(`<div>
                                    <br>
                                    <h4>coin prices:</h4>  
                                    <p>USD:${coinInfo.usd}$</p>
                                    <p>EURO:${coinInfo.euro}€</p>
                                    <p>ILS:${coinInfo.ils}₪</p>
                                    <p><img src=${coinInfo.img}alt="coin image"></p>
                                </div>`);

                moveProgressBar(this);
            } catch (err) {
                console.log(err);
            }
        });
    }

    function moveProgressBar(elem) {
        $(elem).next().children().css("width", "100%");
    }

    function toggleAddCoin() {
        $(document).on("click", ".input-coins-graph", function () { //  click on the toggle switch
            if ($(this).prop('checked')) {
                let selectedCoinsId = $(this).attr("id");
                if (selectedCoins.indexOf($(this).attr("id")) === -1) { //if coin not already exist in the array pushes the coin id to the array
                    selectedCoins.push(selectedCoinsId)
                }
            } else {
                selectedCoins = selectedCoins.filter(coin => coin !== $(this).attr("id"))
                // remove unchecked coin from the array
            }
            if (selectedCoins.length > 5) {
                lastCoinChosen = selectedCoins.slice(-1);
                popUpModal();
            }
        });
    }



    function popUpModal() {
        cancelModalArr = selectedCoins.slice();
        $('.modal-card-coins').html('');
        for (const coin of selectedCoins) {
            $('.modal-card-coins').append(`
            <div class="col-6 col-lg-4">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${coin}</h5>
                        <div sy class="custom-control custom-switch toggle-switch">
                        <input type="checkbox" class="custom-control-input modal-switch" id=${coin}A checked>
                        <label class="custom-control-label" for=${coin}A></label>
                        </div>
                    </div>
                </div>
            </div>`);
        }
        $("#basicModal").modal('show');
    }

    function switchModalCoin() {
        $(document).on("click", ".modal-switch", function () { // click on the toggle switch inside the modal
            if ($(this).prop('checked')) {
                let coinId = $(this).attr("id");
                coinId = coinId.substring(0, coinId.length - 1); //remove last letter "A" to create the exact coin Id
                if (selectedCoins.indexOf(coinId) === -1) { //if coin not already exist in the array pushes it to the array
                    selectedCoins.push(coinId)
                }
            } else {
                let coinId = $(this).attr("id")
                coinId = coinId.substring(0, coinId.length - 1); //remove last letter "A" to create the exact coin Id
                selectedCoins = selectedCoins.filter(coin => coin !== coinId) // remove unchecked coin from the array
            }
        })
    }

    function saveModal() {
        $(document).on('click', "#saveModalBtn", function () {
            if (selectedCoins.length > 5) {
                alert("you can only choose 5 coins!,please select the coin/s you wish to remove");

            } else {
                $("#closeModal").trigger("click"); //closes the modal
                $("input[type='checkbox']").prop('checked', false); // make all check inputs false
                for (const coin of selectedCoins) {
                    $("#" + coin).prop('checked', true) //make only selected coins checked 
                }
            }
        });
    }

    function closeModal() {
        $(document).on('click', "#cancelModalBtn", function () {
            if (cancelModalArr.length === 6) {
                $("#" + lastCoinChosen).prop('checked', false); // make last coin selected check false
            }
            cancelModalArr.pop(); // remove last coin selected from the array
            selectedCoins = cancelModalArr.slice(); //selected coins array without the last coin selected
        });
    }

}())