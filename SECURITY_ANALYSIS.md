# 🔒 Security Report

**Date:** 2026-05-16 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 27 vulnerabilities including hardcoded API keys (Infura), missing input validation enabling email injection, and absent authentication middleware on sensitive routes. The application lacks fundamental security controls including Helmet, rate limiting, and CORS configuration, creating significant attack surface for injection attacks, brute force, and credential exposure.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 10 | 9 |
| 🟢 low | 10 | 4 |

## Findings

### 🔴 Critical

**1. Hardcoded Email Credential (Username)** — `controllers/candidate.js:9`
```
user: st@gmail.com,
```
Email username is hardcoded directly in the source code without quotes, which is both a syntax error and a security vulnerability. Credentials should never be stored in source code. ✅ Auto-fixed

**2. Hardcoded Email Credential (Password)** — `controllers/candidate.js:10`
```
pass: SThifn@94840mdia,
```
Email password is hardcoded directly in the source code without quotes, which is both a syntax error and a critical security vulnerability. Passwords should never be stored in source code. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word mnemonic provides complete access to all derived wallet addresses and their funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings is a security anti-pattern as production databases typically require authentication, and this pattern encourages adding credentials directly to code. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or client-side bundle. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:15`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection attacks or sending emails to unintended recipients. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to the Infura Ethereum node service. ✅ Auto-fixed

### 🟡 Medium

**1. Missing authentication middleware on sensitive routes** — `routes/voter.js`
Missing authentication middleware on sensitive routes ⚠️ Manual review

**2. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection in emails. ✅ Auto-fixed

**3. Missing MongoDB Connection Error Handling** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose connection lacks error handling and uses deprecated options. Modern mongoose versions don't require useNewUrlParser, and the connection should handle errors properly to prevent application crashes and potential information disclosure. ✅ Auto-fixed

**4. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**5. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing. ✅ Auto-fixed

**6. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**7. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause issues with legitimate cross-origin requests. ✅ Auto-fixed

**8. Serving JavaScript File Directly as Response** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code or cause unexpected behavior. This appears to be a Next.js page component being served as a static file. ✅ Auto-fixed

**9. Hardcoded Infura RPC URL** — `Ethereum/web3.js:10`
```
https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0
```
The entire Infura RPC endpoint URL is hardcoded, making it difficult to switch networks or providers without code changes. ✅ Auto-fixed

**10. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Ensure bcrypt salt rounds are sufficient** — `controllers/company.js`
Ensure bcrypt salt rounds are sufficient ⚠️ Manual review

**2. Potential for email enumeration in voter lookup** — `controllers/voter.js`
Potential for email enumeration in voter lookup ⚠️ Manual review

**3. Dependencies may have known vulnerabilities - run npm audit** — `package.json`
Dependencies may have known vulnerabilities - run npm audit ⚠️ Manual review

**4. Loading external CSS from CDN without SRI integrity check** — `components/Layout.js`
Loading external CSS from CDN without SRI integrity check ⚠️ Manual review

**5. Client-side cookie handling - ensure httpOnly and secure flags on server** — `pages/company_login.js`
Client-side cookie handling - ensure httpOnly and secure flags on server ⚠️ Manual review

**6. Client-side cookie handling - ensure httpOnly and secure flags on server** — `pages/voter_login.js`
Client-side cookie handling - ensure httpOnly and secure flags on server ⚠️ Manual review

**7. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000. This should be configurable via environment variables for flexibility across different environments. ✅ Auto-fixed

**8. Console Logging of Sensitive Web3 Objects** — `Ethereum/web3.js:7`
```
console.log('Web3: ', web3);
```
Logging Web3 instances and ethereum enable promises to console can expose sensitive provider information and internal state in production environments. ✅ Auto-fixed

**9. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**10. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is correct, this should be configurable. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-16T04:52:50.527Z*
