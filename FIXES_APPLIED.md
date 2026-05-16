# Automated Security Fixes

21 fixes applied:

1. **controllers/candidate.js** - Replace hardcoded email with environment variable process.env.EMAIL_USER
2. **controllers/candidate.js** - Replace hardcoded password with environment variable process.env.EMAIL_PASS
3. **controllers/candidate.js** - Add email validation before using user input
4. **controllers/candidate.js** - Sanitize user input before including in HTML content
5. **controllers/candidate.js** - Sanitize user input to remove newlines and special characters
6. **Ethereum/deploy.js** - Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC
7. **Ethereum/deploy.js** - Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct URL using process.env.INFURA_API_KEY
8. **config/database.js** - Replace hardcoded connection string with environment variable process.env.MONGODB_URI
9. **config/database.js** - Add proper error handling and update connection options to use current best practices
10. **Ethereum/election_factory.js** - Replace hardcoded contract address with environment variable reference (process.env.ELECTION_FACTORY_ADDRESS)
11. **server.js** - Add helmet middleware to set secure HTTP headers
12. **server.js** - Add express-rate-limit middleware to limit request rates
13. **server.js** - Replace hardcoded port with process.env.PORT
14. **server.js** - Add cors middleware with specific allowed origins from environment variable
15. **server.js** - Use path.join properly with separate arguments and consider serving appropriate content
16. **Ethereum/web3.js** - Replace the hardcoded API key with an environment variable reference using process.env.INFURA_API_KEY
17. **Ethereum/web3.js** - Use the modern ethereum.request() method and properly handle the async operation
18. **Ethereum/web3.js** - Remove or conditionally disable console.log statements in production
19. **ipfs.js** - Replace hardcoded host with environment variable IPFS_HOST
20. **ipfs.js** - Replace hardcoded port with environment variable IPFS_PORT
21. **ipfs.js** - Replace hardcoded protocol with environment variable IPFS_PROTOCOL with HTTPS as default
