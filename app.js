// STEP 1: Initial function
function init() {
    
    // Select for options
    var dropdownMenu = d3.select("#selDataset");

    // Add Test subject IDs to the dropdown menu
    d3.json("samples.json").then((importData) => {
        var data = importData;
        var sampleNames = data.names;
        sampleNames.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value");
        });

        // Initial display of ID 940 Demographics;
        var init_sample = data.metadata[0];
        var demo_info = d3.select("#sample-metadata");
        Object.entries(init_sample).forEach(([key, value]) => {
            demo_info.append("h5").text(`${key}: ${value}`);
        });

        // Initial display of graphs for ID 940:
        var results = data.samples[0];
        var sample_values = results.sample_values;
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels

        // Initial Bar Chart for ID 940
        var sample_values_bar = sample_values.slice(0, 10).reverse();
        var otu_ids_bar = otu_ids.slice(0, 10).reverse().map(m => `OTU ${m}`);
        var otu_labels_bar = otu_labels.slice(0, 10).reverse();

        var trace1 = {
            x: sample_values_bar,
            y: otu_ids_bar,
            text: otu_labels_bar,
            type: "bar",
            orientation: "h"
        }

        var layout = {
            title: "Top 10 Bacterial Cultures Found",
            margin: { t: 30, l: 120}
        }

        var data = [trace1];

        Plotly.newPlot("bar", data, layout);

        // Initial Bubble Chart for ID 940
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            marker: {
                size: sample_values,
                color: otu_ids,
            },
            text: otu_labels,
            mode: "markers"
        }

        var data2 = [trace2];

        var layout2 = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: "OTU IDs"},
            yaxis: {
                min: 0,
                max: 230,
                stepSize: 50
            },
            margin: {t:40}
        }

        Plotly.newPlot("bubble", data2, layout2);

        // Initial Gauge Chart for ID 940
        var wfreq = init_sample.wfreq;
        
        var trace_gauge = {
            domain: {x: [0, 1], y: [0, 1]},
            value: wfreq,
            title: {text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>"},
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {range: [null, 9], dtick: 1},
                steps: [
                    { range: [0,1], color: "#ffffff"},
                    { range: [1,2], color: "#e6f9ff"},
                    { range: [2,3], color: "#ccf2ff"},
                    { range: [3,4], color: "#b3ecff"},
                    { range: [4,5], color: "#99e6ff"},
                    { range: [5,6], color: "#80dfff"},
                    { range: [6,7], color: "#66d9ff"},
                    { range: [7,8], color: "#4dd2ff"},
                    { range: [8,9], color: "#33ccff"}
                ],
                threshold: {
                    line: {color: "purple", width: 4},
                    thickness: 0.75,
                    value: wfreq
                }
            }
        }

        var layout_gauge = {
            width: 500,
            height: 400,
            margin: {t:0, b:0}
        }

        var data_gauge = [trace_gauge];

        Plotly.newPlot("gauge", data_gauge, layout_gauge);
        
        });

    
}

function optionChanged(sample) {
    demographicInformation(sample);
    plots(sample);
}

init();

// STEP 2: Build the sample metadata ie. an individual's demographic information
function demographicInformation(sample) {
    d3.json("samples.json").then((importData) => {
        var data = importData;
    
        // Retrieve metadata
        var metadata = data.metadata;

        // Select samples that fall in the chosen "Test Subject ID"
        var demo_resultArray = metadata.filter(testSubject =>
            testSubject.id == sample);
        var demo_result = demo_resultArray[0];
        
        // Display demographic info
        var demo_info = d3.select("#sample-metadata");
        demo_info.html("");
        Object.entries(demo_result).forEach(([key,value]) => {
            demo_info.append("h6").text(key + ' : ' + value + '\r');
        });
    });
}

// STEP 3: Draw charts
function plots(sample) {

    // Use the D3 Library to read in samples.json
    d3.json("samples.json").then((importData) => {
        var data = importData;

        // Retrieve JSON samples data 
        var plotSamples = data.samples;

        // Select samples for chosen "Test Subject ID"
        var samples_resultArray = plotSamples.filter(testSubject => 
            testSubject.id == sample); 
        var samples_result = samples_resultArray[0];
        
        // Store info into ariables
        var sampleValues = samples_result.sample_values;
        var otuIDs = samples_result.otu_ids;
        var otuLabels = samples_result.otu_labels;

        // Clears the existing bar graph before drawing the new one
        var barplots = d3.select("#bar");
        barplots.html("");

        // Display the bar graph
        var sampleValues_bar = sampleValues.slice(0, 10).reverse();
        var otuIDs_bar= otuIDs.slice(0, 10).reverse().map(m => `OTU ${m}`);
        var otuLabels_bar = otuLabels.slice(0, 10).reverse();
        
        var trace_bar = {
            x: sampleValues_bar,
            y: otuIDs_bar,
            text: otuLabels_bar,
            type: "bar",
            orientation: "h"
        }

        var layout_bar = {
            title: "Top 10 Bacterial Cultures Found",
            margin: { t: 30, l: 120}
        }

        var data_bar = [trace_bar];

        Plotly.newPlot("bar", data_bar, layout_bar);


        // Display the bubble chart
        var trace_bubble = {
            x: otuIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: otuIDs
            },
            text: otuLabels,
            mode: "markers"
        }

        var data_bubble = [trace_bubble];

        var layout_bubble = {
            title: "Bacterial Cultures Per Sample",
            xaxis: {title: "OTU IDs"},
            margin: {t:40}
        }

        Plotly.newPlot("bubble", data_bubble, layout_bubble);

        // OPTIONAL ASSIGNMENT: Guage Chart

        // Get wfreq values -- which is inside the demographic metadata
        var metadata = data.metadata;
        var demo_resultArray = metadata.filter(testSubject =>
            testSubject.id == sample);
        var demo_result = demo_resultArray[0];
        var wfreq = demo_result.wfreq;
        
        var trace_gauge = {
            domain: {x: [0, 1], y: [0, 1]},
            value: wfreq,
            title: {text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>"},
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {range: [null, 9], dtick: 1},
                steps: [
                    { range: [0,1], color: "#ffffff"},
                    { range: [1,2], color: "#e6f9ff"},
                    { range: [2,3], color: "#ccf2ff"},
                    { range: [3,4], color: "#b3ecff"},
                    { range: [4,5], color: "#99e6ff"},
                    { range: [5,6], color: "#80dfff"},
                    { range: [6,7], color: "#66d9ff"},
                    { range: [7,8], color: "#4dd2ff"},
                    { range: [8,9], color: "#33ccff"}
                ],
                threshold: {
                    line: {color: "purple", width: 4},
                    thickness: 0.75,
                    value: wfreq
                }
            }
        }

        var layout_gauge = {
            width: 500,
            height: 400,
            margin: {t:0, b:0}
        }

        var data_gauge = [trace_gauge];

        Plotly.newPlot("gauge", data_gauge, layout_gauge);
    })
}

