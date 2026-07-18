async function getData(e) {
    e.preventDefault();

    let input = document.getElementById("text-box");
    let city = input.value.trim();
    
    if(city == ""){
        alert("Please check city name");
        return;
    }

    let cityPattern = /^[A-Za-z\s]+$/;
    let check = cityPattern.test(city);
    if(check == false){
        alert("Enter valid city name");
        return;
    }

    let load = document.getElementById("load");
    load.style.display = "block";

    let api = `https://api.weatherapi.com/v1/forecast.json?key=fe34a73653804481aeb95556260205&q=${city}&days=3`;

    try{
        let res = await fetch(api);
        let data = await res.json();
        console.log(data);
        display(data);
    }
    catch(err){
        alert("Error: " + err);
    }
    finally{
        load.style.display = "none";
        input.value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("empty-box").style.display = "none";
        document.getElementById("form-box").style.display = "block";

        // Enable scrolling after splash screen
        document.body.style.overflow = "auto";
    }, 5000);
});

function display(data){

    // Today's Forecast
    let todayForecast = "";

    let todayHours =
    data.forecast.forecastday[0].hour;

    for(let i = 0; i < todayHours.length; i += 3) {

        let item = todayHours[i];

        todayForecast += `
            <div class="col text-center border-end">
                <p class="small text-white-50">
                    ${item.time.split(" ")[1]}
                </p>
                <img src="https:${item.condition.icon}" width="50">
                <h5 class="mt-2">
                    ${item.temp_c}°
                </h5>
            </div>

        `;
    }

    // Weekly Forecast
    let weeklyForecast = "";

    data.forecast.forecastday.forEach((day, index) => {

        let date = new Date(day.date);

        let dayName =
        index === 0
        ? "Today"
        : date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        weeklyForecast += `
            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <h6 class="text-white-50">
                    ${dayName}
                </h6>
                <img src="https:${day.day.condition.icon}" width="40">
                <p class="m-1">
                    ${day.day.condition.text}
                </p>
                <h6>
                    ${day.day.maxtemp_c}° /
                    ${day.day.mintemp_c}°
                </h6>
            </div>
        `;
    });

    // Main HTML
    let htmlCode = `
        <div class="row g-4">

            <!-- LEFT SECTION -->
            <div class="col-lg-8">

                <!-- Current Weather -->
                <div class="card bg-dark text-white px-5 rounded-4 border-0" id="current">
                    <div class="row d-flex justify-content-space-around align-item-center">
                        <div class="col-8">
                            <h1>
                                ${data.location.name}
                            </h1>
                            <p>Chance of rain:
                                ${data.current.chance_of_rain}%
                            </p>
                            <h1 class="display-3 fw-bold">
                                ${data.current.temp_c}<sup>o</sup>C
                            </h1>
                        </div>

                        <div class="col-4 py-4 d-flex align-items-center">
                            <img
                                src="https:${data.current.condition.icon}"
                                alt=""
                                width="120px"
                            >
                        </div>
                    </div>
                </div>

                <!-- Today's Forecast -->
                <div class="card bg-dark bg-gradient text-white p-4 rounded-4 border-0 mt-2">
                    <h6 class="mb-4 text-white-50">
                        TODAY'S FORECAST
                    </h6>
                    <div class="row">
                        ${todayForecast}
                    </div>
                </div>

                <!-- Air Conditions -->
                <div class="card bg-dark bg-gradient text-white p-4 rounded-4 border-0 mt-2">
                    <div class="d-flex justify-content-between mb-4">
                        <h6 class="text-white-50 p-1">
                            AIR CONDITIONS
                        </h4>
                        <button class="btn btn-primary btn-sm rounded-pill px-3">
                            See more
                        </button>
                    </div>

                    <div class="row g-0">

                        <!-- Real Feel -->
                        <div class="col-6">
                            <div class="rounded-0 p-2">
                                <p class="text-white-50">
                                    <i class="fa-solid fa-temperature-three-quarters"></i>
                                    Real Feel
                                </p>
                                <h4>
                                    ${data.current.feelslike_c}°C
                                </h4>
                            </div>
                        </div>

                        <!-- Wind -->
                        <div class="col-6">
                            <div class="rounded-0 p-2">
                                <p class="text-white-50">
                                    <i class="fa-solid fa-wind"></i>
                                    Wind
                                </p>
                                <h4>
                                    ${data.current.wind_kph} km/h
                                </h4>
                            </div>
                        </div>

                        <!-- Humidity -->
                        <div class="col-6">
                            <div class="rounded-0 p-2">
                                <p class="text-white-50">
                                    <i class="fa-solid fa-droplet"></i>
                                    Humidity
                                </p>
                                <h4>
                                    ${data.current.humidity}%
                                </h4>
                            </div>
                        </div>

                        <!-- UV -->
                        <div class="col-6">
                            <div class="rounded-0 p-2">
                                <p class="text-white-50">
                                    <i class="fa-solid fa-sun"></i>
                                    UV Index
                                </p>
                                <h4>
                                    ${data.current.uv}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SECTION -->
            <div class="col-lg-4">
                <div class="card bg-dark bg-gradient text-white p-4 rounded-4 border-0 h-100">
                    <h6 class="mb-4 text-white-50">
                        3-DAY FORECAST
                    </h6>
                    ${weeklyForecast}
                </div>
            </div>
        </div>

    `;
    document.getElementById("ref").innerHTML = htmlCode;
}