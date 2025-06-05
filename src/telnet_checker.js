const fs = require('fs');
const csv = require('csv-parser');
const net = require('net');
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: 'localhost',
  user: 'guest',
  password: '1111',
  database: 'mydb',
};

async function insertResult(db, ip, port, isConnected) {
  const query = `
    INSERT INTO telnet_results (server_ip, port, is_connected)
    VALUES (?, ?, ?)
  `;
  await db.execute(query, [ip, port, isConnected]);
}

async function checkPort(ip, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, ip);
  });
}

async function run() {
  const db = await mysql.createConnection(DB_CONFIG);
  const results = [];

  fs.createReadStream('servers.csv')
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      for (const row of results) {
        const ip = row.server_ip;
        const port = parseInt(row.port, 10);

        const isConnected = await checkPort(ip, port);
        console.log(`Checked ${ip}:${port} - ${isConnected ? 'Connected' : 'Failed'}`);

        await insertResult(db, ip, port, isConnected);
      }

      await db.end();
      console.log('All checks completed and saved to DB.');
    });
}

run().catch(console.error);
