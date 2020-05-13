allGroup = ["Celery", "Tomato"]
endpoint_framework =  "http://api.axonbeats.com/ingredient_list"
fetch(endpoint_framework)
    .then(response => response.json())
    .then(data => raw_data = data)
    .then(() => {

    console.log("here")
    console.log(Object.keys(raw_data["ingredients"]))
    d3.select("#ingredient_select")
        .selectAll('myOptions')
        .data(raw_data["ingredients"])
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#ingredient_select").on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
        get_bubbles(selectedOption)
    })
})