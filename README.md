[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Freetrees :evergreen_tree:

## About

Inspired by [New York City Street Tree Map](https://tree-map.nycgovparks.org/) and [Projeto Pró-Frutas Nativas](http://frutaspoa.inga.org.br/) de Porto Alegre this project has the intention to map fruit plants on the public roads of Porto Alegre and be extended for others cities.

So on, this project intends to provide information about the local flora and contribute to the local environmental education. 

Also, we believe that if you don't know your city, you cannot help to improve it, thus the data used on this application is free for general proposes and can be downloaded.

## Prerequisites

- Docker 18.03.1 or higher
- Docker Compose 1.21.2 or higher
- Python 3.4 or higher

## Getting Started

- Clone this repository
- Open the local repository folder on terminal and type the following command:

```
docker-compose up --build
```
- Then your are ready to access your freetrees app on:
```
www.localhost.com:3000
```

## Adding Trees

- There are an Python API on folder db, and you can use to access your database to add, delete and modify the trees.
 ```
user@your-machine:~directory/freetrees$ cd db
user@your-machine:~directory/freetrees$ python crud.py
```

## Tasking List

- Improve database API
	- [ ] Delete functions
	- [ ] Alternate functions
	- [ ] List functions
	- [ ] Count functions
- [ ] Create an Original Icon
- [ ] Develop search with Nominatim API

## Contributing

- Use images with credits to the photographs
