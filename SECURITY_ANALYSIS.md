# 🔒 Security Report

**Date:** 2026-05-14 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 35 vulnerabilities including hardcoded API keys and missing input validation across all routes. The exposed Infura API key (29bcae4ee7454a118a2b0f0f4d86c0e0) requires immediate rotation. Lack of fundamental security controls (Helmet, rate limiting, CORS) leaves the application exposed to common web attacks.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 17 | 9 |
| 🟢 low | 11 | 4 |

## Findings

### 🔴 Critical

**1. Hardcoded Email Credentials - Username** — `controllers/candidate.js:9`
```
user: st@gmail.com,
```
Email username is hardcoded directly in the source code without quotes (syntax error) and exposed in plaintext. ✅ Auto-fixed

**2. Hardcoded Email Credentials - Password** — `controllers/candidate.js:10`
```
pass: SThifn@94840mdia,
```
Email password is hardcoded directly in the source code without quotes (syntax error) and exposed in plaintext. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word phrase provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings is a security anti-pattern as production databases typically require authentication, and this pattern encourages adding credentials directly to code. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or bundled JavaScript files. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:15`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection attacks. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to the Infura blockchain infrastructure service. ✅ Auto-fixed

### 🟡 Medium

**1. Potential nodemailer usage may have hardcoded credentials similar to candidate controller** — `controllers/voter.js`
Potential nodemailer usage may have hardcoded credentials similar to candidate controller ⚠️ Manual review

**2. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**3. No rate limiting on registration endpoint** — `routes/candidate.js`
No rate limiting on registration endpoint ⚠️ Manual review

**4. No input validation middleware** — `routes/company.js`
No input validation middleware ⚠️ Manual review

**5. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**6. No input validation middleware** — `routes/voter.js`
No input validation middleware ⚠️ Manual review

**7. No rate limiting on authentication endpoint** — `routes/voter.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**8. PUT endpoint may lack authorization checks** — `routes/voter.js`
PUT endpoint may lack authorization checks ⚠️ Manual review

**9. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is concatenated directly into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**10. Missing MongoDB Connection Error Handling** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose connection does not handle connection errors or use recommended security options. Missing error handling can lead to silent failures and potential security issues. ✅ Auto-fixed

**11. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing. ✅ Auto-fixed

**12. Missing Rate Limiting** — `server.js:10`
```
const exp = express();
```
The application does not implement rate limiting, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**13. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS, which may lead to either overly permissive cross-origin access or inconsistent browser behavior. ✅ Auto-fixed

**14. Serving JavaScript File Directly via sendFile** — `server.js:21`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code. Additionally, using string concatenation with __dirname instead of path.join properly is a minor issue. ✅ Auto-fixed

**15. Deprecated ethereum.enable() Usage Without Proper Error Handling** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The code uses the deprecated window.ethereum.enable() method and logs the result directly without awaiting the promise or handling errors. This can lead to unhandled promise rejections and doesn't properly wait for user authorization. ✅ Auto-fixed

**16. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**17. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. While not a secret, hardcoding infrastructure endpoints makes it difficult to change environments and could expose internal infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but should verify salt rounds configuration** — `controllers/company.js`
Uses bcrypt which is good, but should verify salt rounds configuration ⚠️ Manual review

**2. Dependencies may have known vulnerabilities - requires npm audit** — `package.json`
Dependencies may have known vulnerabilities - requires npm audit ⚠️ Manual review

**3. Uses fs-extra for file operations - ensure proper path validation** — `Ethereum/compile.js`
Uses fs-extra for file operations - ensure proper path validation ⚠️ Manual review

**4. Uses js-cookie for client-side cookie handling - ensure secure cookie flags** — `components/Header.js`
Uses js-cookie for client-side cookie handling - ensure secure cookie flags ⚠️ Manual review

**5. Loads external CSS from CDN without integrity check** — `components/Layout.js`
Loads external CSS from CDN without integrity check ⚠️ Manual review

**6. Client-side cookie handling - ensure httpOnly and secure flags on server** — `pages/company_login.js`
Client-side cookie handling - ensure httpOnly and secure flags on server ⚠️ Manual review

**7. Client-side cookie handling - ensure proper security flags** — `pages/voter_login.js`
Client-side cookie handling - ensure proper security flags ⚠️ Manual review

**8. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variables. ✅ Auto-fixed

**9. Sensitive Information Logged to Console** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
The web3 instance is logged to the console, which may expose sensitive configuration details including provider URLs and potentially API keys in production environments. ✅ Auto-fixed

**10. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code. This reduces flexibility for different deployment environments. ✅ Auto-fixed

**11. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded. While HTTPS is secure, configuration should be externalized for flexibility. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-14T16:32:31.986Z*
