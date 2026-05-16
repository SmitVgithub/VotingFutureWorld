# 🔒 Security Report

**Date:** 2026-05-16 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 36 vulnerabilities including hardcoded API keys and missing input validation across all routes. The Infura API key exposure poses immediate risk of unauthorized blockchain access and potential financial loss. Priority remediation required for authentication gaps, rate limiting, and email injection vulnerabilities.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 16 | 9 |
| 🟢 low | 13 | 5 |

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
Email password is hardcoded directly in the source code without quotes, exposing sensitive authentication credentials. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word phrase provides complete access to all derived wallet addresses and their funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings is a security anti-pattern as production databases typically require authentication, and this pattern encourages adding credentials directly to code. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or client-side JavaScript bundles. ✅ Auto-fixed

### 🟠 High

**1. Missing Input Validation - Email Injection** — `controllers/candidate.js:14`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection or sending emails to arbitrary addresses. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. ✅ Auto-fixed

### 🟡 Medium

**1. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**2. No authentication middleware on route** — `routes/candidate.js`
No authentication middleware on route ⚠️ Manual review

**3. No input validation middleware** — `routes/company.js`
No input validation middleware ⚠️ Manual review

**4. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**5. No input validation middleware** — `routes/voter.js`
No input validation middleware ⚠️ Manual review

**6. No rate limiting on authentication endpoint** — `routes/voter.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**7. PUT endpoint may lack authorization checks** — `routes/voter.js`
PUT endpoint may lack authorization checks ⚠️ Manual review

**8. HTML Injection in Email Content** — `controllers/candidate.js:16`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is concatenated directly into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**9. Missing Input Validation in Email Subject** — `controllers/candidate.js:15`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is used directly in email subject without validation, potentially allowing email header injection. ✅ Auto-fixed

**10. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures could crash the application or leave it in an undefined state without proper error handling. ✅ Auto-fixed

**11. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**12. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing. ✅ Auto-fixed

**13. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
No rate limiting is configured on the Express routes, making the application vulnerable to brute force attacks and denial of service. ✅ Auto-fixed

**14. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
No CORS middleware is configured, which could lead to either overly permissive cross-origin requests or inconsistent browser behavior. ✅ Auto-fixed

**15. Deprecated Ethereum Provider Access Pattern** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Using window.ethereum.enable() is deprecated. The modern approach uses window.ethereum.request({ method: 'eth_requestAccounts' }). Additionally, mixing window.ethereum and window.web3 can lead to inconsistent behavior. ✅ Auto-fixed

**16. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but salt rounds should be verified** — `controllers/company.js`
Uses bcrypt which is good, but salt rounds should be verified ⚠️ Manual review

**2. Uses bcrypt with saltRounds=10 which is acceptable** — `controllers/voter.js`
Uses bcrypt with saltRounds=10 which is acceptable ⚠️ Manual review

**3. Dependencies should be audited for known vulnerabilities** — `package.json`
Dependencies should be audited for known vulnerabilities ⚠️ Manual review

**4. Uses fs-extra for file operations, ensure proper path validation** — `Ethereum/compile.js`
Uses fs-extra for file operations, ensure proper path validation ⚠️ Manual review

**5. Uses js-cookie for client-side cookie handling, ensure secure cookie flags** — `components/Header.js`
Uses js-cookie for client-side cookie handling, ensure secure cookie flags ⚠️ Manual review

**6. External CDN dependency for stylesheet** — `components/Layout.js`
External CDN dependency for stylesheet ⚠️ Manual review

**7. Client-side cookie handling should use secure flags** — `pages/company_login.js`
Client-side cookie handling should use secure flags ⚠️ Manual review

**8. Client-side cookie handling should use secure flags** — `pages/voter_login.js`
Client-side cookie handling should use secure flags ⚠️ Manual review

**9. Hardcoded Port Number** — `server.js:38`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variable. ✅ Auto-fixed

**10. Serving JavaScript File Directly via sendFile** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a .js file directly could expose server-side code. The path concatenation pattern is also potentially unsafe. ✅ Auto-fixed

**11. Sensitive Information in Console Logs** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
Logging the entire web3 object to console may expose sensitive configuration details, provider information, and internal state in production environments. ✅ Auto-fixed

**12. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**13. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, this should be configurable. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-16T05:41:20.650Z*
