# 🔍 Manual Review Required

**Total:** 36 items | **Date:** 2026-05-10

## Overview

No items flagged for manual review. However, given zero auto-fixes applied against 36 vulnerabilities, all identified issues require immediate manual remediation.

## 🔴 Critical (6)

**1. Hardcoded Gmail email address** — `controllers/candidate.js`
*Fix: Review and fix: Hardcoded Gmail email address*
Est. time: 1-4 hours

**2. Hardcoded Gmail password in plain text** — `controllers/candidate.js`
*Fix: Review and fix: Hardcoded Gmail password in plain text*
Est. time: 1-4 hours

**3. Credentials should be in environment variables** — `controllers/candidate.js`
*Fix: Review and fix: Credentials should be in environment variables*
Est. time: 1-4 hours

**4. Hardcoded HD wallet mnemonic seed phrase** — `Ethereum/deploy.js`
*Fix: Review and fix: Hardcoded HD wallet mnemonic seed phrase*
Est. time: 1-4 hours

**5. Complete wallet compromise possible** — `Ethereum/deploy.js`
*Fix: Review and fix: Complete wallet compromise possible*
Est. time: 1-4 hours

**6. Must use environment variables** — `Ethereum/deploy.js`
*Fix: Review and fix: Must use environment variables*
Est. time: 1-4 hours

## 🟠 High (14)

**7. Hardcoded MongoDB connection string** — `config/database.js`
*Fix: Review and fix: Hardcoded MongoDB connection string*
Est. time: 1-4 hours

**8. No authentication configured** — `config/database.js`
*Fix: Review and fix: No authentication configured*
Est. time: 1-4 hours

**9. Should use environment variables** — `config/database.js`
*Fix: Review and fix: Should use environment variables*
Est. time: 1-4 hours

**10. Potential NoSQL injection via req.body.email** — `controllers/company.js`
*Fix: Review and fix: Potential NoSQL injection via req.body.email*
Est. time: 1-4 hours

**11. Missing input validation/sanitization** — `controllers/company.js`
*Fix: Review and fix: Missing input validation/sanitization*
Est. time: 1-4 hours

**12. Potential NoSQL injection via req.body.email** — `controllers/voter.js`
*Fix: Review and fix: Potential NoSQL injection via req.body.email*
Est. time: 1-4 hours

**13. Missing input validation/sanitization** — `controllers/voter.js`
*Fix: Review and fix: Missing input validation/sanitization*
Est. time: 1-4 hours

**14. Missing authentication middleware on sensitive routes** — `routes/voter.js`
*Fix: Review and fix: Missing authentication middleware on sensitive routes*
Est. time: 1-4 hours

**15. Missing rate limiting** — `routes/voter.js`
*Fix: Review and fix: Missing rate limiting*
Est. time: 1-4 hours

**16. PUT endpoint may allow unauthorized updates** — `routes/voter.js`
*Fix: Review and fix: PUT endpoint may allow unauthorized updates*
Est. time: 1-4 hours

**17. Missing helmet middleware** — `server.js`
*Fix: Review and fix: Missing helmet middleware*
Est. time: 1-4 hours

**18. Missing rate limiting** — `server.js`
*Fix: Review and fix: Missing rate limiting*
Est. time: 1-4 hours

**19. Missing CORS configuration** — `server.js`
*Fix: Review and fix: Missing CORS configuration*
Est. time: 1-4 hours

**20. Missing security headers** — `server.js`
*Fix: Review and fix: Missing security headers*
Est. time: 1-4 hours

## 🟡 Medium (12)

**21. Missing authentication middleware** — `routes/candidate.js`
*Fix: Review and fix: Missing authentication middleware*
Est. time: 1-4 hours

**22. Missing input validation** — `routes/candidate.js`
*Fix: Review and fix: Missing input validation*
Est. time: 1-4 hours

**23. Missing rate limiting on authenticate endpoint** — `routes/company.js`
*Fix: Review and fix: Missing rate limiting on authenticate endpoint*
Est. time: 1-4 hours

**24. Missing input validation middleware** — `routes/company.js`
*Fix: Review and fix: Missing input validation middleware*
Est. time: 1-4 hours

**25. Hardcoded smart contract address** — `Ethereum/election_factory.js`
*Fix: Review and fix: Hardcoded smart contract address*
Est. time: 1-4 hours

**26. Should be configurable via environment** — `Ethereum/election_factory.js`
*Fix: Review and fix: Should be configurable via environment*
Est. time: 1-4 hours

**27. Fallback provider URL may use HTTP** — `Ethereum/web3.js`
*Fix: Review and fix: Fallback provider URL may use HTTP*
Est. time: 1-4 hours

**28. Should ensure HTTPS only** — `Ethereum/web3.js`
*Fix: Review and fix: Should ensure HTTPS only*
Est. time: 1-4 hours

**29. Client-side authentication state management** — `pages/company_login.js`
*Fix: Review and fix: Client-side authentication state management*
Est. time: 1-4 hours

**30. Cookie security flags should be verified** — `pages/company_login.js`
*Fix: Review and fix: Cookie security flags should be verified*
Est. time: 1-4 hours

**31. Client-side cookie handling for auth** — `pages/voter_login.js`
*Fix: Review and fix: Client-side cookie handling for auth*
Est. time: 1-4 hours

**32. Should verify secure cookie configuration** — `pages/voter_login.js`
*Fix: Review and fix: Should verify secure cookie configuration*
Est. time: 1-4 hours

## 🟢 Low (4)

**33. Should verify dependencies for known vulnerabilities** — `package.json`
*Fix: Review and fix: Should verify dependencies for known vulnerabilities*
Est. time: 1-4 hours

**34. Client-side cookie access - ensure secure flags are set** — `components/Header.js`
*Fix: Review and fix: Client-side cookie access - ensure secure flags are set*
Est. time: 1-4 hours

**35. Schema lacks strict validation constraints** — `models/company.js`
*Fix: Review and fix: Schema lacks strict validation constraints*
Est. time: 1-4 hours

**36. Schema lacks strict validation constraints** — `models/voter.js`
*Fix: Review and fix: Schema lacks strict validation constraints*
Est. time: 1-4 hours

*Generated by Agnixa Recon 2.0 Brain — 2026-05-10T06:17:02.622Z*
