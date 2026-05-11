# 🔧 Fixes Applied

**Total:** 21 fixes | **Files:** 7 | **Date:** 2026-05-11

## `controllers/candidate.js`

**1. Replace hardcoded email with environment variable process.env.EMAIL_USER**
Before: `user: st@gmail.com,`
After: `Replace hardcoded email with environment variable process.env.EMAIL_USER`
Add to .env: `HARDCODED_EMAIL_CREDENTIAL_(USERNAME)=your_value_here`

**2. Replace hardcoded password with environment variable process.env.EMAIL_PASS**
Before: `pass: SThifn@94840mdia,`
After: `Replace hardcoded password with environment variable process.env.EMAIL_PASS`
Add to .env: `HARDCODED_EMAIL_CREDENTIAL_(PASSWORD)=your_value_here`

**3. Add email validation before using user input**
Before: `to: req.body.email,`
After: `Add email validation before using user input`

**4. Sanitize user input before including in HTML content**
Before: `html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',`
After: `Sanitize user input before including in HTML content`

**5. Sanitize user input to remove newlines and special characters**
Before: `subject: req.body.election_name + 'Registration',`
After: `Sanitize user input to remove newlines and special characters`

## `Ethereum/deploy.js`

**6. Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC**
Before: `'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'`
After: `Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC`
Add to .env: `HARDCODED_MNEMONIC_SEED_PHRASE=your_value_here`

**7. Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct URL using process.env.INFURA_API_KEY**
Before: `'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'`
After: `Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct URL using`
Add to .env: `HARDCODED_INFURA_API_KEY=your_value_here`

## `config/database.js`

**8. Replace hardcoded connection string with environment variable process.env.MONGODB_URI**
Before: `const mongoDB = 'mongodb://localhost/BlockVotes';`
After: `Replace hardcoded connection string with environment variable process.env.MONGODB_URI`
Add to .env: `HARDCODED_MONGODB_CONNECTION_STRING=your_value_here`

**9. Add proper error handling with try/catch or connection event listeners, and update deprecated options**
Before: `mongoose.connect(mongoDB,{ useNewUrlParser: true });`
After: `Add proper error handling with try/catch or connection event listeners, and update deprecated option`

## `Ethereum/election_factory.js`

**10. Replace hardcoded contract address with environment variable reference (process.env.ELECTION_FACTORY_ADDRESS)**
Before: `'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'`
After: `Replace hardcoded contract address with environment variable reference (process.env.ELECTION_FACTORY`
Add to .env: `HARDCODED_ETHEREUM_CONTRACT_ADDRESS=your_value_here`

## `server.js`

**11. Add helmet middleware to set secure HTTP headers**
Before: `const express = require('express');`
After: `Add helmet middleware to set secure HTTP headers`

**12. Add express-rate-limit middleware to limit request rates**
Before: `exp.get('/', function (req, res) {`
After: `Add express-rate-limit middleware to limit request rates`

**13. Replace hardcoded port with process.env.PORT**
Before: `exp.use(handler).listen(3000, function () {`
After: `Replace hardcoded port with process.env.PORT`

**14. Add cors middleware with specific allowed origins from environment variables**
Before: `const express = require('express');`
After: `Add cors middleware with specific allowed origins from environment variables`

**15. Use path.join properly with separate arguments instead of string concatenation**
Before: `res.sendFile(path.join(__dirname + '/pages/homepage.js'));`
After: `Use path.join properly with separate arguments instead of string concatenation`

## `Ethereum/web3.js`

**16. Replace the hardcoded API key with an environment variable reference using process.env.INFURA_API_KEY**
Before: `const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0`
After: `Replace the hardcoded API key with an environment variable reference using process.env.INFURA_API_KE`
Add to .env: `HARDCODED_INFURA_API_KEY=your_value_here`

**17. Remove or conditionally disable console.log statements in production, or log only non-sensitive information**
Before: `console.log('Web3: ', web3);`
After: `Remove or conditionally disable console.log statements in production, or log only non-sensitive info`

**18. Use the modern eth_requestAccounts method and avoid logging sensitive account information**
Before: `console.log(window.ethereum.enable());`
After: `Use the modern eth_requestAccounts method and avoid logging sensitive account information`

## `ipfs.js`

**19. Replace hardcoded host with environment variable IPFS_HOST**
Before: `host: 'ipfs.infura.io'`
After: `Replace hardcoded host with environment variable IPFS_HOST`

**20. Replace hardcoded port with environment variable IPFS_PORT**
Before: `port: 5001`
After: `Replace hardcoded port with environment variable IPFS_PORT`

**21. Replace hardcoded protocol with environment variable IPFS_PROTOCOL with HTTPS as default**
Before: `protocol: 'https'`
After: `Replace hardcoded protocol with environment variable IPFS_PROTOCOL with HTTPS as default`

## Testing Checklist

- [ ] Set required environment variables
- [ ] Run test suite
- [ ] Test affected functionality
- [ ] Deploy to staging first

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T15:59:51.735Z*
