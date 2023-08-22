# Import the dependencies.
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
import datetime as dt
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///../Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Base.classes.keys()
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# This is the implementation of the homepage
@app.route("/")
def homepage():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start>  (Construct URL with a start date: .../api/v1.0/YYYY-MM-DD)<br/>"
        f"/api/v1.0/<start>/<end>  (Construct URL with start and end dates: .../api/v1.0/YYYY-MM-DD/YYYY-MM-DD) <br/>"        
    )

# This is the implementation of the precipitation functionalities
@app.route("/api/v1.0/precipitation")
def precipitation():
    # Calculate the date one year ago from the latest date in the database    
    past_date = obtain_past_date()

    # Query the Measurement table for data within the last year
    results = session.query(Measurement).filter(Measurement.date >= past_date).order_by(Measurement.date.desc()).all()
    session.close()
    
    # Create a dictionary from the row data and append to a list of one_yr_prcp_data
    one_yr_prcp_data = []
    for result in results:
        one_yr_prcp_data.append({'date': result.date,                          
                                 'prcp': result.prcp                          
        })
    
    # Return the JSON representation of your dictionary
    return jsonify(one_yr_prcp_data)

# Implementing JSON list of stations
@app.route("/api/v1.0/stations")
def stations():
    query_stations = session.query(Station.station).all()
    query_stations = list(query_stations)
    session.close()
    return jsonify(query_stations)

# Implementing Temperature observations
@app.route("/api/v1.0/tobs")
def tobs():
    # Calculate the date one year ago from the latest date in the database    
    past_date = obtain_past_date()

    # First group by station id and then order by frequency
    grouped_by_station_id = session.query(Measurement.station, func.count(Measurement.station)).\
                                          group_by(Measurement.station).\
                                          order_by(func.count(Measurement.station).desc()).all()
    
    # And then select the most_active station and filter out all measurements against it
    filtered_by_most_active = session.query(Measurement.tobs).filter(Measurement.station == grouped_by_station_id[0][0]).filter(Measurement.date >= past_date).all()
    session.close()

    one_yr_tobs_data = []
    for result in filtered_by_most_active:
        one_yr_tobs_data.append({#'date': result.date,                          
                                 'tobs': result.tobs                          
        }) 
    
    # Return the JSON representation of your dictionary
    return {"most_active_station_id": grouped_by_station_id[0][0],
            "one_yr_tobs_data": one_yr_tobs_data}

# Implementing start date
@app.route("/api/v1.0/<start>")
def temperature_analysis_s(start):
    # Query the Measurement table for temperatures greater than or equal to the start date
    results = session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(Measurement.tobs)).\
              filter(Measurement.date >= start).all()

    # Extract the temperature statistics from the results
    TMIN = results[0][0]
    TMAX  = results[0][1]
    TAVG = results[0][2]

    # Create a dictionary to hold the temperature statistics
    temperature_stats = {
        'start_date': start,
        'TMIN': TMIN,
        'TMAX': TMAX,
        'TAVG': TAVG
    }
    
    # Return the JSON representation of the temperature statistics
    return jsonify(temperature_stats)

# Implementing start and end date
@app.route("/api/v1.0/<start>/<end>")
def temperature_analysis_se(start, end):
    # Query the Measurement table for temperatures within the start and end date range
    results = session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(Measurement.tobs)).\
              filter(Measurement.date >= start).filter(Measurement.date <= end).all()

    # Extract the temperature statistics from the results
    TMIN = results[0][0]
    TMAX = results[0][1]
    TAVG = results[0][2]

    # Create a dictionary to hold the temperature statistics
    temperature_stats = {
        'start_date': start,
        'end_date': end,
        'TMIN': TMIN,
        'TMAX': TMAX,
        'TAVG': TAVG
    }
    
    # Return the JSON representation of the temperature statistics
    return jsonify(temperature_stats)

# Calculate the date one year ago from the latest date in the database (repeated functionality)
def obtain_past_date():    
    latest_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    latest_date = dt.datetime.strptime(latest_date.date, '%Y-%m-%d').date()
    past_date = latest_date - dt.timedelta(days=365)
    return past_date

if __name__ == '__main__':
    app.run(debug=True)
