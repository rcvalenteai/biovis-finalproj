allGroup = ["preparation_time", "Calories", "Fat", "Saturated Fat", "Carbohydrate", "Sugar", "Dietary Fiber", "Protein", "Cholesterol", "Sodium"]

d3.select("#filter_select")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

d3.select("#filter_select").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    console.log(selectedOption)
    set_filter(selectedOption)
})