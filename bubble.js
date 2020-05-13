foodNameData = [["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf", "grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf", "grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"]]
foodData = [[10, 20, 30, 40, 50], [10, 20, 30, 400, 50], [10, 20, 30, 40, 500], [10, 200, 30, 400, 50], [10, 20, 300, 40, 50], [10, 20, 30, 400, 50], [10, 20, 30, 40, 500], [10, 200, 30, 40, 50, 10, 20, 30, 40, 50, 10, 200, 30, 40, 50]]
var ingredients = ["asdf", "tomato", "pepper", "potato", "orange zest", "pasta", "oregano", "water"]

//svg = d3.select("#bubbles").append("svg");
var svg = d3.select("#bubbles");
var g = svg.append("g");

var pack = d3.pack()
.padding(function(d) {
    return d.height*4;
});

let root = d3.hierarchy(reformatData())
.sum(function(d) {
    return d.value;
});

var width = 500;
var height = 500;

svg.attr("width", width).attr("height", height);

pack.size([width, height]);

var scale_colors = {};
ingredients.forEach(function(d, i) {
    scale_colors[d] = d3.schemeTableau10[i];
});

var node = pack(root);
var recipeNodes = node.leaves();
var ingredientNodes = node.ancestors();

ingredientBubbles = g.selectAll(".ingredient-circle")
    .data(ingredientNodes[0].children, function(d) {
    return d.data.name;
});

ingredientBubbles.enter().append("circle")
    .attr("class", "ingredient-circle")
    .style("fill",   function(d) { return scale_colors[d.data.name]; })
    .style("stroke", function(d) { return scale_colors[d.data.name]; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r",  function(d) { return d.r; });

ingredientBubbles.enter()
    .append("text")
    .text(function(d) {
    return d.data.name
}).attr("text-anchor", "middle")
    .attr("dy", function(d) {
    return d.y - ((4*d.r)/5);
}).attr("dx", function(d) {
    return d.x;
    //if (((d.data.name).length) < 4) {
    //    return d.x + (d.r / 2);
    //} else {
    //    return d.x + (d.r / ((d.data.name).length)*2.5);
    //}
}).attr("font-size", function(d) {
    return d.r / 5;
}).style("fill", function(d) { return "#000000"; })

recipeBubbles = g.selectAll(".recipe-circle")
    .data(recipeNodes, function(d) {
    return d.data.name;
});

recipeBubbles.enter().append("circle")
    .attr("class", "recipe-circle")
    .style("fill",   function(d) { return scale_colors[d.parent.data.name]; })
    .style("stroke", function(d) { return scale_colors[d.parent.data.name]; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r",  function(d) { return d.r; })
    .on("click", clicked);

recipeBubbles.enter()
    .append("text")
    .text(function(d) {
    //console.log(d.data.name)
    return d.data.name
}).attr("text-anchor", "middle")
    .attr("dy", function(d) {
    return d.y;
}).attr("dx", function(d) {
    return d.x;
}).attr("font-size", function(d) {
    return d.r / 5;
});

function reformatData(){
    reformatted = {
        name: "root",
        children: ingredients.map(function(ingredient_i, j) {
            return {
                name: ingredients[j],
                children: d3.range(foodNameData[j].length).map(function(d, i) {
                    return {
                        name: foodNameData[j][i],
                        value: foodData[j][i]
                    }
                })
            }
        })
    };
    return reformatted
}

function clicked(d) {
    console.log("d.data.name: " + d.data.name)
}

var zoom = d3.zoom()
.scaleExtent([1, 12])
.on('zoom', function() {
    g.selectAll('circle')
        .attr('transform', d3.event.transform);
    g.selectAll("text")
        .attr('transform', d3.event.transform);
});

svg.call(zoom);