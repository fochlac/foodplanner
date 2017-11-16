#!/usr/bin/env node

const   express = require('express')
    ,   app = express()
    ,   bodyparser = require('body-parser')
    ,   compression = require('compression')
    ,   xssFilter = require('x-xss-protection')
    ,   https = require('https')
    ,   fs = require('fs')
    ,   routes = require(process.env.FOOD_HOME + 'routes')
    ,   scheduler = require(process.env.FOOD_HOME + 'modules/scheduler')
    ,   server_port = process.env.FOOD_PORT
    ,   server_ip_address = 'localhost'
    ,   sslServer = https.createServer({
            key: fs.readFileSync(process.env.KEYSTORE + 'fochlac_com_key.pem'),
            cert: fs.readFileSync(process.env.KEYSTORE + 'fochlac_com_cert_chain.pem')
        }, app)
    ,   index = fs.readFileSync(process.env.FOOD_CLIENT + 'index.html');

sslServer.listen(server_port, server_ip_address, () => {
    console.log('listening on port '+ server_port);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(compression());
app.use(xssFilter());
app.set('x-powered-by', false);

// connect router
app.use('/', routes);

// if not connected to a route, deliver static content
app.use('/static/', express.static(process.env.FOOD_CLIENT + ''));

// if no route and no static content, redirect to index
app.get('*', (req, res) => res.status(200).sendFile(process.env.FOOD_CLIENT + 'index.html'));

// load scheduler
scheduler.init();