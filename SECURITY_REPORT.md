# 🔒 Security Report

**Date:** 2026-05-11 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 35 vulnerabilities including email injection, HTML injection, and missing input validation across all routes. The application lacks fundamental security controls including Helmet middleware, rate limiting, and CORS configuration, leaving it exposed to XSS, brute force, and injection attacks. Immediate remediation required before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 6 | 6 |
| 🟠 high | 1 | 1 |
| 🟡 medium | 15 | 9 |
| 🟢 low | 13 | 6 |

## Findings

### 🔴 Critical

**1. Hardcoded Email Credential (Username)** — `controllers/candidate.js:9`
```
user: st@gmail.com,
```
Email username is hardcoded directly in the source code without quotes, which is both a syntax error and a critical security vulnerability exposing credentials. ✅ Auto-fixed

**2. Hardcoded Email Credential (Password)** — `controllers/candidate.js:10`
```
pass: SThifn@94840mdia,
```
Email password is hardcoded directly in the source code without quotes, exposing sensitive authentication credentials in plain text. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word phrase provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0). This key provides access to the Infura blockchain infrastructure service. ✅ Auto-fixed

**5. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings is a security anti-pattern as production databases typically require authentication, and this pattern encourages adding credentials directly to code. ✅ Auto-fixed

**6. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or bundled JavaScript files. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:14`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection or sending emails to unintended recipients. ✅ Auto-fixed

### 🟡 Medium

**1. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**2. No rate limiting on registration endpoint** — `routes/candidate.js`
No rate limiting on registration endpoint ⚠️ Manual review

**3. No input validation middleware** — `routes/company.js`
No input validation middleware ⚠️ Manual review

**4. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**5. No input validation middleware** — `routes/voter.js`
No input validation middleware ⚠️ Manual review

**6. No rate limiting on authentication endpoint** — `routes/voter.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**7. HTML Injection in Email Content** — `controllers/candidate.js:16`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is concatenated directly into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**8. Missing Input Validation - Subject Injection** — `controllers/candidate.js:15`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is used directly in email subject without validation, potentially allowing email header injection. ✅ Auto-fixed

**9. Missing MongoDB Connection Error Handling** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose connection lacks error handling and uses deprecated options. Modern mongoose versions don't require useNewUrlParser, and the connection should handle errors gracefully. ✅ Auto-fixed

**10. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**11. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and other attacks. ✅ Auto-fixed

**12. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**13. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause functionality issues when accessed from different origins. ✅ Auto-fixed

**14. Deprecated ethereum.enable() Usage** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The ethereum.enable() method is deprecated. Additionally, the result is logged to console which may expose sensitive wallet information, and the promise is not properly awaited. ✅ Auto-fixed

**15. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but salt rounds should be verified** — `controllers/company.js`
Uses bcrypt which is good, but salt rounds should be verified ⚠️ Manual review

**2. Salt rounds hardcoded but acceptable practice** — `controllers/voter.js`
Salt rounds hardcoded but acceptable practice ⚠️ Manual review

**3. Dependencies may have known vulnerabilities - needs npm audit** — `package.json`
Dependencies may have known vulnerabilities - needs npm audit ⚠️ Manual review

**4. Uses js-cookie for client-side cookie handling - ensure HttpOnly for sensitive cookies** — `components/Header.js`
Uses js-cookie for client-side cookie handling - ensure HttpOnly for sensitive cookies ⚠️ Manual review

**5. External CDN dependency without integrity hash** — `components/Layout.js`
External CDN dependency without integrity hash ⚠️ Manual review

**6. Client-side cookie handling with js-cookie** — `pages/company_login.js`
Client-side cookie handling with js-cookie ⚠️ Manual review

**7. Client-side cookie handling with js-cookie** — `pages/voter_login.js`
Client-side cookie handling with js-cookie ⚠️ Manual review

**8. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variable, which reduces deployment flexibility and may expose internal configuration. ✅ Auto-fixed

**9. Serving JavaScript File as Static Content** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile may expose source code. Additionally, using string concatenation with __dirname instead of path.join properly could lead to path issues. ✅ Auto-fixed

**10. Console Logging of Web3 Instance** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
Logging the Web3 instance to console may expose provider details, connection information, and internal state in production environments. ✅ Auto-fixed

**11. Console Logging of Web3 Instance (else branch)** — `Ethereum/web3.js:12`
```
console.log('Web3 else: ', web3);
```
Logging the Web3 instance to console may expose provider details and connection information in production environments. ✅ Auto-fixed

**12. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing flexibility for different deployment environments. ✅ Auto-fixed

**13. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded. While HTTPS is secure, configuration should be externalized for flexibility. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T16:44:38.960Z*
