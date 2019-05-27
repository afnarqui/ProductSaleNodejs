# ProductSaleNode

[![N|Solid](https://res.cloudinary.com/drqk6qzo7/image/upload/v1558826432/api-1_wvbh4p.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

productSaleNodejs is a aplication, for save products and saleing. developed in Nodejs,Postgres, with docker and ec2

[Api rest](https://documenter.getpostman.com/view/7654104/S1TSYeSp?version=latest) documentation api rest

[trello](https://trello.com/b/D7zo270M) Trello

And of course ProductSaleNode itself is open source with a [public repository][afn]
 on GitHub.
 
## Usage

ProducSale requires 
[Node.js](https://nodejs.org/) v10+

[Docker](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

[Git](https://git-scm.com/downloads)

to run.

Install the dependencies and devDependencies previous
start the server.

## download
```sh
git clone https://github.com/afnarqui/ProductSaleNodejs.git
cd ProductSaleNodejs
docker-compose up --build
http://localhost:8004/

```

## exec back
```
docker exec -it back bash
npm run setup
exit
docker exec -it psql psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;  
\q
docker exec -it back bash
npm run start
```

## exec dockerhub
```
docker tag back-db_app afnarqui/productsalenode
docker push afnarqui/productsalenode
```

   [afn]: <https://github.com/afnarqui/ProductSaleNodejs>

   



