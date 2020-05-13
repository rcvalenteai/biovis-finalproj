
var raw_data = {"nutrition" : {"Calories":"514 kcal",
                               "Fat":"23 g",
                               "Saturated Fat":"8 g",
                               "Carbohydrate":"44 g",
                               "Sugar":"8 g",
                               "Dietary Fiber":"9 g",
                               "Protein":"39 g",
                               "Cholesterol":"119 mg",
                               "Sodium":"190 mg"}}

var rkeys = Object.keys(raw_data["nutrition"])

all_keys = []
all_vals = []
for (i = 0; i < rkeys.length; i++) {
    var istr = i.toString();
    var ival = (raw_data.nutrition[rkeys[istr]]).split(" ")
    if (ival[1] == "g"){
        all_vals.push(parseInt(ival[0]))
        all_keys.push(rkeys[istr])
    }
}

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
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
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y));
