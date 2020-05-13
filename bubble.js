foodNameData = [["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "hot buns", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"], ["grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf", "grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf", "grilled chicken", "kung pao chicken", "peking duck", "carne asada borrito", "surf and turf"]]
foodData = [[10, 20, 30, 40, 50], [10, 20, 30, 400, 50], [10, 20, 30, 40, 500], [10, 200, 30, 400, 50], [10, 20, 300, 40, 50], [10, 20, 30, 400, 50], [10, 20, 30, 40, 500], [10, 200, 30, 40, 50, 10, 20, 30, 40, 50, 10, 200, 30, 40, 50]]
ingredients = ["asdf", "tomato", "pepper", "potato", "orange zest", "pasta", "oregano", "water"]

//svg = d3.select("#bubbles").append("svg");
svg = d3.select("#bubbles");
g = svg.append("g");

pack = d3.pack()
    .padding(function(d) {
    return d.height*4;
});

let root = d3.hierarchy(reformatData())
.sum(function(d) {
    return d.value;
});

diameter = Math.min(innerWidth, innerHeight);
width = diameter;
height = diameter;

//width = this.parent.width
//height = this.parent.height
svg.attr("width", 500)
    .attr("height", 500);

pack.size([width, height]);

node = pack(root);
recipeNodes = node.leaves();
ingredientNodes = node.ancestors();

ingredientBubbles = g.selectAll(".ingredient-circle")
    .data(ingredientNodes[0].children, function(d) {
    return d.data.name;
});

ingredientBubbles.enter().append("circle")
    .style("fill",   function(d) { return "rgb(102, 194, 165)"; })
    .style("stroke", function(d) { return "rgb(102, 194, 165)"; })
    .attr("class", "ingredient-circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r",  function(d) { return d.r; });

ingredientBubbles.enter().append("text")
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
    .style("fill",   function(d) { return "rgb(102, 194, 165)"; })
    .style("stroke", function(d) { return "rgb(102, 194, 165)"; })
    .attr("class", "recipe-circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r",  function(d) { return d.r; })
    .on("click", clicked);

recipeBubbles.enter().append("text")
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
    //console.log(reformatted)
    return reformatted
}

function clicked(d) {
    console.log("d.data.name: " + d.data.name)
}

var zoom = d3.zoom()
.scaleExtent([1, 8])
.on('zoom', function() {
    g.selectAll('circle')
        .attr('transform', d3.event.transform);
    g.selectAll("text")
        .attr('transform', d3.event.transform);
});

svg.call(zoom);