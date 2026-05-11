const IPFS = require('ipfs-api');

const ipfs = new IPFS({
  host: process.env.IPFS_HOST || 'localhost',
  port: parseInt(process.env.IPFS_PORT, 10) || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https'
});

export default ipfs;