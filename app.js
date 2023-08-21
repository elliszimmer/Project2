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
 }).catch(error => {
     console.error("Error fetching or parsing the data:", error);
 });


function btnClicked(ticker, year) {
    // Do something with the selectedValue
    console.log("Selected values:", ticker, year);
    
    // Any other logic you want to perform when the dropdown value changes
    getAllData(ticker, year, jsonData)
}

function option1Changed(selectedTicker) {
    if (selectedTicker == null) {
        let panel = d3.select("#sample-metadata");
        panel.html(""); // Clear any existing metadata
    }
    else {
    // Do something with the selectedValue
    //console.log("Selected Value from menu 1:", selectedValue);
    
    // Any other logic you want to perform when the dropdown value changes
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

    let reset_bar = d3.select("#bar");
    reset_bar.html("");
    let reset_line = d3.select("#line");
    reset_line.html("");
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
}

function option2Changed(year) {
    testObject = {}
    tradingVolume = 0;
    count = 0;
    avgTradingVolume_list = []
    //console.log(((jsonData.stock_history)[0].dates)[0])
    for (let i = 0; i < jsonData.tickers.length; i++){
        ticker = (jsonData.tickers)[i];
        if ((jsonData.stock_history)[i].ticker == ticker){
            for (let j = 0; j < (jsonData.stock_history)[i].dates.length; j++){
                if ((((jsonData.stock_history)[i].dates)[j].slice(0,4)) == year.toString()){
                    tradingVolume += ((jsonData.stock_history)[i].volume)[j];
                    count += 1;
                }
            }
        }
        avgTradingVolume_list.push(tradingVolume/count)
        tradingVolume = 0;
        count = 0;
    }
    get5YearBarChart(avgTradingVolume_list, year)
}

function get5YearLineChart(data){
    let reset_bar = d3.select("#bar");
    reset_bar.html("");
    let reset_line = d3.select("#line");
    reset_line.html("");
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
        title: "5 Year Closing Values",
    }
    Plotly.newPlot("line", tracedata, layout)

}

function get5YearBarChart(data, year){
    let reset_bar = d3.select("#bar");
    reset_bar.html("");
    let reset_line = d3.select("#line");
    reset_line.html("");
    let xdata = data;
    let ydata = jsonData.tickers;

    let tracedata = [{
        x: xdata,
        y: ydata,
        type: "bar",
        orientation: "h"
    }]
    let layout = {
        title: `${year} Average Trading Volume of IT Section`
    }
    Plotly.newPlot("bar", tracedata, layout)
}

function getAllData(ticker, year, data){
    let testObject = {};
    let datelist = [];
    let volumelist = [];
    let closelist = [];
    let difflist = [];
    let openlist = [];
    let highlist = [];
    let lowlist = [];
    for (let j = 0; j < data.stock_history.length; j++){
        if ((data.stock_history)[j].ticker == ticker){
            for (let k = 0; k < (data.stock_history)[j].dates.length; k++){
                if ((((data.stock_history)[j].dates)[k].slice(0,4)) == year){
                    datelist.push(((data.stock_history)[j].dates)[k]);
                    volumelist.push(((data.stock_history)[j].volume)[k]);
                    closelist.push(((data.stock_history)[j].close)[k]);
                    difflist.push((((data.stock_history)[j].close)[k]) - (((data.stock_history)[j].open)[k]))
                    openlist.push(((data.stock_history)[j].open)[k]);
                    highlist.push(((data.stock_history)[j].high)[k]);
                    lowlist.push(((data.stock_history)[j].low)[k]);
                }
            }
        }
}
    testObject.dates = datelist;
    testObject.volume = volumelist;
    testObject.close = closelist;
    testObject.stock_diff = difflist;
    testObject.open = openlist;
    testObject.high = highlist;
    testObject.low = lowlist;
    console.log(testObject)

    drawBarChart(testObject, year)
    drawLineChart(testObject, year)
    drawCandleStick(testObject, year)
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
        title: `${year} Trading Volume`
    }
    Plotly.newPlot("bar", tracedata, layout)
}

function drawLineChart(data, year){
    let xdata = data.dates;
    let ydata = data.close;
    let odata = data.open;
    let zdata = data.stock_diff;
    let colorlist = []
    for (let i = 0; i < zdata.length; i++){
        if (zdata[i] < 0){
            colorlist.push("red");
        }
        else{
            colorlist.push("green");
        }
    }

    let trace1 = {
        x: xdata,
        y: ydata,
        type: 'line',
        name: 'Closing Price'
        //orientation: 'h'
    };
    let trace2 = {
        x: xdata,
        y: odata,
        type: 'line',
        name: 'Opening Price'
    }
    let trace3 = {
        x: xdata,
        y: zdata,
        type: 'bar', 
        name: 'Pricing Gap',
        marker: {
            color: colorlist,
        }
    };

let tracedata = [trace1, trace2, trace3];
    let layout = {
        title: `Stock Movement of ${year}`
    }
    Plotly.newPlot("line", tracedata, layout)
}

function drawCandleStick(data, year){
    let tracedata = [{
        x: data.dates,
        close: data.close,
        decreasing: {line: {color: 'red'}},
        high: data.high,
        increasing: {line: {color: 'green'}},
        line: {color: 'rgba(31,119,180,1)'},
        low: data.low,
        open: data.open,
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y'
    }];

    let layout = {
        dragmode: 'zoom',
        margin: {
            r: 10,
            t: 25,
            b: 40,
            l: 60
        },
        showlegend: false,
        xaxis: {
            autorange: true,
            domain: [0, 1],
            title: 'Date',
            type: 'date',
            // rangeslider: {
            //     visible: false
            // }
        },
        yaxis:{
            autorange: true,
            domain: [0, 1],
            type: 'linear'
        },
        title: `Stock Movement Candlestick Representation of Year ${year}`
    }
    Plotly.newPlot('candlestick', tracedata, layout)
}
