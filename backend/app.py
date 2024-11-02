from flask import Flask, render_template, request

import subprocess as sp
from pymongo import MongoClient
from mongopass import mongopass

app = Flask("CFTbackend")

client = MongoClient(mongopass)
db = client.curd
myCollection = db.myColl


@app.route("/")
def home():
    return "It works!"


app.run(port=5000, debug=True)
