// 1. Read in the json sample data from the given url
const url = "https://raw.githubusercontent.com/elliszimmer/Project3_Group2/javascript-branch-A/final_dataset.json"             
//const filepath = "final_dataset.json"
let jsonData;
dataPromise = d3.json(url);
dataPromise.then(data => {
    console.log("JSON data: ", data);  // Logs the JSON data to the console
    // Here we are going to execute our sequence of routines
    jsonData = data;
    
    // Populate menu1 with tickers acquired from json dataset     
    let tickers = data.tickers;
    let firstAsALL = tickers[0];    
    tickers.splice(0,1);
    tickers.sort();
    tickers.unshift(firstAsALL);
    let dropdown1 = d3.select("#Menu_1"); // Select the dropdown element using D3
    // Append the default option
    dropdown1.append("option").text("Select a ticker symbol").attr("value", "").property("selected", true);
    // Populate the dropdown using D3's data join
    dropdown1.selectAll("option:not(:first-child)").data(tickers).enter().append("option").text(d => d).attr("value", d => d);

    // Populate menu2 with years acquired from json dataset
    let years = menu2dateList();
    // Select an option from Dropdown_menu_2 "year"
    let dropdown2 = d3.select("#Menu_2");
    dropdown2.append("option").text("Select an inspection year").attr("value", "").property("selected", true);
    dropdown2.selectAll("option:not(:first-child)").data(years).enter().append("option").text(d => d).attr("value", d => d);

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

// Execute the following function when the apply button is clicked
function btnClicked(ticker, year) {
    // Do something with the input parameters to test it works
    console.log("Selected values:", ticker, year);    
    // Execute a function for bubble chart using plotly 
    plotBubbleChart(sampleObject, selectedID);
}

// Populate company info when an option is selected from menu 1
function option1Changed(selectedTicker) {    
    // // Do something with the selectedValue
    // console.log("Selected Value from menu 1:", selectedTicker);
    
    // // Just testing if the data is accessible
    // if (jsonData) {
    //     console.log("tickers length: ", jsonData.tickers.length);
    //     console.log("company_info length", jsonData.company_info.length);
    //     console.log("stock_history length",jsonData.stock_history.length);
    // }
    
    // First acquire the sample data from the selected ID
    if(selectedTicker === "Select All"){
        console.log("All Company info is shown");
        displayAllLogos();
    }
    else{
        let sampleObject = {}; // Declare an empty object to hold the filtered content
        let companyMetaObject;
        let lengthCheck = 0;
        for(let i = 0; i < jsonData.company_info.length; i++){
            lengthCheck = i;
            // Filtering out the specific data        
            if((jsonData.company_info)[i].Ticker == selectedTicker){
                // Obtain a sample from the list
                // sampleObject.sample_values = (jsonData.samples)[i].sample_values;
                // sampleObject.otu_ids = (jsonData.samples)[i].otu_ids;
                // sampleObject.otu_labels = (jsonData.samples)[i].otu_labels;
                // Obtain the metadata
                companyMetaObject = (jsonData.company_info)[i];            
                // console.log("selected sample: ", sampleObject);
                break;            
            }
        }
        // We now check if the entire company_info list has been searched and nothing was found case
        if (lengthCheck === jsonData.company_info.length){
            console.log("Company info is not available");
        }
        else{
            // Update the "Company Info panel"
            let panel = d3.select("#company-metadata");
            panel.html(""); // Clear any existing metadata
            // Display company logo first
            if (companyMetaObject.LogoPath) {
                panel.append("img")
                    .attr("src", companyMetaObject.LogoPath)
                    .attr("alt", "Company Logo")
                    .attr("width", "50px") // set appropriate width
                    .attr("height", "50px"); // set appropriate height
            }
            // Loop through each data entry in the object and append to panel
            Object.entries(companyMetaObject).forEach(([key, value]) => {
                if(key !== "LogoPath"){
                    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
                }
            });
            console.log("companyMetaObject: ", companyMetaObject);
        }
    }    
    // console.log("sampleObject: ", sampleObject);    
}

// Populate Dropdown menu 2 
function menu2dateList(){
    // Extract the years and make sure they are unique using a Set
    let years = [...new Set((jsonData.stock_history)[0].dates.map(date => date.split("-")[0]))];
    console.log(years);
    return years;
}

// Populate all company info
function displayAllLogos() {
    company_list = [];
    // Obtaining the selected companies
    for(let i = 1; i < jsonData.tickers.length; i++){
        for(let j = 0; j < jsonData.company_info.length; j++){
            if((jsonData.tickers)[i] === (jsonData.company_info)[j].Ticker){
                //companyMetaObject.ticker = (jsonData.company_info[j]).Ticker;
                //companyMetaObject.company = (jsonData.company_info[j]).Company;
                //companyMetaObject.subsector = (jsonData.company_info[j]).Sub_sector;
                //companyMetaObject.headquarter = (jsonData.company_info[j]).Headquarters;
                companyMetaObject = (jsonData.company_info)[j];    
                break;
            }
        }
        company_list.push(companyMetaObject);
    }
    // List of ticker logo paths
    // const tickerLogoPaths = ['./Resources/AAPL.png',
    //                          './Resources/AMZN.png',
    //                          './Resources/ANSS.png',
    //                          './Resources/DXC.png',
    //                          './Resources/FFIV.png',
    //                          './Resources/GE.png',
    //                          './Resources/GOOGL.png',
    //                          './Resources/JNPR.png',
    //                          './Resources/KEYS.png',
    //                          './Resources/META.png',
    //                          './Resources/MSFT.png',
    //                          './Resources/MTD.png',
    //                          './Resources/NVDA.png',
    //                          './Resources/QRVO.png',
    //                          './Resources/SEDG.png',
    //                          './Resources/TSLA.png',
    //                          './Resources/ZBH.png'];

    // Update the "Company Info panel"
    let panel = d3.select("#company-metadata");
    panel.html(""); // Clear any existing metadata

    console.log("company_list: ", company_list);
    
    const scatterData = company_list.map((Ticker, idx) => {
        // Generate formatted info string for hover
        const hoverInfo = Object.entries(Ticker)
            .filter(([key]) => key !== 'LogoPath')
            .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
            .join('<br>');

        return {
            x: [idx % 3],  // Assuming 5 logos per row, change accordingly
            y: [Math.floor(idx / 3)],
            hovertext: hoverInfo,
            //hoverinfo: 'text',
            mode: 'markers',
            marker: {
                size: {size: 50, opacity: 0}, // Adjust size as needed
                symbol: `url(${encodePath(Ticker.LogoPath)})`
            }
        };
    });

    const layout = {
        margin: {
            l: 0,  // left margin
            r: 0,  // right margin
            b: 0,  // bottom margin
            t: 0   // top margin
        },
        autosize: true,
        xaxis: { 
            type: 'linear',
            visible: false,
            dtick: 0.5,
            range: [-0.5, 3-0.5]
        },
        yaxis: { 
            visible: false,
            dtick: 1,
            range: [-0.5, 6-0.5] 
        },
        showlegend: false,
        hovermode: 'closest'
    };

    Plotly.newPlot('company-metadata', scatterData, layout);
    console.log(scatterData);

}
function encodePath(path) {
    return encodeURIComponent(path);
}

// Create a bubble chart that displays each sample.
// function plotBubbleChart(sampleObject, selectedID) {
//     let trace = {
//         x: sampleObject.otu_ids,
//         y: sampleObject.sample_values,
//         text: sampleObject.otu_labels,
//         mode: 'markers',
//         marker: {
//             size: sampleObject.sample_values, // To set size based on the value in the 'sample_values' array
//             color: sampleObject.otu_ids, // To set color based on OTU ID
//             colorscale: 'Portland',  // Colorscale
//             sizemode: 'diameter'  // Sizemode as diameter
//         }
//     };

//     let layout = {
//         title: `Bubble Chart for id: ${selectedID}`,
//         showlegend: false,
//         height: 600,
//         width: 1200,
//         xaxis: { title: "OTU IDs" },
//     };

//     Plotly.newPlot("bubble", [trace], layout);
// }