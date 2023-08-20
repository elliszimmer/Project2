// 1. Read in the json sample data from the given url
//const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const url = "https://raw.githubusercontent.com/elliszimmer/Project3_Group2/javascript-branch-A/final_dataset.json"
let jsonData;
dataPromise = d3.json(url);
// dataPromise.then(data => {
//     console.log("JSON data: ", data);  // Logs the JSON data to the console
//     // Here we are going to execute our sequence of routines
//     jsonData = data;
//     let tickers = data.tickers;
//     let dropdown1 = d3.select("#Menu_1"); // Select the dropdown element using D3
//     // Append the default option
//     dropdown1.append("option").text("Select a ticker symbol").attr("value", "").property("selected", true);
//     // Populate the dropdown using D3's data join
//     dropdown1.selectAll("option:not(:first-child)").data(tickers).enter().append("option").text(d => d).attr("value", d => d);

//     let dropdown2 = d3.select("#Menu_2");
//     dropdown2.append("option").text("Select an inspection year").attr("value", "").property("selected", true);
//     dropdown2.selectAll("option:not(:first-child)").data(tickers).enter().append("option").text(d => d).attr("value", d => d);

//     document.getElementById('applyButton').addEventListener('click', function() {
//         // Retrieve values from dropdowns
//         var menu1Value = document.getElementById('Menu_1').value;
//         var menu2Value = document.getElementById('Menu_2').value;
    
//         // Check if both values are selected
//         if (menu1Value && menu2Value) {
//             // Call your function with the values
//             btnClicked(menu1Value, menu2Value);
//         } else {
//             alert('Please select values from both dropdowns before applying.');
//         }
//     });

// }).catch(error => {
//     console.error("Error fetching or parsing the data:", error);
// });


// function btnClicked(ticker, year) {
//     // Do something with the selectedValue
//     console.log("Selected values:", ticker, year);
    
//     // Any other logic you want to perform when the dropdown value changes
// }

// function option1Changed(selectedTicker) {
//     // Do something with the selectedValue
//     //console.log("Selected Value from menu 1:", selectedValue);
    
//     // Any other logic you want to perform when the dropdown value changes
//     if (jsonData) {
//         console.log("data length: ", jsonData.samples.length);
//     }
    
//     // First acquire the sample data from the selected ID
//     let sampleObject = {}; // Declare an empty object to hold the filtered content
//     let metadataObject;
//     for(let i = 0; i < jsonData.samples.length; i++){
//         // Filtering out the specific data
//         if((jsonData.samples)[i].id == selectedTicker){
//             // Obtain a sample from the list
//             sampleObject.sample_values = (jsonData.samples)[i].sample_values;
//             sampleObject.otu_ids = (jsonData.samples)[i].otu_ids;
//             sampleObject.otu_labels = (jsonData.samples)[i].otu_labels;
//             // Obtain the metadata
//             metadataObject = (jsonData.metadata)[i];
//             // console.log("selected sample: ", sampleObject);
//             break;            
//         }
//     }
//     console.log("sampleObject: ", sampleObject);
//     console.log("metadataObject: ", metadataObject);

//     // Update the "Demographic Info panel"
//     let panel = d3.select("#sample-metadata");
//     panel.html(""); // Clear any existing metadata
//     // Loop through each data entry in the object and append to panel
//     Object.entries(metadataObject).forEach(([key, value]) => {
//         panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
//     });
// }