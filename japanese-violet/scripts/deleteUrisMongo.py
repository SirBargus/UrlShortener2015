# -*- encoding: utf-8 -*-
from pymongo import MongoClient
#Instalar pymongo: pip install pymongo

client = MongoClient("mongodb://iweb:iweb@ds057204.mongolab.com:57204/iweb")
db = client.raven
db.uris.delete_many({});
print "Delete Uris"
