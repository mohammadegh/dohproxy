import http from 'http';

// A simple valid DNS query in binary format (querying for www.example.com A record)
const dnsQuery = Buffer.from([
    0x00, 0x00, // Transaction ID
    0x01, 0x00, // Flags (standard query)
    0x00, 0x01, // Questions: 1
    0x00, 0x00, // Answer RRs: 0
    0x00, 0x00, // Authority RRs: 0
    0x00, 0x00, // Additional RRs: 0
    // Query: www.example.com
    0x03, 0x77, 0x77, 0x77, // www
    0x07, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, // example
    0x03, 0x63, 0x6f, 0x6d, // com
    0x00, // null terminator
    0x00, 0x01, // Type: A
    0x00, 0x01  // Class: IN
]);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/dns-message',
        'Content-Length': dnsQuery.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    const chunks = [];
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });

    res.on('end', () => {
        const response = Buffer.concat(chunks);
        console.log(`Response length: ${response.length} bytes`);
        console.log('Response (hex):', response.toString('hex').substring(0, 100), '...');
        console.log('\n✅ POST DNS wireformat test successful!');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(dnsQuery);
req.end();
