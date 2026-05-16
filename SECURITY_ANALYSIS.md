# 🔒 Security Report

**Date:** 2026-05-16 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 34 vulnerabilities including hardcoded API keys (Infura blockchain key exposed), email header injection, and HTML injection vulnerabilities. The application lacks fundamental security controls including Helmet middleware, rate limiting, and CORS configuration. Immediate remediation required for credential exposure and injection attack vectors before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 10 | 8 |
| 🟢 low | 17 | 6 |

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
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings makes it easy to accidentally commit sensitive database URLs with embedded usernames and passwords to version control. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or client-side JavaScript bundles. ✅ Auto-fixed

### 🟠 High

**1. Email Header Injection via Unsanitized User Input** — `controllers/candidate.js:15`
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

**1. Nodemailer imported - may have hardcoded credentials in full file** — `controllers/voter.js`
Nodemailer imported - may have hardcoded credentials in full file ⚠️ Manual review

**2. Need to verify email transport configuration** — `controllers/voter.js`
Need to verify email transport configuration ⚠️ Manual review

**3. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**4. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures will not be properly caught or logged, and the application may fail silently or crash unexpectedly. ✅ Auto-fixed

**5. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum smart contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidental deployment with wrong contract addresses. ✅ Auto-fixed

**6. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use the Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing. ✅ Auto-fixed

**7. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**8. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause issues with legitimate cross-origin requests. ✅ Auto-fixed

**9. Deprecated ethereum.enable() Usage Without Proper Error Handling** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The code uses the deprecated window.ethereum.enable() method and logs the result directly without awaiting the promise or handling potential errors. This can lead to unhandled promise rejections and doesn't properly wait for user authorization. ✅ Auto-fixed

**10. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but need to verify salt rounds configuration** — `controllers/company.js`
Uses bcrypt which is good, but need to verify salt rounds configuration ⚠️ Manual review

**2. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**3. No rate limiting on registration endpoint** — `routes/candidate.js`
No rate limiting on registration endpoint ⚠️ Manual review

**4. No input validation middleware visible** — `routes/company.js`
No input validation middleware visible ⚠️ Manual review

**5. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**6. No input validation middleware visible** — `routes/voter.js`
No input validation middleware visible ⚠️ Manual review

**7. No rate limiting on authentication endpoint** — `routes/voter.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**8. Dependencies may have known vulnerabilities - needs npm audit** — `package.json`
Dependencies may have known vulnerabilities - needs npm audit ⚠️ Manual review

**9. Loading external CSS from CDN without integrity check** — `components/Layout.js`
Loading external CSS from CDN without integrity check ⚠️ Manual review

**10. Client-side cookie handling - verify httpOnly and secure flags** — `pages/company_login.js`
Client-side cookie handling - verify httpOnly and secure flags ⚠️ Manual review

**11. Client-side cookie handling - verify httpOnly and secure flags** — `pages/voter_login.js`
Client-side cookie handling - verify httpOnly and secure flags ⚠️ Manual review

**12. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000. This should be configurable via environment variables for flexibility across different deployment environments. ✅ Auto-fixed

**13. Serving JavaScript File Directly via sendFile** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code. Additionally, using string concatenation with __dirname instead of path.join arguments is a code smell. ✅ Auto-fixed

**14. Sensitive Web3 Instance Logged to Console** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
The Web3 instance is logged to the console, which may expose provider details, connection information, and internal state in production environments. ✅ Auto-fixed

**15. Sensitive Provider Information Logged to Console** — `Ethereum/web3.js:12`
```
console.log('Web3 else: ', web3);
```
The Web3 instance with provider information is logged to the console in the fallback branch, potentially exposing configuration details. ✅ Auto-fixed

**16. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**17. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, this should be configurable. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-16T09:39:34.032Z*
