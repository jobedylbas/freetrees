#!/usr/bin/env python3

import sys
import json
import urllib.parse
import getpass
import datetime
import pprint
from pymongo import *

# Global variables
defaultUri = 'mongodb://localhost:27017'
defaultDatabase = 'freetrees'
localCol = 'locals'
infoCol = 'plantsinfo'


def menu():
	print("1. Insert Tree\n2. Insert type\n3. Delete Tree Type\n3. Drop Database\n4. Drop Collection\n5. Switch Database\n6. Count\n\n7.Exit")
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

def create_tree():
	new_tree = {}
	new_tree['name'] = input('Tree name: ')
	new_tree['lat'] = float(input('Tree lattitude: '))
	new_tree['long'] = float(input('Tree longitude: '))
	new_tree['addres'] = input('Tree addres: ')
	new_tree['date'] = str(datetime.datetime.now())
	new_tree['color'] = input('Color: ')
	pprint.pprint(new_tree)
	return new_tree

def create_tree_type():
	new_type = {}
	new_type['name'] = input('Tree name: ')
	new_type['cientific_name'] = input('Cientifc name: ')
	new_type['harvesttime'] = input('Harvest time: ')
	new_type['link'] = input('Wiki url: ')
	return new_type

def insert_type(db):
	coll = db[infoCol]
	tree_type = create_tree_type()
	if(coll.find_one(tree_type)):
		print('Failed to add this tree. This tree already exists.')
		return
	else:
		pprint.pprint(tree_type)
		insert_doc(coll, tree_type)
		return

def delete_type(db):
	coll = db[infoCol]
	tree_name = input('Tree name: ')
	if(coll.find_one({'name': tree_name}) != None):
		ans = input('Are u sure to delete this type? [y/N]').lower()
		if(ans == 'y'):
			try:
				coll.remove({'name': tree_name})
				print('Document removed.\n')
			except:
				print('Failed to reomve document.')
	return

def insert_tree(db):
	coll = db[localCol]
	tree = create_tree()
	if(coll.find_one(tree)):
		print('Failed to add this tree. This tree already exists.')
		return
	else:
		pprint.pprint(tree)
		insert_doc(coll, tree)
		return	

def insert_doc(coll, doc):
	try:
		_id = coll.insert_one(json.loads(json.dumps(doc))).inserted_id		
		print('Document inserted. ID = '+ str(_id))
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
		elif(exit == 2):
			insert_type(database)
		elif(exit == 3):
			delete_type(database)
	die(connection)