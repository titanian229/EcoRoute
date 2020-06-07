function detailsButton(event) {
    console.log("details button clicked");
    console.log(event.target.dataset.method);
    saveToSession("detail-method-selected", event.target.dataset.method);
    saveToSession("detail-method-rate-chosen", event.target.dataset.rate);
    window.location.href = "./details.html";
}

function processTime(timeGiven){
    let hours = Math.floor(timeGiven / 3600)
    timeGiven = timeGiven - (hours * 3600)
    let minutes = Math.floor(timeGiven/60)
    if (hours < 9){
        hours = "0" + hours
    }    
    if (minutes < 10){
        minutes = "0" + minutes
    }
    return `${hours}:${minutes}`
}


//-----------------------------------------
validateStorage([
    "distance-car",
    "directions-walk",
    "origin",
    "distance-walk",
    "directions-car",
    "shape-walk",
    "traveltime-bike",
    "travel-text-walk",
    "directions-bike",
    "shape-truck",
    "distance-truck",
    "destination",
    "shape-bike",
    "directions-pt",
    "shape-pt",
    "traveltime-truck",
    "traveltime-car",
    "results",
    "shape-car",
    "traveltime-walk",
    "travel-text-bike",
    "travel-text-car",
    "travel-text-pt",
    "traveltime-pt",
    "travel-text-truck",
    "distance-pt",
    "directions-truck",
    "distance-bike",
]);

map = instantiateMap();

destination = loadFromSession("destination");
$("#destination-feedback").text(
    destination.address.label.split(",").slice(0, 2).toString()
);

const chosenTransportMethods = loadFromSession("results");
const rowEl = $("#results-row");

let distances = [];

mapRoute(mapKeyTranslator(chosenTransportMethods[0].mode));

chosenTransportMethods.forEach(function (transportMethod, index) {
    transportMethodId = transportMethod.mode;

    //This fixes a problem that micro-cars and whatnot are not keys included in the routes
    if (
        ["micro-car", "compact-car", "sedan", "suv"].includes(transportMethodId)
    ) {
        console.log("avast a car");
        transportMethodId = "car";
    }

    console.log(transportMethod);
    console.log(loadFromSession(`distance-${transportMethodId}`).toFixed(1));
    distances.push(loadFromSession(`distance-${transportMethodId}`));

    let cardElText = `<div class="card results-card mx-3 my-2">
            <div class="card-body">
              <h5 class="card-title text-center bold">${keyTranslator(transportMethodId)}</h5>
              <div class="card-text">
                <div class="row">
                  <div class="col-5 text-right">
                    <p class="large-number">${transportMethod.co2.toFixed(1)}</p>
                  </div>
                  <div class="col-1 px-0 mx-0">
                    <p class="green fancy-bullet">&#8226;</p>
                  </div>
                  <div class="col-5 text-left">
                    <p class="info-text green">g CO<sup>2</sup></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-5 text-right">
                    <p class="large-number">${processTime(loadFromSession(`traveltime-${transportMethodId}`))}</p>
                  </div>
                  <div class="col-1 px-0 mx-0">
                    <p class="green fancy-bullet">&#8226;</p>
                  </div>
                  <div class="col-5 text-left">
                    <p class="info-text green">hr</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-5 text-right">
                    <p class="large-number">${loadFromSession(
                        `distance-${transportMethodId}`
                    ).toFixed(1)}</p>
                  </div>
                  <div class="col-1 px-0 mx-0">
                    <p class="green fancy-bullet">&#8226;</p>
                  </div>
                  <div class="col-5 text-left">
                    <p class="info-text green">km</p>
                  </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-success" data-method="${transportMethod.mode}" data-rate="${transportMethod.co2}" onclick="detailsButton(event)">Learn More</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

    // let cardElText =
    //     `<div class=""><div class="card results-card mx-3 my-2"><div class="card-body">` +
    //     `<h5 class="card-title">${
    //         transportNameVals[transportNameKeys.indexOf(transportMethodId)]
    //     }</h5>` +
    //     `<div class="card-text">` +
    //     `<p>CO<sup>2</sup>: <span class="info-text">${transportMethod.co2.toFixed(
    //         1
    //     )} <span class="units">g</span></span></p>` +
    //     `<p>Time: <span class="info-text">${(
    //         loadFromSession(`traveltime-${transportMethodId}`) / 60
    //     ).toFixed(1)} minutes</span></p>` +
    //     `<p>Distance: <span class="info-text">${loadFromSession(
    //         `distance-${transportMethodId}`
    //     ).toFixed(1)} km</span></p>` +
    //     `<button class="btn btn-success" data-method="${transportMethod.mode}" data-rate="${transportMethod.co2}" onclick="detailsButton(event)">Learn More</button>` +
    //     `</div></div></div></div>`;
    rowEl.append(cardElText);
});

if (distances.length > 1) {
    distances.sort((a, b) => b - a);
    console.log("distances", distances);
    $("#distance-range").text(
        "between " +
            distances[distances.length - 1].toFixed(1) +
            " to " +
            distances[0].toFixed(1)
    );
} else {
    $("#distance-range").text(distances[0].toFixed(1));
}

//TODO catch if the range is within a certain amount and just display that amount
