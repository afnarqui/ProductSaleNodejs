import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function(req, res){
  res.sendfile('index.html')
});

let ports = 8004

const server = app.listen(ports,'0.0.0.0', () => {

    const {address, port} = server.address();

    console.log(`server running in the port: ${port}`);
});
