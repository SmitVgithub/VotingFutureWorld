# 🔒 Security Report

**Date:** 2026-05-11 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 34 vulnerabilities including a hardcoded Infura API key exposing blockchain infrastructure access and email injection vulnerabilities enabling header manipulation attacks. The application lacks fundamental security controls: no input validation, no authentication middleware on routes, no rate limiting, and missing security headers. Immediate remediation required before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 15 | 9 |
| 🟢 low | 12 | 5 |

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
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word phrase provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings makes it easy to accidentally commit sensitive database URLs with embedded credentials to version control. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or bundled JavaScript files. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:14`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection attacks. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to the Infura Ethereum node service. ✅ Auto-fixed

### 🟡 Medium

**1. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**2. No authentication middleware on route** — `routes/candidate.js`
No authentication middleware on route ⚠️ Manual review

**3. No input validation middleware visible** — `routes/company.js`
No input validation middleware visible ⚠️ Manual review

**4. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**5. No input validation middleware visible** — `routes/voter.js`
No input validation middleware visible ⚠️ Manual review

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
User-supplied election_name is used directly in email subject without validation, potentially allowing header injection. ✅ Auto-fixed

**9. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures will not be properly caught or logged, and the application may fail silently or crash unexpectedly. ✅ Auto-fixed

**10. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**11. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use the Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing. ✅ Auto-fixed

**12. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**13. Missing CORS Configuration** — `server.js:1`
```
const express = require('express');
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause issues with legitimate cross-origin requests. ✅ Auto-fixed

**14. Console Logging of Sensitive Web3 Objects** — `Ethereum/web3.js:7`
```
console.log('Web3: ', web3);
```
Logging the entire Web3 object to the console can expose sensitive configuration details, provider information, and potentially connected account details in production environments. ✅ Auto-fixed

**15. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but should verify salt rounds are adequate** — `controllers/company.js`
Uses bcrypt which is good, but should verify salt rounds are adequate ⚠️ Manual review

**2. Uses bcrypt with saltRounds=10 which is acceptable** — `controllers/voter.js`
Uses bcrypt with saltRounds=10 which is acceptable ⚠️ Manual review

**3. Dependencies may have known vulnerabilities - requires npm audit** — `package.json`
Dependencies may have known vulnerabilities - requires npm audit ⚠️ Manual review

**4. Uses js-cookie for client-side cookie handling - ensure secure flags are set** — `components/Header.js`
Uses js-cookie for client-side cookie handling - ensure secure flags are set ⚠️ Manual review

**5. External CDN dependency without integrity hash** — `components/Layout.js`
External CDN dependency without integrity hash ⚠️ Manual review

**6. Client-side cookie handling - ensure httpOnly and secure flags** — `pages/company_login.js`
Client-side cookie handling - ensure httpOnly and secure flags ⚠️ Manual review

**7. Client-side cookie handling - ensure httpOnly and secure flags** — `pages/voter_login.js`
Client-side cookie handling - ensure httpOnly and secure flags ⚠️ Manual review

**8. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000. This should be configurable via environment variables for flexibility across different environments. ✅ Auto-fixed

**9. Serving JavaScript File Directly via sendFile** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code. Additionally, using string concatenation with __dirname instead of path.join properly could lead to path traversal issues. ✅ Auto-fixed

**10. Console Logging of Ethereum Enable Promise** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Logging the result of window.ethereum.enable() exposes the promise and potentially user account information. Additionally, the enable() method is deprecated in favor of eth_requestAccounts. ✅ Auto-fixed

**11. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**12. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, this should be configurable. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T15:59:36.435Z*
