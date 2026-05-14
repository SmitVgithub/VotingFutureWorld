# Automated Security Fixes

20 fixes applied:

1. **controllers/candidate.js** - Replace hardcoded email with environment variable process.env.EMAIL_USER
2. **controllers/candidate.js** - Replace hardcoded password with environment variable process.env.EMAIL_PASS
3. **controllers/candidate.js** - Add email validation before using in mail options
4. **controllers/candidate.js** - Sanitize user input before including in HTML content
5. **Ethereum/deploy.js** - Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC
6. **Ethereum/deploy.js** - Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct URL using process.env.INFURA_API_KEY
7. **config/database.js** - Replace hardcoded connection string with environment variable process.env.MONGODB_URI
8. **config/database.js** - Add proper error handling for connection failures and update connection options
9. **Ethereum/election_factory.js** - Replace hardcoded contract address with environment variable reference using process.env.ELECTION_FACTORY_ADDRESS
10. **server.js** - Add helmet middleware to set secure HTTP headers
11. **server.js** - Add express-rate-limit middleware to limit request rates
12. **server.js** - Replace hardcoded port with process.env.PORT
13. **server.js** - Add cors middleware with specific allowed origins from environment variables
14. **server.js** - Fix path.join usage to properly join path segments
15. **Ethereum/web3.js** - Replace the hardcoded API key with an environment variable reference (process.env.INFURA_API_KEY)
16. **Ethereum/web3.js** - Use the modern eth_requestAccounts method with proper async/await and error handling, and remove console.log statements that may leak information
17. **Ethereum/web3.js** - Remove or conditionally disable console.log statements in production
18. **ipfs.js** - Replace hardcoded host with environment variable IPFS_HOST
19. **ipfs.js** - Replace hardcoded port with environment variable IPFS_PORT
20. **ipfs.js** - Replace hardcoded protocol with environment variable IPFS_PROTOCOL with HTTPS as default
