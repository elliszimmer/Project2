// 1. Read in the json sample data from the given url
const url = "https://raw.githubusercontent.com/tnguy25/S_P500-Market_Analyst/main/final_dataset_1.json";
let jsonData;
dataPromise = d3.json(url);
dataPromise.then(data => {
    //console.log("JSON data: ", data);  // Logs the JSON data to the console
    // Here we are going to execute our sequence of routines
    jsonData = data;
    let tickers = data.tickers;
    let yearRunning = data.year;
    let dropdown1 = d3.select("#Menu_1"); // Select the dropdown element using D3
    // Append the default option
    dropdown1.append("option").text("Select a ticker symbol").attr("value", "").property("selected", true);
    // Populate the dropdown using D3's data join
    dropdown1.selectAll("option:not(:first-child)").data(tickers).enter().append("option").text(d => d).attr("value", d => d);

    let dropdown2 = d3.select("#Menu_2");
    dropdown2.append("option").text("Select an inspection year").attr("value", "").property("selected", true);
    dropdown2.selectAll("option:not(:first-child)").data(yearRunning).enter().append("option").text(d => d).attr("value", d => d);

    document.getElementById('applyButton').addEventListener('click', function() {
        // Retrieve values from dropdowns
        var menu1Value = document.getElementById('Menu_1').value;
        var menu2Value = document.getElementById('Menu_2').value;
    
        // Check if both values are selected
        if (menu1Value && menu2Value) {
            // Call your function with the values
            btnClicked(menu1Value, menu2Value);
        } else {
            alert('Please select values from both dropdowns before applying.');
        }
    });
 })//.catch(error => {
//     console.error("Error fetching or parsing the data:", error);
// });


function btnClicked(ticker, year) {
    // Do something with the selectedValue
    console.log("Selected values:", ticker, year);
    
    // Any other logic you want to perform when the dropdown value changes
    getBarChart(ticker, year, jsonData)
}

function option1Changed(selectedTicker) {
    // Do something with the selectedValue
    //console.log("Selected Value from menu 1:", selectedValue);
    
    // Any other logic you want to perform when the dropdown value changes
    if (jsonData) {
        console.log("data length: ", jsonData.company_info.length);
    }
    
    // First acquire the sample data from the selected ID
    let sampleObject = {}; // Declare an empty object to hold the filtered content
    let testObject = {};
    let metadataObject;
    for(let i = 0; i < jsonData.company_info.length; i++){
        // Filtering out the specific data
        if((jsonData.company_info)[i].Ticker == selectedTicker){
            // Obtain a sample from the list
            sampleObject.company = (jsonData.company_info)[i].Company;
            sampleObject.headquarters = (jsonData.company_info)[i].Headquarters;
            sampleObject.founded = (jsonData.company_info)[i].founded;
            // Obtain the metadata
            metadataObject = (jsonData.company_info)[i];
            // console.log("selected sample: ", sampleObject);
            break;            
        }
    }
    console.log("sampleObject: ", sampleObject);
    console.log("metadataObject: ", metadataObject);

    // Update the "Demographic Info panel"
    let panel = d3.select("#sample-metadata");
    panel.html(""); // Clear any existing metadata
    // Loop through each data entry in the object and append to panel
    Object.entries(metadataObject).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    for (let j = 0; j < jsonData.stock_history.length; j++){
        if ((jsonData.stock_history)[j].ticker == selectedTicker){
            testObject.dates = (jsonData.stock_history)[j].dates;
            testObject.close = (jsonData.stock_history)[j].close;
        }
    get5YearLineChart(testObject)    
    }
}

function get5YearLineChart(data){
    let x_dates = data.dates;
    let y_close = data.close

    let xdata = y_close
    let ydata = x_dates

    let tracedata = [{
        x: ydata,
        y: xdata,
        type:"line",
        //orientation: 'h'
    }]
    let layout = {
        title: "10 Dates",
    }
    Plotly.newPlot("plot", tracedata, layout)
}

function getBarChart(ticker, year, data){
    let testObject = {};
    let datelist = [];
    let volumelist = [];
    let closelist = [];
    for (let j = 0; j < data.stock_history.length; j++){
        if ((data.stock_history)[j].ticker == ticker){
            for (let k = 0; k < (data.stock_history)[j].dates.length; k++){
                if ((((data.stock_history)[j].dates)[k].slice(0,4)) == year){
                    datelist.push(((data.stock_history)[j].dates)[k]);
                    volumelist.push(((data.stock_history)[j].volume)[k]);
                    closelist.push(((data.stock_history)[j].volume)[k]);
                }
            }
        }
}
    testObject.dates = datelist;
    testObject.volume = volumelist;
    testObject.close = closelist;
    console.log(testObject)

    drawBarChart(testObject, year)
    drawLineChart(testObject, year)
}

function drawBarChart(data, year){
    let xdata = data.dates;
    let ydata = data.volume;

    let tracedata = [{
        x: ydata,
        y: xdata,
        type:"bar",
        orientation: "h"
    }]
    let layout = {
        title: `${year} data`
    }
    Plotly.newPlot("plot", tracedata, layout)
}

function drawLineChart(data, year){
    let xdata = data.dates;
    let ydata = data.close;

    let tracedata = [{
        x: xdata,
        y: ydata,
        type:"line",
        //orientation: 'h'
    }]
    let layout = {
        title: `${year} Line`,
    }
    Plotly.newPlot("line", tracedata, layout)
}