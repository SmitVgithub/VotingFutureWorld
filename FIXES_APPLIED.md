# Automated Security Fixes

21 fixes applied:

1. **controllers/candidate.js** - Replace hardcoded email with environment variable process.env.EMAIL_USER
2. **controllers/candidate.js** - Replace hardcoded password with environment variable process.env.EMAIL_PASS
3. **controllers/candidate.js** - Add email validation before using in mail options
4. **controllers/candidate.js** - Sanitize user input before including in HTML email content
5. **Ethereum/deploy.js** - Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC
6. **Ethereum/deploy.js** - Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct URL using process.env.INFURA_API_KEY
7. **config/database.js** - Replace hardcoded connection string with environment variable process.env.MONGODB_URI
8. **config/database.js** - Add proper error handling with try-catch or .catch() and update deprecated connection options
9. **Ethereum/election_factory.js** - Replace hardcoded contract address with environment variable reference (process.env.ELECTION_FACTORY_ADDRESS)
10. **server.js** - Add helmet middleware to set secure HTTP headers
11. **server.js** - Add express-rate-limit middleware to limit request rates
12. **server.js** - Replace hardcoded port with process.env.PORT
13. **server.js** - Add cors middleware with specific allowed origins from environment variables
14. **server.js** - Use proper path.join syntax and ensure only intended files are served
15. **Ethereum/web3.js** - Replace hardcoded API key with environment variable reference using process.env.INFURA_API_KEY
16. **Ethereum/web3.js** - Use the modern eth_requestAccounts method with proper async/await and error handling, and remove console.log of sensitive data
17. **Ethereum/web3.js** - Remove console.log statements or use conditional logging for development only
18. **Ethereum/web3.js** - Remove console.log statements or use conditional logging for development only
19. **ipfs.js** - Replace hardcoded host with environment variable process.env.IPFS_HOST
20. **ipfs.js** - Replace hardcoded port with environment variable process.env.IPFS_PORT
21. **ipfs.js** - Replace hardcoded protocol with environment variable process.env.IPFS_PROTOCOL with HTTPS as default
