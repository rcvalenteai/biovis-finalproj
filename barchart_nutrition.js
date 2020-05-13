// recipe_id = "5ea2257e6f97ab0be6137d89"
endpoint_framework =  "http://api.axonbeats.com/single_recipe?recipe_id="
get_single_recipe("5ea24c216f97ab0be6138268")
function get_single_recipe(recipe_id) {
    clearSVG()
    console.log(recipe_id)
    endpoint_framework =  "http://api.axonbeats.com/single_recipe?recipe_id="
    recipe_api_request = endpoint_framework + recipe_id
    console.log(recipe_api_request)
    var raw_data;
    var rkeys;
    fetch(recipe_api_request)
        .then(response => response.json())
        .then(data => raw_data = data)
        .then( () => {

        console.log(raw_data)
        rkeys = Object.keys(raw_data["nutrition"])
        console.log(raw_data.title)
        console.log(raw_data.rating)
        console.log(raw_data.image)
        displayImage(raw_data.image);
        displayTitle(raw_data.title);
        displayRating(String(raw_data.rating));
        displayInstructions(raw_data.link);

        all_keys = []
        all_vals = []
        for (i = 0; i < rkeys.length; i++) {
            var istr = i.toString();
            var ival = (raw_data.nutrition[rkeys[istr]])
            all_vals.push(parseInt(ival))
            all_keys.push(rkeys[istr])
        }

        var margin = {top: 40, right: 40, bottom: 40, left: 40},
            width = 1700 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

        var svg = d3.select("#nutr_bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
        var y = d3.scaleLinear()
        .range([height, 0]);

        x.domain(all_keys.map(function(d) {
            return d;
        }));
        y.domain([0, d3.max(all_vals, function(d, i) {
            return d;
        })]);

        svg.selectAll(".bar")
            .data(all_keys)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
            return x(d);
        })
            .attr("width", x.bandwidth())
            .attr("y", function(d, i) {
            return y(all_vals[i]);
        })
            .attr("height", function(d, i) {
            return height - y(all_vals[i]);
        })
            .attr("fill", function(d) {
            return "steelblue";
        });

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));
    })
}

function clearSVG() {
    d3.select("#nutr_bar").select("svg").remove();
}

function displayImage(src) {
    document.getElementById('recipe_image').src=src;
}

function displayTitle(title) {
    document.getElementById('recipe_title').innerText = title
}

function displayRating(rating) {
    document.getElementById('recipe_rating').innerText = rating
}

function displayInstructions(link) {
    document.getElementById('recipe_instructions').setAttribute('href', link)
}