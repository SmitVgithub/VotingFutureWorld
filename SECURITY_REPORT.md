# 🔒 Security Report

**Date:** 2026-05-10 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 34 vulnerabilities including hardcoded API keys (Infura), email injection flaws, and missing authentication/authorization controls across multiple routes. The application lacks fundamental security middleware (Helmet, rate limiting) and input validation, exposing it to injection attacks, brute force, and credential theft. Immediate remediation required before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 17 | 10 |
| 🟢 low | 10 | 4 |

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
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings is a security anti-pattern as production databases typically require authentication, and this pattern encourages adding credentials directly to the code. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or client-side JavaScript bundles. ✅ Auto-fixed

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
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to Infura's Ethereum node infrastructure. ✅ Auto-fixed

### 🟡 Medium

**1. Potential nodemailer usage may have hardcoded credentials similar to candidate.js** — `controllers/voter.js`
Potential nodemailer usage may have hardcoded credentials similar to candidate.js ⚠️ Manual review

**2. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**3. No authentication middleware on route** — `routes/candidate.js`
No authentication middleware on route ⚠️ Manual review

**4. No input validation middleware visible** — `routes/company.js`
No input validation middleware visible ⚠️ Manual review

**5. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**6. No input validation middleware visible** — `routes/voter.js`
No input validation middleware visible ⚠️ Manual review

**7. No authentication middleware on sensitive routes** — `routes/voter.js`
No authentication middleware on sensitive routes ⚠️ Manual review

**8. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**9. Missing Input Validation - Subject Injection** — `controllers/candidate.js:16`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is used directly in email subject without validation, potentially allowing header injection. ✅ Auto-fixed

**10. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures will not be properly caught or logged, and the connection options are outdated. ✅ Auto-fixed

**11. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidental deployment against wrong contracts. ✅ Auto-fixed

**12. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use the Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and other attacks. ✅ Auto-fixed

**13. Missing Rate Limiting** — `server.js:22`
```
exp.use('/company', company);
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**14. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause functionality issues when accessed from different origins. ✅ Auto-fixed

**15. Sensitive Information Logged to Console** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Logging the result of ethereum.enable() and web3 instances to the console can expose sensitive wallet information, account addresses, and internal state in production environments. ✅ Auto-fixed

**16. Deprecated ethereum.enable() Usage Without Proper Error Handling** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The ethereum.enable() method is deprecated and the promise is not properly awaited or handled. This can lead to race conditions where web3 is used before the user has granted permission. ✅ Auto-fixed

**17. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. While not a secret, hardcoding infrastructure endpoints makes it difficult to change environments and could expose internal infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but should verify salt rounds are adequate** — `controllers/company.js`
Uses bcrypt which is good, but should verify salt rounds are adequate ⚠️ Manual review

**2. Should audit dependencies for known vulnerabilities** — `package.json`
Should audit dependencies for known vulnerabilities ⚠️ Manual review

**3. Uses js-cookie for client-side cookie handling - ensure secure cookie flags are set** — `components/Header.js`
Uses js-cookie for client-side cookie handling - ensure secure cookie flags are set ⚠️ Manual review

**4. External CDN dependency without subresource integrity** — `components/Layout.js`
External CDN dependency without subresource integrity ⚠️ Manual review

**5. Client-side cookie handling should ensure secure flags** — `pages/company_login.js`
Client-side cookie handling should ensure secure flags ⚠️ Manual review

**6. Client-side cookie handling should ensure secure flags** — `pages/voter_login.js`
Client-side cookie handling should ensure secure flags ⚠️ Manual review

**7. Hardcoded Port Number** — `server.js:35`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variable, which reduces deployment flexibility and could expose the application on unintended ports. ✅ Auto-fixed

**8. Serving JavaScript File Directly via sendFile** — `server.js:19`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly via sendFile could expose server-side code. Additionally, using string concatenation with __dirname instead of path.join properly could lead to path traversal issues. ✅ Auto-fixed

**9. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code. This reduces flexibility for different deployment environments. ✅ Auto-fixed

**10. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded. While HTTPS is secure, the configuration should be externalized for flexibility. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-10T07:04:35.828Z*
