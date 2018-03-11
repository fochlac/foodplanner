#!/usr/bin/env node

const express = require('express'),
  app = express(),
  http = require('http'),
  router = require(process.env.FOOD_HOME + 'router'),
  server_port = process.env.FOOD_PORT,
  server_ip_address = 'localhost',
  server = http.createServer(app)

server.listen(server_port, server_ip_address, () => {
  console.log('listening on http://' + server_ip_address + ':' + server_port)
})

app.use(router)

// load scheduler
scheduler.init()
