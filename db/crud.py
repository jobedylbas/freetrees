#!/usr/bin/env python3

import sys
import json
import urllib.parse
import getpass
import datetime
import pprint
from pymongo import *

def menu():
	print("1. Insert Tree\n2. Delete Tree\n3. Drop Database\n4. Drop Collection\n5. Switch Database\n6. Count\n7.Exit")
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

def conn(string):
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
	new_tree['type'] = input('Tree type: ')
	while(new_tree['type'] not in ['medicinal', 'fruit']):
		new_tree['type'] = input('Wrong type, try again: ')
	new_tree['lat'] = float(input('Tree lattitude: '))
	new_tree['long'] = float(input('Tree longitude: '))
	new_tree['addres'] = input('Tree addres: ')
	new_tree['harvesttime'] = input('Harvest time: ')
	new_tree['link'] = input('Wiki url: ')
	new_tree['date'] = str(datetime.datetime.now())
	pprint.pprint(new_tree)
	return new_tree

def insert_tree(coll, tree):
	try:
		_id = coll.insert_one(json.loads(json.dumps(tree))).inserted_id		
		print('Tree inserted. ID = '+ str(_id))
		return
	except:
		print('Failed to insert in database.')
		die(client)

if __name__ == '__main__':
	
	exit = 0
	connection= conn(input('Database URI: '))

	try:
		db = connection[input('Please switch to a valid database: ')]
		print('Database switched')
	except:
		print('Failed to connect to database')
		die(connection)

	try:
		coll = db[input('Please switch to a valid collection: ')]
		print('Collection switched.')
	except:
		print('Failed to switch collection.')
		die(connection)

	while(exit != 7):
		exit = menu()
		if(exit == 1):
			tree = create_tree()
			insert_tree(coll, tree)
		elif(exit == 2):
			if(connection.admin.command('ismaster')['ismaster'] == True):
				doc = input('ID or Lat,Long: ')
				try: 
					lat = int(doc.split(',')[0])
					lon = int(doc.split(',')[1])
					try:
						# Find doc by id
						obj = coll.find_one({"lat": lat, "long": lon})
						if(obj != None):
							opt = input('Document found.\nShow document? [Y,n]').lower()
							if(opt == 'y' or opt == 'yes'):
								pprint.pprint(coll.find_one(obj))
							opt = input('Are you sure to delete this document? [y, N]')
							if (opt == 'y' or opt == 'yes'):
								try:
									_id = coll.delete_one({"lat": lat, "long": lon})
									print('Document deleted. ID =' + str(_id))
								except:
									print('Error on delete document.')
							else:
								print('Document not deleted.')
					except:
						print('Error while finding the document')
				except:
					try:
						# Find doc by id
						obj = coll.find_one({"_id": doc})
						opt = input('Document found.\nShow document? [Y,n]').lower()
						if(opt == 'y' or opt == 'yes'):
							pprint.pprint(coll.find_one({"_id": doc}))
						opt = input('Are you sure to delete this document? [y, N]')
						if (opt == 'y' or opt == 'yes'):
							try:
								_id = coll.delete_one({"_id": doc})
								print('Document deleted. ID =' + str(_id))
							except:
								print('Error on delete document.')
						else:
							print('Document not deleted.')
					except:
						print('Error while finding the document')
		elif(exit == 3):
			if(connection.admin.command('ismaster')['ismaster'] == True):
				db_name = input('Database name: ')
				drop = input('Are you sure to drop database? [y,N]').lower()
				if( drop == 'y' or drop == 'yes'):
					try:
						connection.drop_database(db_name)
						print('Database dropped.')
					except:
						print('Failed to drop database.')
						die(connection)
				else:
					print('Database not dropped.')
			else:
				print('You\'re not authorized to this operation.') 
		elif(exit == 4):
			if(connection.admin.command('ismaster')['ismaster'] == True):
				coll_name = input('Collection name: ')
				drop = input('Are you sure to drop collection? [y,N]').lower()
				if( drop == 'y' or drop == 'yes'):
					try:
						connection.drop_collection(coll_name)
						print('Collection dropped.')
					except:
						print('Failed to drop collection.')
						die(connection)
				else:
					print('Collection not dropped.')
			else:
				print('You\'re not authorized to this operation.') 
		elif(exit == 5):
			try:
				db = connection[input('Database name: ')]
				print('Database Switched')
			except:
				print('Failed to switch database.')
				die(connection)
		elif(exit == 6):
			try:
				print(coll.count())
			except:
				pass
		else:
			die(connection)
	die(connection)
