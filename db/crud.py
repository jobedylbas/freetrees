#!/usr/bin/env python3

import sys
import json
import urllib.parse
import getpass
import datetime
import pprint
from pymongo import *

# Global variables

# Colors 
# Structure Key: HTML value # Example
colors = {
	'orange':'#FFA500', # Orange
	'purple': '#800080', # Grape
	'tomato': '#FF6347', # Guava
	'red': '#FF0000', # Strawberry
	'darkred': '#8B0000', # Pitanga
	'limegreen': '#32CD32', # Lemon
	'green': '#008000', # Generic
	'darkgreen': '#006400', # Another Generic
	'gold': '#FFD700', # Lime
	'saddlebrown': '#8B4513', # Kiwi
	'hotpink': '#FF69B4' # Dragon Fruit
}

# In release delete this
defaultUri = 'mongodb://localhost:27017'
defaultDatabase = 'freetrees'
localCol = 'locals' # Responsable to keep all trees in the city
infoCol = 'plantsinfo' # Responsable to keep the information about the city species


def menu():
	print("1. Insert Tree\n2. Create specie\n3. Drop Database\n4. Drop Collection\n5. Switch Database\n6. Count\n\n7.Exit")
	option = int(input("Select the option: "))
	while(option not in range(1,7+1)):
		option = int(input('Error: Invalid option.\nDigit a valid option: '))
	return option

def db(conn):
	try:
		return conn[input('Database: ')]
	except:
		print('Failed to connect to database')
		exit(1)

def die(conn):
	try:
		conn.close()
	except:
		pass
	sys.exit()	

def client(string):
	# To auth
	# user = input('Username: ')
	# user = urllib.parse.quote_plus(user)
	# psw = getpass.getpass('Password: ')
	# psw = urllib.parse.quote_plus(psw)
	try:
		client = MongoClient(string)
		# client = MongoClient('mongodb://%s:%s@%s' % (user, psw, string))
		print('Connection stablished.')
		return client

	except:
		print("Failed to connect to MongoDB.")
		sys.exit()

def create_specie():
	new_specie = {}
	new_specie['name'] = input('Specie popular name: ')
	new_specie['sciname'] = input('Cientific name: ')
	new_specie['harvestseason'] = input('Harvest season: ')
	new_specie['url'] = input('Wiki URL: ')
	new_specie['date'] = str(datetime.datetime.now())

	pprint.pprint(new_specie)
	return new_specie

def create_tree():
	new_tree = {}
	new_tree['name'] = input('Tree name: ')
	new_tree['lat'] = float(input('Tree lattitude: '))
	new_tree['long'] = float(input('Tree longitude: '))
	colorName = input('Color: ')
	while colorName not in colors.keys():
		print('Suported colors: ')
		for color in colors.keys():
			print(color)
		colorName = input('Color: ')
	new_tree['color'] = colors[colorName]
	pprint.pprint(new_tree)
	return new_tree

def insert_tree(db):
	localColl = db[localCol]
	tree = create_tree()
	specieColl = db[infoCol]
	if specieColl.find_one({'name': tree['name']}):
		if(localColl.find_one(tree)):
			print('Failed to add this tree. This tree already exists.')
			return
		else:
			insert_doc(localColl, tree)
			return
	else:
		print('This Specie was not created yet. Please create now')	
		try:
			insert_specie(db)
			insert_doc(localColl, tree)
			return
		except:
			print('Failed to insert tree or specie.')
			return

def insert_specie(db):
	specie = create_specie()
	specieColl = db[infoCol]
	if specieColl.find_one(specie):
		print('Failed to add this specie. This specie already exists.')
		return
	else:
		insert_doc(specieColl, specie)
		return

def insert_doc(coll, doc):
	try:
		_id = coll.insert_one(json.loads(json.dumps(doc))).inserted_id		
		print('Document inserted at {}. ID = {}'.format(coll, str(_id)))
		return
	except:
		print('Failed to insert in database.')
		return

def conn():
	try:
		connection = client(defaultUri)
		print('MongoDB connected.')
		return connection
	except:
		print("Failed to connect to MongoDB.")
		sys.exit()

def db(conn):
	try:
		db = conn[defaultDatabase]
		print('Database switched.')
		return db
	except:
		print('Failed to switch to database')
		die(conn)

if __name__ == '__main__':
	
	exit = 0
	
	connection = conn()

	database = db(connection)

	while(exit != 7):
		exit = menu()
		if(exit == 1):
			insert_tree(database)
		elif(exit == 3):
			try:
				connection.drop_database(defaultDatabase)
				print('Database dropped with success.')
			except:
				print('Error when drop database.')
	die(connection)