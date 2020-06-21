function rankChoice(chosenMethod) {
    //This is missing all of the data regarding electric vs diesel, so for right now this is something that kinda works
    if (["walk", "bike"].includes(chosenMethod)) {
        return "";
    }
    let rank = (["pt", "car", "truck"].indexOf(chosenMethod) + 2).toString();
    if (rank[rank.length - 1] == "2") {
        return rank + "nd";
    } else if (rank[rank.length - 1] == "3") {
        return rank + "rd";
    } else if (
        ["4", "5", "6", "7", "8", "9", "0"].includes(rank[rank.length - 1])
    ) {
        return rank + "th";
    }
}

instantiateMap();

const chosenMethod = loadFromSession("detail-method-selected");
if (!chosenMethod) {
    errorModal(
        "You haven't selected a method to see details for, please return to the previous page"
    );

}
const routeKey = mapKeyTranslator(chosenMethod);

mapRoute(routeKey);

$("#destination-name").text(
    loadFromSession("destination")
        .address.label.split(",")
        .slice(0, 1)
        .toString()
);
$("#transport-method").text(keyTranslator(chosenMethod).toLowerCase());
$("#travel-text").text(loadFromSession(`travel-text-${routeKey}`));
$("#method-ranking").text(rankChoice(routeKey));

//This is an array of metrics, I'll sort randomly and choose two to use as comparators,
//displaying them in order of units/time
//input will be in grams, I'll divide by the rate
//https://onetreeplanted.org/blogs/stories/planting-trees-reduce-carbon-footprint -> Tree sequesters at 48 pounds of carbon dioxide per year
//https://www.carbonindependent.org/22.html -> 90 kg CO2 per hour
//https://www.treehugger.com/travel/spacex-launch-puts-out-much-co2-flying-341-people-across-atlantic.html
//http://css.umich.edu/factsheets/carbon-footprint-factsheet ->
//https://www.globalcitizen.org/es/content/5-reasons-cow-farts-matter-and-could-destroy-the-w/ -> 84xx
//https://www.wired.co.uk/article/the-strange-war-against-cow-farts -> 240L is 132.96 g . day
//https://www.bbc.com/news/science-environment-49349566 ->
let comparisonMetrics = [
    {
        description: " days of a ten year old tree's consumption",
        rate: 59.65,
        src: "./assets/icons/tree.png",
    },

    {
        description: " days of methane from cow flatus",
        rate: 132.96,
        src: "./assets/icons/cow.png",
    },
    {
        description: " passenger kilometres travelled on a domestic flight",
        rate: 133,
        src: "./assets/icons/plane.png",
    },
    {
        description: " passenger kilometres travelled on a long haul flight",
        rate: 102,
        src: "./assets/icons/plane2.png",
    },
    {
        description: " passenger kilometres travelled by rail",
        rate: 41,
        src: "./assets/icons/train.png",
    },
    {
        description: " passenger kilometres travelled on the eurostar",
        rate: 6,
        src: "./assets/icons/train2.png",
    },
];

let chosenRate = loadFromSession("detail-method-rate-chosen");
//WE CAN ADD METRICS, I RANDOMLY CHOOSE THREE EACH TIME
if (chosenRate == 0) {
    $("#relative-section").addClass("d-none");
    $("#zero-co2-note").removeClass("d-none");
    $("#comparison-graph-title").removeClass("my-5");
    $("#comparison-graph-title").addClass("mb-5");
} else {
    //choosing three metrics, calculating the data relevant for each
    let i = 0;
    let comparators = [];
    while (i < 3) {
        i++;
        let randItem = Math.floor(Math.random() * comparisonMetrics.length);
        comparators.push(comparisonMetrics[randItem]);
        comparisonMetrics.splice(randItem, 1);
    }

    if (chosenRate != 0) {
        comparators.forEach(function (comparator) {
            comparatorRate = (chosenRate / comparator.rate).toFixed(2);
            $("#co2-metrics ul").append(
                `<li><img class="co2icon mb-3" src="${comparator.src}" /><span class="green pl-3">${comparatorRate}</span>${comparator.description}</li>`
            );
        });
    }
    let co2Amount = parseInt(chosenRate);
    let co2Unit;

    if (co2Amount > 999) {
        co2Amount /= 1000;
        co2Amount = co2Amount.toFixed(2);
        co2Unit = "kg";
    } else {
        co2Amount = co2Amount.toFixed(1);
        co2Unit = "g";
    }
    $("#co2-amount").text(co2Amount);
    $("#co2-unit").text(co2Unit);
}

//TURN BY TURN DIRECTIONS
$("#show-directions").click(function (event) {
    window.location.href = "./directions.html";
});
