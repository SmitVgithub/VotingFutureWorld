# 🔒 Security Report

**Date:** 2026-05-16 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 26 vulnerabilities including hardcoded API keys, missing input validation enabling email/HTML injection, and absent security middleware (Helmet, CORS, rate limiting). The exposed Infura API key poses immediate risk of unauthorized blockchain infrastructure access. Priority remediation required for credential management and input sanitization across the application.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 10 | 10 |
| 🟢 low | 9 | 5 |

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
Email password is hardcoded directly in the source code without quotes, exposing sensitive authentication credentials in version control and to anyone with code access. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word mnemonic provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoded connection strings often get expanded to include usernames and passwords, and the practice itself is insecure as it exposes database location and structure. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone who has access to the codebase, version control history, or client-side JavaScript bundles. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:15`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection or sending emails to unintended recipients. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to Infura's Ethereum node infrastructure. ✅ Auto-fixed

### 🟡 Medium

**1. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**2. HTML Injection in Email Subject** — `controllers/candidate.js:16`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is directly concatenated into email subject without sanitization. ✅ Auto-fixed

**3. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures will not be properly caught or logged, and the connection options are outdated. ✅ Auto-fixed

**4. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between different environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**5. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing. ✅ Auto-fixed

**6. Missing Rate Limiting** — `server.js:10`
```
const exp = express();
```
The application does not implement rate limiting, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**7. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS, which could either leave it open to cross-origin attacks or cause issues with legitimate cross-origin requests. ✅ Auto-fixed

**8. Deprecated Ethereum Provider Access Pattern** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Using window.ethereum.enable() is deprecated. The modern approach is to use window.ethereum.request({ method: 'eth_requestAccounts' }). Additionally, the enable() call is not awaited, which could lead to race conditions. ✅ Auto-fixed

**9. Using Deprecated window.web3.currentProvider** — `Ethereum/web3.js:7`
```
web3 = new Web3(window.web3.currentProvider);
```
Using window.web3.currentProvider is deprecated. Modern dApps should use window.ethereum directly as the provider. ✅ Auto-fixed

**10. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. While not a secret, hardcoding infrastructure endpoints makes it difficult to change environments and could expose internal infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Potential NoSQL injection if input not sanitized** — `controllers/company.js`
Potential NoSQL injection if input not sanitized ⚠️ Manual review

**2. Potential NoSQL injection if input not sanitized** — `controllers/voter.js`
Potential NoSQL injection if input not sanitized ⚠️ Manual review

**3. Dependencies may have known vulnerabilities - requires audit** — `package.json`
Dependencies may have known vulnerabilities - requires audit ⚠️ Manual review

**4. Loading external CSS from CDN without integrity check** — `components/Layout.js`
Loading external CSS from CDN without integrity check ⚠️ Manual review

**5. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variable. ✅ Auto-fixed

**6. Serving JavaScript File Directly** — `server.js:22`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose source code. Additionally, using string concatenation with __dirname instead of path.join properly. ✅ Auto-fixed

**7. Console Logging Sensitive Information** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
Logging the entire Web3 instance to console may expose sensitive configuration details including provider URLs and potentially API keys in production environments. ✅ Auto-fixed

**8. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code. This reduces flexibility for different deployment environments. ✅ Auto-fixed

**9. Hardcoded Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The protocol is hardcoded. While HTTPS is correct, this should be configurable for different environments. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-16T09:15:56.539Z*
