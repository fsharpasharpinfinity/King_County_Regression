# -*- coding: utf-8 -*-
import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
import json

data_path = './input/'

def get_price_segment(price):
    if price < 200000: return '200000'
    elif price < 400000: return '400000'
    elif price < 600000: return '600000'
    elif price < 800000: return '800000'
    elif price < 1000000: return '1000000'
    elif price < 1200000: return '1200000'
    elif price < 1400000: return '1400000'
    else: return '1400000+'

def get_basement_segment(price):
    if price < 200000: return '200000'
    elif price < 400000: return '400000'
    elif price < 600000: return '600000'
    elif price < 800000: return '800000'
    elif price < 1000000: return '1000000'
    elif price < 1200000: return '1200000'
    elif price < 1400000: return '1400000'
    elif price < 1400000: return '1600000'
    elif price < 1800000: return '1800000'
    elif price < 2000000: return '2000000'
    else: return '2000000+'

def get_living_segment(price):
    if price < 2000: return '2000'
    elif price < 4000: return '4000'
    elif price < 6000: return '6000'
    elif price < 8000: return '8000'
    elif price < 10000: return '10000'
    elif price < 12000: return '12000'
    else: return '12000+'

def get_lot_segment(price):
    if price < 2500: return '2500'
    elif price < 5000: return '5000'
    elif price < 7500: return '7500'
    elif price < 10000: return '10000'
    elif price < 15000: return '15000'
    elif price < 20000: return '20000'
    elif price < 25000: return '25000'
    elif price < 30000: return '30000'
    elif price < 35000: return '35000'
    elif price < 40000: return '40000'
    elif price < 45000: return '45000'
    elif price < 50000: return '50000'
    elif price < 100000: return '100000'
    else: return '100000+'

def get_main_floor_segment(price):
    if price < 1000: return '1000'
    elif price < 2000: return '2000'
    elif price < 3000: return '3000'
    elif price < 4000: return '4000'
    elif price < 5000: return '5000'
    elif price < 6000: return '6000'
    elif price < 7000: return '7000'
    elif price < 8000: return '8000'
    elif price < 9000: return '9000'
    else: return '9000+'

with open(data_path + '/kcs.csv') as data_file:
    df = pd.read_csv(data_file)
    df['price_segment'] = df['price'].apply(lambda price: get_price_segment(price))

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def get_data():
    return df.to_json(orient='records')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8000,debug=True)
