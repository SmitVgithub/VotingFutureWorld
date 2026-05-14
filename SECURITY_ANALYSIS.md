# 🔒 Security Report

**Date:** 2026-05-14 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 37 vulnerabilities including hardcoded API keys, email injection flaws, and missing authentication controls. The exposed Infura API key and lack of input validation across all routes create immediate exploitation risks. Priority remediation required for credential exposure and injection vulnerabilities before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 3 | 3 |
| 🟡 medium | 17 | 9 |
| 🟢 low | 12 | 5 |

## Findings

### 🔴 Critical

**1. Hardcoded Email Credential (Username)** — `controllers/candidate.js:9`
```
user: st@gmail.com,
```
Email username is hardcoded directly in the source code without quotes, which exposes credentials and causes a syntax error. ✅ Auto-fixed

**2. Hardcoded Email Credential (Password)** — `controllers/candidate.js:10`
```
pass: SThifn@94840mdia,
```
Email password is hardcoded directly in the source code without quotes, exposing sensitive authentication credentials. ✅ Auto-fixed

**3. Hardcoded Mnemonic Seed Phrase** — `Ethereum/deploy.js:7`
```
'soda primary wheel try parrot such unfair swarm obvious collect tobacco blouse'
```
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word mnemonic provides complete access to the Ethereum wallet and all derived accounts. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoding connection strings makes it easy to accidentally commit sensitive database credentials and makes configuration inflexible across environments. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or client-side JavaScript bundles. ✅ Auto-fixed

### 🟠 High

**1. Email Header Injection via Unsanitized User Input** — `controllers/candidate.js:15`
```
subject: req.body.election_name + 'Registration',
```
User-supplied input (req.body.election_name) is directly concatenated into email subject without validation or sanitization, potentially allowing email header injection. ✅ Auto-fixed

**2. Missing Input Validation for Email Recipient** — `controllers/candidate.js:14`
```
to: req.body.email,
```
The recipient email address from user input is used directly without validation, potentially allowing email to be sent to arbitrary addresses. ✅ Auto-fixed

**3. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. This key provides access to the Infura blockchain infrastructure service. ✅ Auto-fixed

### 🟡 Medium

**1. Potential nodemailer usage may have hardcoded credentials similar to candidate controller** — `controllers/voter.js`
Potential nodemailer usage may have hardcoded credentials similar to candidate controller ⚠️ Manual review

**2. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**3. No authentication middleware on route** — `routes/candidate.js`
No authentication middleware on route ⚠️ Manual review

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

**9. HTML Injection in Email Body** — `controllers/candidate.js:16`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied input is directly concatenated into HTML email content without escaping, allowing HTML/script injection. ✅ Auto-fixed

**10. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and uses deprecated options. Connection failures will not be properly caught or logged, and the deprecated useNewUrlParser option should be removed in newer Mongoose versions. ✅ Auto-fixed

**11. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**12. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing. ✅ Auto-fixed

**13. Missing Rate Limiting** — `server.js:10`
```
const exp = express();
```
The application does not implement rate limiting, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**14. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS, which may lead to either overly permissive cross-origin requests or inconsistent browser behavior. ✅ Auto-fixed

**15. Serving JavaScript File Directly via sendFile** — `server.js:22`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Serving a JavaScript source file directly can expose server-side code and potentially sensitive information. Additionally, path.join is used incorrectly with string concatenation which could lead to path traversal issues. ✅ Auto-fixed

**16. Deprecated Ethereum Provider Access Pattern** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Using window.ethereum.enable() is deprecated. The modern approach uses window.ethereum.request({ method: 'eth_requestAccounts' }). Additionally, the enable() call is not awaited, which can lead to race conditions. ✅ Auto-fixed

**17. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but should verify salt rounds configuration** — `controllers/company.js`
Uses bcrypt which is good, but should verify salt rounds configuration ⚠️ Manual review

**2. Should audit dependencies for known vulnerabilities** — `package.json`
Should audit dependencies for known vulnerabilities ⚠️ Manual review

**3. Uses fs-extra for file operations, ensure proper path validation** — `Ethereum/compile.js`
Uses fs-extra for file operations, ensure proper path validation ⚠️ Manual review

**4. Uses js-cookie for client-side cookie handling, ensure secure cookie flags** — `components/Header.js`
Uses js-cookie for client-side cookie handling, ensure secure cookie flags ⚠️ Manual review

**5. External CDN dependency without integrity check** — `components/Layout.js`
External CDN dependency without integrity check ⚠️ Manual review

**6. Client-side cookie handling should use secure flags** — `pages/company_login.js`
Client-side cookie handling should use secure flags ⚠️ Manual review

**7. Client-side cookie handling should use secure flags** — `pages/voter_login.js`
Client-side cookie handling should use secure flags ⚠️ Manual review

**8. Hardcoded Port Number** — `server.js:40`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of being configurable via environment variables. ✅ Auto-fixed

**9. Deprecated Web3 Provider Access** — `Ethereum/web3.js:7`
```
web3 = new Web3(window.web3.currentProvider);
```
Using window.web3.currentProvider is deprecated. Modern dApps should use window.ethereum directly as the provider. ✅ Auto-fixed

**10. Sensitive Information in Console Logs** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
Logging the entire Web3 instance to the console may expose sensitive configuration details in production environments. ✅ Auto-fixed

**11. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing configuration flexibility. ✅ Auto-fixed

**12. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, the configuration should be externalized. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-14T16:03:33.395Z*
