# 🔒 Security Report

**Date:** 2026-05-11 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 26 vulnerabilities including hardcoded API keys (Infura blockchain key exposed), missing input validation enabling email/header injection, and no security middleware (Helmet, rate limiting, CORS). Immediate remediation required for the exposed Infura API key and input validation gaps in the candidate controller. The application lacks fundamental security controls making it vulnerable to injection attacks, brute force, and XSS.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 9 | 9 |
| 🟢 low | 10 | 6 |

## Findings

### 🔴 Critical

**1. Hardcoded Email Credentials - Username** — `controllers/candidate.js:9`
```
user: st@gmail.com,
```
Email username is hardcoded directly in the source code without quotes, which exposes credentials and causes a syntax error. ✅ Auto-fixed

**2. Hardcoded Email Credentials - Password** — `controllers/candidate.js:10`
```
pass: SThifn@94840mdia,
```
Email password is hardcoded directly in the source code without quotes, exposing sensitive authentication credentials. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word phrase provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. This exposes database connection details and makes it difficult to manage different environments (development, staging, production). ✅ Auto-fixed

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
User-supplied email address is used directly without validation, potentially allowing email header injection or sending to unintended recipients. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to the Infura blockchain infrastructure service. ✅ Auto-fixed

### 🟡 Medium

**1. HTML Injection in Email Content** — `controllers/candidate.js:16`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**2. Missing Input Validation - Subject Injection** — `controllers/candidate.js:15`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is used in email subject without validation, potentially allowing header injection. ✅ Auto-fixed

**3. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call does not handle connection errors or use async/await properly. Connection failures will result in unhandled promise rejections. ✅ Auto-fixed

**4. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use the Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and other attacks. ✅ Auto-fixed

**5. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**6. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause issues with legitimate cross-origin requests. ✅ Auto-fixed

**7. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**8. Deprecated ethereum.enable() Method with Unhandled Promise** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The ethereum.enable() method is deprecated and the returned promise is not properly awaited or handled. This can lead to race conditions where web3 is used before the user grants permission. ✅ Auto-fixed

**9. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Potential NoSQL injection if input not sanitized** — `controllers/company.js`
Potential NoSQL injection if input not sanitized ⚠️ Manual review

**2. Potential NoSQL injection if input not sanitized** — `controllers/voter.js`
Potential NoSQL injection if input not sanitized ⚠️ Manual review

**3. Dependencies may have known vulnerabilities - needs audit** — `package.json`
Dependencies may have known vulnerabilities - needs audit ⚠️ Manual review

**4. Loading external CSS from CDN without integrity check** — `components/Layout.js`
Loading external CSS from CDN without integrity check ⚠️ Manual review

**5. Deprecated Mongoose Options** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The useNewUrlParser option is deprecated in newer versions of Mongoose. Additionally, useUnifiedTopology should be included for proper connection handling. ✅ Auto-fixed

**6. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000. This should be configurable via environment variables for flexibility across different environments. ✅ Auto-fixed

**7. Serving JavaScript File as Static Content** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code. Additionally, using string concatenation with __dirname instead of path.join() properly is a minor issue. ✅ Auto-fixed

**8. Using Deprecated window.web3.currentProvider** — `Ethereum/web3.js:7`
```
web3 = new Web3(window.web3.currentProvider);
```
window.web3 is deprecated and may not be available in modern wallet implementations. The recommended approach is to use window.ethereum directly. ✅ Auto-fixed

**9. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**10. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, this should be configurable. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T16:59:32.397Z*
