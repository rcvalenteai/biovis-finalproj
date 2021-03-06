var ingredients = []
var foodNameData = []
var foodid = []
var foodMetric = []
var filter = ""
var metric_name =""

function get_bubbles(ingredient_name) {
    var raw_data;
    var rkeys;
    endpoint_framework =  "http://api.axonbeats.com/bubble_chart?ingredient=" + ingredient_name
    if (filter != ""){
        metric_name = "&metric=" + filter
    }
    //http://api.axonbeats.com/bubble_chart?ingredient=Celery&metric=preparation_time
    recipe_api_request = endpoint_framework + metric_name
    console.log(recipe_api_request)
    fetch(recipe_api_request)
        .then(response => response.json())
        .then(data => raw_data = data)
        .then(() => rkeys = console.log(Object.keys(raw_data)))
        .then( () => {
        clearSVGBubble()
        splits = raw_data["title"]
        names = []
        console.log(splits)
        count = 0
        spli = []
        for (j = 0; j < splits.length; j++) {
            //console.log(splits[j])
            //spli = (splits[j]).split(" ")
            //console.log(spli)
            //names1 = []
            //for (i = 0; i < spli.length; i++) {
            //    names1.push(spli[i])
            //    count++
            //    if (count == 2) {
            //        names1.push("\\\n")
            //        count = 0
            //    }
            //}
            names1 = splits[j].substring(0, 18)
            names.push(names1)
            //names2 = names1.join(" ")
            //console.log(names2)
            //names2 = names1.join(" ")
            //console.log(names2)
            //names.push(names2)
        }
        //console.log(names)


        foodNameData.push(names)
        foodid.push(raw_data["id"])
        foodMetric.push(raw_data["metric"])
        ingredients.push(ingredient_name)
        //console.log(ingredients)
        console.log(foodNameData)
        //console.log(foodid)
        //console.log(foodMetric)
        console.log(ingredients)

        //svg = d3.select("#bubbles").append("svg");
        var svg = d3.select("#bubbles");
        svg.selectAll("*").remove();
        var g = svg.append("g");

        var pack = d3.pack()
        .padding(function(d) {
            return d.height*4;
        });

        let root = d3.hierarchy(reformatData())
        .sum(function(d) {
            return d.value;
        });

        var width = 700;
        var height = 700;

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
                                id: foodid[j][i],
                                value: foodMetric[j][i]
                            }
                        })
                    }
                })
            };
            return reformatted
        }

        function clicked(d) {
            console.log("d.data.name: " + d.data.id)
            get_single_recipe(d.data.id)
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

    })

}

function get_bubbles2(filter_name) {
    document.getElementById('metric_map').innerText = filter_name
    console.log('filter: ' + filter_name)
    filter = filter_name;
    ingredients = []
    foodNameData = []
    foodid = []
    foodMetric = []
}


function clearSVGBubble() {
    d3.select("svg").selectAll().remove();
}