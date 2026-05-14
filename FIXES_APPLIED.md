# Automated Security Fixes

22 fixes applied:

1. **controllers/candidate.js** - Replace hardcoded email with environment variable process.env.EMAIL_USER
2. **controllers/candidate.js** - Replace hardcoded password with environment variable process.env.EMAIL_PASS
3. **controllers/candidate.js** - Sanitize user input by removing newlines and carriage returns that could be used for header injection
4. **controllers/candidate.js** - Escape HTML entities in user input before including in email body
5. **controllers/candidate.js** - Add email format validation before sending
6. **Ethereum/deploy.js** - Replace hardcoded mnemonic with environment variable process.env.WALLET_MNEMONIC
7. **Ethereum/deploy.js** - Replace hardcoded Infura URL with environment variable process.env.INFURA_URL or construct from process.env.INFURA_API_KEY
8. **config/database.js** - Replace hardcoded connection string with environment variable process.env.MONGODB_URI
9. **config/database.js** - Add proper error handling with try/catch or .catch() and update connection options for modern Mongoose
10. **Ethereum/election_factory.js** - Replace hardcoded contract address with environment variable reference using process.env.ELECTION_FACTORY_ADDRESS
11. **server.js** - Add helmet middleware to set secure HTTP headers
12. **server.js** - Add express-rate-limit middleware to limit request rates
13. **server.js** - Add CORS middleware with specific allowed origins from environment variables
14. **server.js** - Replace hardcoded port with process.env.PORT
15. **server.js** - Fix path.join usage and consider serving compiled/static content instead
16. **Ethereum/web3.js** - Replace the hardcoded API key with an environment variable reference using process.env.INFURA_API_KEY
17. **Ethereum/web3.js** - Replace deprecated enable() with modern eth_requestAccounts method and properly handle the async operation
18. **Ethereum/web3.js** - Use window.ethereum directly as the provider instead of window.web3.currentProvider
19. **Ethereum/web3.js** - Remove or conditionally disable console.log statements in production
20. **ipfs.js** - Replace hardcoded host with environment variable process.env.IPFS_HOST
21. **ipfs.js** - Replace hardcoded port with environment variable process.env.IPFS_PORT
22. **ipfs.js** - Replace hardcoded protocol with environment variable process.env.IPFS_PROTOCOL with HTTPS as default
