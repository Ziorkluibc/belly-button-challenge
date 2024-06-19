// Build the metadata panel
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// let data = d3.json(url).then(function(data){
//     console.log(data);
// });

    // get the metadata field
function buildmetaData(sampleID) {
  d3.json(url).then(function(data) {
     let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleArray = metaData.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    // Use dml("");
    PANEL = d3.select("#sample-metadata")
    // Inside a loop, you will need to use d3 to append new
    PANEL.html("")
    for (key in sample) {
    // tags for each key-value in the filtered metadata.
    PANEL.append("h6").text(`${key.toUpperCase()}: ${sample[key]}`)
    }
  });

}

// function to build both charts
//
function buildbubbleplot (sampleID) {
  d3.json(url).then((data) => {

    // Get the samples field
      let samples = data.samples;
      
    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample.otu_ids
    let otu_labels = sample.otu_labels
    let sample_values = sample.sample_values

    // Build a Bubble Chart
    let trace1 = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker:{
          size: sample_values,
          color: otu_ids,
          colorscale:"Earth"
        }
      }
    ];
    // Render the Bubble Chart
    let layout = {
          xaxis: {title:"OTU ID"}
      };
      Plotly.newPlot("bubble", trace1, layout)
    });
  }

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      function buildbarplot(sampleID) { 
        d3.json(url).then((data) => {
        let samples = data.samples;

        let sampleArray = samples.filter(sampleObj => sampleObj.id == sampleID);
        let sample = sampleArray[0];

        let otu_ids = sample.otu_ids
        let otu_labels = sample.otu_labels
        let sample_values = sample.sample_values
        let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        

        let barData = [
            {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation:"h"
            }
        ];

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
      let layout ={
        title: "Sample Bar Chart"
      };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, layout)
  });
}

// Function to run on page load
function init() {
  let  dropdownMenu = d3.select("#selDataset");
  d3.json(url).then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    
    for (let i =0; i < names.length; i++){
      dropdownMenu.append("option")
      .text(names[i])
      .property("value", names[i]);
    };
    // Get the first sample from the list
    let firstSample = names[0]
     
    // Build charts and metadata panel with the first sample
      buildbubbleplot(firstSample);
      buildbarplot(firstSample);
      buildmetaData(firstSample);
      
  });
};

// Function for event listener
  // Build charts and metadata panel each time a new sample is selected
    function optionChanged(newSample){
      buildbubbleplot(newSample);
      buildbarplot(newSample);
      buildmetaData(newSample);
    };

init();
