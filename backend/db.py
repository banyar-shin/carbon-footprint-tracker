from pymongo import MongoClient
from mongopass import mongopass

client = MongoClient(mongopass)
db = client.curd
myCollection = db.myColl