// GeoJSON for all earthquakes in the past week
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to queryURL
d3.json(queryURL).then(function (data) {
    console.log(data)
    
    // Once we get a response, send the data.features object to createFeatures function.
    createFeatures(data.features);
  });

// Define createFeatures function
function createFeatures(earthquakeData) {

    // Define function to create circle marker for each feature in features array
    function pointToLayer(feature, latlng) {

        // Marker color <= earthquake depth - THIRD COORDINATE (greater depth, darker color) 
        var fillcolor = "";
        if (feature.geometry.coordinates[2] < 10) {fillcolor = "#7AFF33";}
        else if (feature.geometry.coordinates[2] >= 10 && feature.geometry.coordinates[2] < 30) {fillcolor = "#CEFF33";}
        else if (feature.geometry.coordinates[2] >= 30 && feature.geometry.coordinates[2] < 50) {fillcolor = "#FFE333";}
        else if (feature.geometry.coordinates[2] >= 50 && feature.geometry.coordinates[2] < 70) {fillcolor = "#FFB133";}
        else if (feature.geometry.coordinates[2] >= 70 && feature.geometry.coordinates[2] < 90) {fillcolor = "#FF8833";}
        else if (feature.geometry.coordinates[2] > 90) {fillcolor = "#FF3D33";}
    
        // Marker size <= earthquake magnatude (bigger mag, bigger marker)
        var circleOptions = {
            radius: Math.sqrt(feature.properties.mag) * 10,
            color: "black",
            fillColor: fillcolor,
            fillOpacity: 0.75,
            weight: 1,
            opacity: 1
        };
    
        return L.circleMarker(latlng, circleOptions);
    
    }

    // Define function to run once for each feature in features array
    // and creates a popup with info about the earthquake when its marker is clicked
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Create GeoJSON layer containing features array from earthquakesData object
    // Run onEachFeature once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // Put earthquakes layer on the map with createMap function
    createMap(earthquakes);

}

// Define function for creating the map
function createMap(earthquakes) {

    // Create tile layer for map background
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create basemaps object to hold street map
    var baseMaps = {
        "Street Map": street
    };

    // Create overlayMaps object to hold earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add a layer control with baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);


    colorList = ["#7AFF33", "#CEFF33", "#FFE333", "#FFB133", "#FF8833", "#FF3D33"];

    var legend = L.control({
        'position': 'bottomright',
        'background': 'white',
    });
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend");
        labels = ["<strong>Depths</strong>"],
        categories = ["Depth < 10", "Depth 11-30", "Depth 31-50", "Depth 51-100", "Depth > 100"];
        for(var i = 0; i< categories.length; i++) {
            div.innerHTML +=
            labels.push('<i class="circle" style="background:' + colorList[i] + '"></strong>' + categories[i] +'</strong></i>');
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);

}




// Attach popups with additional info about the earthquake when marker is clicked


// Include legend for context of map data
