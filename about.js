"use strict";
(function () {
        $(function () {

                $(document).on("click", "#aboutLink", function () {
                        if (!$("#aboutLink").hasClass("active-tab")) { 
                                $("#reportLink").removeClass("active-tab");
                                $("#homeLink").removeClass("active-tab");
                                $("#aboutLink").addClass("active-tab");
                                $("#about-container").show();
                                $("#coin-container").css("display", "none"); //hide coins
                                if (graphExistFlag) {
                                        clearInterval(interval);
                                        $("#chartContainer").CanvasJSChart().destroy();
                                        $("#chartContainer").empty();
                                        graphExistFlag = false;
                                }
                                $("#about-container").html(`
                                <div class="container">
                                    <div class="header">
                                        <h1>Cryptonite</h1>
                                    </div>
                                    <div class="intro column">
                                        <p class="text">
                                           Cryptonite allows you to search up to 6,000 Cryptocurrency coins and get their exchange rate to USD,ILS and Euro, as well as the coin image.
                                           Cryptonite also allows you to select up to 5 coins to present on a graph that shows the selected coins rate compared to USD.
                                           the graph updates every two seconds.
                                        </p>
                                    </div>
                                    <div class="main-text">
                                        <h2>About Me:</h2>
                                        <div class="about-me-text">
                                        <img src="assets/images/profile.png">	
                                        <p>
                                           My name is Ron Nizan and I'm
                                           a 26 year old web developer.<br>
                                           I have studied philosophy and political science but have always been interested in web development.
                                           During my studies I started takeing web development courses online.
                                           That and my previous interest in web development created a spark to turn my hobby into a career.
                                           I took my first steps towards my new career in October 2019.
                                        </p>
                                        </div>
                                    </div>
                                </div>`)

                        }
                });

        })
}())