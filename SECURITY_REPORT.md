# 🔒 Security Report

**Date:** 2026-05-11 | **Stack:** Unknown / Unknown

## Summary

Critical security posture with 25 vulnerabilities including a hardcoded Infura API key that must be rotated immediately. The application lacks fundamental security controls including Helmet middleware, rate limiting, and CORS configuration, leaving it exposed to common web attacks. Multiple email injection vectors and missing input validation create significant exploitation opportunities.

## Severity Breakdown

| Severity | Total | Auto-Fixed |
|----------|-------|------------|
| 🔴 critical | 5 | 5 |
| 🟠 high | 1 | 1 |
| 🟡 medium | 11 | 11 |
| 🟢 low | 8 | 4 |

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
The MongoDB connection string is hardcoded directly in the source code. This exposes database connection details and makes it difficult to manage different environments. If credentials are added later, they would be exposed in version control. ✅ Auto-fixed

**5. Hardcoded Infura API Key** — `Ethereum/web3.js:10`
```
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0');
```
The Infura API key is hardcoded directly in the source code. This exposes the API key to anyone with access to the codebase, version control history, or bundled client-side JavaScript. ✅ Auto-fixed

### 🟠 High

**1. Hardcoded Infura API Key** — `Ethereum/deploy.js:8`
```
'https://rinkeby.infura.io/v3/29bcae4ee7454a118a2b0f0f4d86c0e0'
```
The Infura API endpoint contains a hardcoded API key (29bcae4ee7454a118a2b0f0f4d86c0e0). This key provides access to the Infura Ethereum node service. ✅ Auto-fixed

### 🟡 Medium

**1. Missing Input Validation on Email Parameter** — `controllers/candidate.js:14`
```
to: req.body.email,
```
User-supplied email address is used directly without validation, potentially allowing email header injection or sending to unintended recipients. ✅ Auto-fixed

**2. Potential Email Header Injection via Subject** — `controllers/candidate.js:15`
```
subject: req.body.election_name + 'Registration',
```
User-supplied election_name is concatenated directly into the email subject without sanitization, potentially allowing email header injection. ✅ Auto-fixed

**3. Potential HTML Injection in Email Body** — `controllers/candidate.js:16`
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```
User-supplied election_name is directly concatenated into HTML email content without escaping, allowing HTML/script injection. ✅ Auto-fixed

**4. Missing Error Handling for Database Connection** — `config/database.js:5`
```
mongoose.connect(mongoDB,{ useNewUrlParser: true });
```
The mongoose.connect() call lacks error handling and does not use recommended connection options for security and stability. Missing useUnifiedTopology option and no connection error handling. ✅ Auto-fixed

**5. Hardcoded Ethereum Contract Address** — `Ethereum/election_factory.js:6`
```
'0xF5d3574DDc21D8Bd8bcB380de232cbbc8161234e'
```
The Ethereum contract address is hardcoded directly in the source code. While contract addresses are public on the blockchain, hardcoding them makes it difficult to switch between environments (development, staging, production) and could lead to accidentally deploying with wrong contract addresses. ✅ Auto-fixed

**6. Missing Helmet Security Middleware** — `server.js:1`
```
const express = require('express');
```
The Express application does not use Helmet middleware, which sets various HTTP headers to help protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing attacks. ✅ Auto-fixed

**7. Missing Rate Limiting** — `server.js:22`
```
exp.get('/', function (req, res) {
```
The application does not implement rate limiting on any routes, making it vulnerable to brute force attacks, denial of service, and API abuse. ✅ Auto-fixed

**8. Missing CORS Configuration** — `server.js:10`
```
const exp = express();
```
The application does not configure CORS (Cross-Origin Resource Sharing), which could either leave it open to cross-origin attacks or cause functionality issues when accessed from different origins. ✅ Auto-fixed

**9. Path Traversal Risk in Static File Serving** — `server.js:23`
```
res.sendFile(path.join(__dirname + '/pages/homepage.js'));
```
Using string concatenation with path.join is redundant and could lead to path traversal issues. The pattern should use path.join properly with separate arguments. ✅ Auto-fixed

**10. Deprecated ethereum.enable() Usage Without Proper Error Handling** — `Ethereum/web3.js:6`
```
console.log(window.ethereum.enable());
```
The code uses the deprecated window.ethereum.enable() method and logs the result (which is a Promise) without awaiting it or handling potential errors. This can lead to unhandled promise rejections and doesn't properly wait for user authorization. ✅ Auto-fixed

**11. Hardcoded IPFS Host Configuration** — `ipfs.js:2`
```
host: 'ipfs.infura.io'
```
The IPFS host is hardcoded directly in the source code. While not a secret, hardcoding infrastructure endpoints makes it difficult to change environments and could expose internal infrastructure details. ✅ Auto-fixed

### 🟢 Low

**1. Verify bcrypt salt rounds are adequate** — `controllers/company.js`
Verify bcrypt salt rounds are adequate ⚠️ Manual review

**2. Potential nodemailer usage may have hardcoded credentials** — `controllers/voter.js`
Potential nodemailer usage may have hardcoded credentials ⚠️ Manual review

**3. Dependencies should be audited for known vulnerabilities** — `package.json`
Dependencies should be audited for known vulnerabilities ⚠️ Manual review

**4. External CDN resource loaded over HTTP should verify integrity** — `components/Layout.js`
External CDN resource loaded over HTTP should verify integrity ⚠️ Manual review

**5. Hardcoded Port Number** — `server.js:39`
```
exp.use(handler).listen(3000, function () {
```
The server port is hardcoded to 3000 instead of using an environment variable, reducing deployment flexibility and potentially exposing configuration details. ✅ Auto-fixed

**6. Sensitive Information Logged to Console** — `Ethereum/web3.js:7`
```
console.log('Web3: ', web3);
```
The Web3 instance is logged to the console, which may expose sensitive configuration details including provider URLs and potentially API keys in production environments. ✅ Auto-fixed

**7. Hardcoded IPFS Port Configuration** — `ipfs.js:2`
```
port: 5001
```
The IPFS port is hardcoded directly in the source code. This reduces flexibility for different deployment environments. ✅ Auto-fixed

**8. Hardcoded IPFS Protocol Configuration** — `ipfs.js:2`
```
protocol: 'https'
```
The IPFS protocol is hardcoded. While HTTPS is correct, this should be configurable for different environments. ✅ Auto-fixed

## Action Plan

*Generated by Agnixa Recon 2.0 Brain — 2026-05-11T16:14:40.664Z*
