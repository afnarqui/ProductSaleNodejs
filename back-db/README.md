## back-db

### Usage

``` js

import setupDatabase from 'back-db'

setupDatabase(config).then(db => {
    const { User, ShoppingCart } = db
}).catch(err => console.error(err))

```

``` js

npm init -y
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
npm install @babel/node -D
npm install -D nodemon

````

## connect postgres

```
docker exec -it 5370 psql -U postgres
npm i sequelize pg pg-hstore --save

```

## for create role and priveleges
```
docker exec -it psql psql -U postgres
CREATE ROLE afn WITH LOGIN PASSWORD 'afn';
CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres';
CREATE DATABASE sale;
CREATE DATABASE postgres;
GRANT ALL PRIVILEGES ON DATABASE sale TO afn;
GRANT ALL PRIVILEGES ON DATABASE postgres TO afn;
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;  
ssh -i "afnarqui-nodejs.pem" ec2-user@ec2-13-59-191-233.us-east-2.compute.amazonaws.com
\quit
\l

```

## install
```
npm i debug --save
npm i inquirer chalk --save
npm install --save-dev ava
npm install --save defaults
npm install -g --save-dev sqlite3
npm install --save-dev babel-register
npm install -g --save express
npm install -g http
npm install --save-dev supertest
npm i --save express-asyncify
npm install jsonwebtoken --save
npm install --save express-jwt
npm install --save json
npm install --save-dev nyc
npm i uuid --save
npm install request --save
npm install --save bluebird
```
## Bearer Token
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFmbmFycXVpIiwiaWF0IjoxNTU4OTE1NDEyfQ.uNPy_uOd2k6l4CvvjzCZudkPlylMVIliDDA6AViKM2w
```

## exec back
```
docker exec -it back bash
npm run setup
exit
docker exec -it psql psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;  
docker exec -it back bash
npm run start
```