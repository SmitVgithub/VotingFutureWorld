# 🔒 Security Report

**Date:** 2026-05-11 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 37 vulnerabilities including hardcoded API keys (Infura) and missing input validation across multiple endpoints. Email injection vulnerabilities in candidate controller pose immediate exploitation risk. Priority remediation required for credential exposure and injection attack vectors before production deployment.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 2 | 2 |
| 🟡 medium | 18 | 9 |
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
The HD wallet mnemonic seed phrase is hardcoded directly in the source code. This 12-word mnemonic provides complete access to the Ethereum wallet and all associated funds. ✅ Auto-fixed

**4. Hardcoded MongoDB Connection String** — `config/database.js:4`
```
const mongoDB = 'mongodb://localhost/BlockVotes';
```
The MongoDB connection string is hardcoded directly in the source code. While this example doesn't contain credentials, hardcoded connection strings often get expanded to include usernames and passwords, and the database name itself may be sensitive information. ✅ Auto-fixed

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
User-supplied email address is used directly without validation, potentially allowing email header injection or sending emails to unintended recipients. ✅ Auto-fixed

**2. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0) embedded in the URL. ✅ Auto-fixed

### 🟡 Medium

**1. Uses nodemailer - may have hardcoded credentials in full file** — `controllers/voter.js`
Uses nodemailer - may have hardcoded credentials in full file ⚠️ Manual review

**2. Salt rounds defined but need to verify proper usage** — `controllers/voter.js`
Salt rounds defined but need to verify proper usage ⚠️ Manual review

**3. No input validation middleware visible** — `routes/candidate.js`
No input validation middleware visible ⚠️ Manual review

**4. No rate limiting on registration endpoint** — `routes/candidate.js`
No rate limiting on registration endpoint ⚠️ Manual review

**5. No input validation middleware** — `routes/company.js`
No input validation middleware ⚠️ Manual review

**6. No rate limiting on authentication endpoint** — `routes/company.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**7. No input validation middleware** — `routes/voter.js`
No input validation middleware ⚠️ Manual review

**8. No rate limiting on authentication endpoint** — `routes/voter.js`
No rate limiting on authentication endpoint ⚠️ Manual review

**9. PUT endpoint may lack authorization checks** — `routes/voter.js`
PUT endpoint may lack authorization checks ⚠️ Manual review

**10. HTML Injection in Email Content** — `controllers/candidate.js:17`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without sanitization, allowing HTML/script injection. ✅ Auto-fixed

**11. Missing Input Validation - Subject Injection** — `controllers/candidate.js:16`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is used directly in email subject without validation, potentially allowing email header injection. ✅ Auto-fixed

**12. Missing MongoDB Connection Error Handling** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose connection does not handle connection errors or use recommended security options. Missing error handling can cause silent failures, and deprecated options should be updated. ✅ Auto-fixed

**13. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to manage different environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**14. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing. ✅ Auto-fixed

**15. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
No rate limiting is implemented on the Express routes, making the application vulnerable to brute force attacks and denial of service. ✅ Auto-fixed

**16. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
No CORS middleware is configured. Without explicit CORS configuration, the application may either be too permissive or have inconsistent cross-origin behavior. ✅ Auto-fixed

**17. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. This makes it difficult to change environments and could expose infrastructure details. ✅ Auto-fixed

**18. Deprecated Ethereum Provider API Usage** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
Using the deprecated window.ethereum.enable() method without proper async/await handling. This method is deprecated in favor of eth_requestAccounts and the promise is not being awaited, which can lead to race conditions. ✅ Auto-fixed

### 🟢 Low

**1. Uses bcrypt which is good, but should verify salt rounds are adequate** — `controllers/company.js`
Uses bcrypt which is good, but should verify salt rounds are adequate ⚠️ Manual review

**2. Dependencies may have known vulnerabilities - needs npm audit** — `package.json`
Dependencies may have known vulnerabilities - needs npm audit ⚠️ Manual review

**3. Uses fs-extra with removeSync - ensure proper path validation** — `Ethereum/compile.js`
Uses fs-extra with removeSync - ensure proper path validation ⚠️ Manual review

**4. Uses js-cookie - ensure secure cookie handling** — `components/Header.js`
Uses js-cookie - ensure secure cookie handling ⚠️ Manual review

**5. External CDN dependency without integrity check** — `components/Layout.js`
External CDN dependency without integrity check ⚠️ Manual review

**6. Client-side cookie handling - ensure httpOnly and secure flags** — `pages/company_login.js`
Client-side cookie handling - ensure httpOnly and secure flags ⚠️ Manual review

**7. Client-side cookie handling - ensure httpOnly and secure flags** — `pages/voter_login.js`
Client-side cookie handling - ensure httpOnly and secure flags ⚠️ Manual review

**8. Hardcoded Port Number** — `server.js:38`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000. This should be configurable via environment variables for flexibility across different environments. ✅ Auto-fixed

**9. Serving JavaScript File Directly as Response** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Sending a .js file directly via sendFile may expose server-side code. This appears to be a Next.js page which should be handled by Next.js routing, not served as a static file. ✅ Auto-fixed

**10. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code, reducing deployment flexibility. ✅ Auto-fixed

**11. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded directly in the source code. While HTTPS is secure, this should be configurable. ✅ Auto-fixed

**12. Sensitive Information Logged to Console** — `Ethereum/web3.js:8`
```
console.log('Web3: ', web3);
```
Web3 instance and provider information is being logged to the console, which may expose sensitive configuration details in production environments. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T16:29:39.616Z*
