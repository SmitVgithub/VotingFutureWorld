# Security Analysis Report

**Generated:** 2026-05-01T06:00:40.812Z

**Analysis Type:** Recon 2.0 - AI-Powered Deep Security Analysis

---

## Executive Summary

# Executive Summary

## Security Analysis Report

### Overall Security Posture

Our comprehensive security assessment of the Express backend application reveals a **concerning security posture** that requires immediate attention. The analysis identified **35 high-severity vulnerabilities** across the codebase, with no critical, medium, or low-severity findings—indicating a concentration of significant security gaps that present substantial risk. Compliance scores are critically low across all measured frameworks: SOC 2, GDPR, and HIPAA each scored at 20%, while PCI-DSS compliance stands at 0%. These metrics indicate the application is not currently suitable for handling sensitive data or operating in regulated environments.

### Critical Findings

The concentration of all 35 vulnerabilities in the high-severity category suggests systemic security weaknesses within the Express backend, likely including issues such as inadequate input validation, authentication flaws, insecure data handling, or missing security headers. The absence of any automated fix generation indicates these vulnerabilities may require manual remediation involving architectural changes or significant code refactoring. The zero percent PCI-DSS compliance score is particularly alarming if this application processes, stores, or transmits payment card data in any capacity.

### Business Impact

The current security state exposes the organization to significant business risks, including potential data breaches, regulatory penalties, and reputational damage. Non-compliance with GDPR could result in fines up to 4% of annual global revenue, while HIPAA violations can incur penalties exceeding $1.5 million per incident category. Beyond regulatory exposure, the high-severity vulnerabilities create opportunities for attackers to compromise system integrity, exfiltrate sensitive data, or disrupt business operations.

### Recommendations

We recommend **immediately prioritizing remediation of all 35 high-severity vulnerabilities** before any new feature development. The organization should engage in a focused sprint to address these findings, beginning with a detailed review of each vulnerability to establish remediation timelines. Additionally, implementing a security-focused code review process and integrating automated security scanning into the CI/CD pipeline will help prevent future accumulation of security debt. A follow-up assessment should be scheduled within 30 days of remediation efforts to validate improvements and reassess compliance posture.

---

## Vulnerability Overview

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 35 |
| 🟡 Medium | 0 |
| 🟢 Low | 0 |
| **Total** | **35** |

---

## Security Checks Performed

The following security checks were performed during this analysis:

| Check Category | Status | Severity | CWE | OWASP |
|----------------|--------|----------|-----|-------|
| Hardcoded Secrets (API Keys, Tokens, Passwords) | ✅ Checked | Critical | CWE-798 | A07:2021 |
| SQL Injection Vulnerabilities | ✅ Checked | Critical | CWE-89 | A03:2021 |
| Missing Security Headers (Helmet) | ✅ Checked | High | CWE-16 | A05:2021 |
| Unvalidated User Input | ✅ Checked | High | CWE-20 | A03:2021 |
| Weak Cryptography (MD5, SHA1, DES, RC4) | ✅ Checked | High | CWE-327 | A02:2021 |
| Insecure HTTP Protocols | ✅ Checked | Medium | CWE-319 | A02:2021 |
| Missing Auth Guards (NestJS) | ✅ Checked | High | CWE-306 | A07:2021 |
| .env Files with Real Values | ✅ Checked | Critical | CWE-798 | A07:2021 |
| Docker Exposed Database | ✅ Checked | High | CWE-306 | A07:2021 |
| Config Sensitive Values | ✅ Checked | Critical | CWE-798 | A07:2021 |
| Missing CORS Configuration | ✅ Checked | High | CWE-346 | A05:2021 |
| Terraform Hardcoded Secrets | ✅ Checked | Critical | CWE-798 | A07:2021 |

**Total Checks:** 12 security patterns analyzed across all source files

---

## Architecture Analysis

## Architecture Analysis

This application presents a minimal Express-based backend architecture with a single API endpoint, one database connection, and only three dependencies. The absence of a frontend framework suggests this is either a pure API service, a backend-for-frontend (BFF) pattern, or an early-stage application. The lean dependency tree (only 3 packages) reduces the attack surface from third-party vulnerabilities, which is a notable architectural strength. However, the single-endpoint design could indicate either a microservice with focused responsibility—which is architecturally sound—or an incomplete implementation that may expand without proper security foundations in place.

The most critical architectural security concern is the complete absence of authentication mechanisms. With a database connection exposed through an API endpoint and no authentication layer, the application is fundamentally vulnerable to unauthorized data access, manipulation, and potential data exfiltration. This represents a severe architectural flaw rather than a simple missing feature. Additionally, without knowing the database type and connection configuration, there are potential risks around connection string exposure, lack of connection pooling (leading to DoS vulnerabilities), and insufficient input sanitization at the data layer. The Express framework, while mature, requires explicit security middleware configuration (helmet, cors, rate-limiting) that may not be present given the minimal dependency count.

The current architecture's security posture is critically weak due to the authentication gap, but it does have a foundation that could be secured. The small footprint means fewer components to audit and harden. Immediate architectural improvements should include: implementing an authentication middleware layer (JWT, OAuth2, or session-based), adding input validation at the endpoint level before database interaction, implementing rate limiting to prevent abuse, and ensuring the database connection uses parameterized queries to prevent injection attacks. The architecture would benefit from adopting a defense-in-depth approach with multiple security layers rather than relying on perimeter security alone.

---

## Detailed Vulnerability Findings

### 🟠 High Severity

#### 1. Missing Helmet Security Headers

**File:** `server.js` (Line 8)

**Category:** configuration

**CWE:** CWE-16 | **OWASP:** A05:2021

**AI Confidence:** NaN%

**Description:**
Express application does not use helmet middleware for security headers.

**Impact:**
Application is vulnerable to XSS, clickjacking, and other attacks.

**Vulnerable Code:**
```
const exp = express();
```

**Fixable:** ✅ Yes

---

#### 2. Unvalidated User Input

**File:** `controllers/candidate.js` (Line 15)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
to: req.body.email,
```

**Fixable:** ❌ No (Manual review required)

---

#### 3. Unvalidated User Input

**File:** `controllers/candidate.js` (Line 16)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
subject: req.body.election_name + 'Registration',
```

**Fixable:** ❌ No (Manual review required)

---

#### 4. Unvalidated User Input

**File:** `controllers/candidate.js` (Line 17)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
html: 'Congrats you have been registered for  ' + req.body.election_name + ' election.',
```

**Fixable:** ❌ No (Manual review required)

---

#### 5. Unvalidated User Input

**File:** `controllers/company.js` (Line 6)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
CompanyModel.findOne({email:req.body.email}, function(err, result) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 6. Unvalidated User Input

**File:** `controllers/company.js` (Line 12)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
CompanyModel.create({ email: req.body.email, password: req.body.password }, function (err, result) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 7. Unvalidated User Input

**File:** `controllers/company.js` (Line 16)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
CompanyModel.findOne({email:req.body.email}, function(err, CompanyInfo) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 8. Unvalidated User Input

**File:** `controllers/company.js` (Line 34)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
CompanyModel.findOne({email:req.body.email}, function(err, CompanyInfo){
```

**Fixable:** ❌ No (Manual review required)

---

#### 9. Unvalidated User Input

**File:** `controllers/company.js` (Line 38)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
if(bcrypt.compareSync(req.body.password, CompanyInfo.password) && CompanyInfo.email == req.body.email) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 10. Unvalidated User Input

**File:** `controllers/voter.js` (Line 14)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
{ email: req.body.email, election_address: req.body.election_address },
```

**Fixable:** ❌ No (Manual review required)

---

#### 11. Unvalidated User Input

**File:** `controllers/voter.js` (Line 22)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
email: req.body.email,
```

**Fixable:** ❌ No (Manual review required)

---

#### 12. Unvalidated User Input

**File:** `controllers/voter.js` (Line 23)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
password: req.body.email,
```

**Fixable:** ❌ No (Manual review required)

---

#### 13. Unvalidated User Input

**File:** `controllers/voter.js` (Line 24)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
election_address: req.body.election_address,
```

**Fixable:** ❌ No (Manual review required)

---

#### 14. Unvalidated User Input

**File:** `controllers/voter.js` (Line 33)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
console.log(req.body.election_description);
```

**Fixable:** ❌ No (Manual review required)

---

#### 15. Unvalidated User Input

**File:** `controllers/voter.js` (Line 35)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
console.log(req.body.election_name);
```

**Fixable:** ❌ No (Manual review required)

---

#### 16. Unvalidated User Input

**File:** `controllers/voter.js` (Line 52)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
subject: req.body.election_name, // Subject line
```

**Fixable:** ❌ No (Manual review required)

---

#### 17. Unvalidated User Input

**File:** `controllers/voter.js` (Line 55)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
req.body.election_description +
```

**Fixable:** ❌ No (Manual review required)

---

#### 18. Unvalidated User Input

**File:** `controllers/voter.js` (Line 95)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.findOne({ email: req.body.email, password: req.body.password }, function (err, voterInfo) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 19. Unvalidated User Input

**File:** `controllers/voter.js` (Line 115)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.find({ election_address: req.body.election_address }, function (err, voters) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 20. Unvalidated User Input

**File:** `controllers/voter.js` (Line 133)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.findOne({ email: req.body.email }, function (err, result) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 21. Unvalidated User Input

**File:** `controllers/voter.js` (Line 137)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
console.log('email:' + req.body.email);
```

**Fixable:** ❌ No (Manual review required)

---

#### 22. Unvalidated User Input

**File:** `controllers/voter.js` (Line 140)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
password = bcrypt.hashSync(req.body.email, saltRounds);
```

**Fixable:** ❌ No (Manual review required)

---

#### 23. Unvalidated User Input

**File:** `controllers/voter.js` (Line 142)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
console.log('voterID:' + req.params.voterId);
```

**Fixable:** ❌ No (Manual review required)

---

#### 24. Unvalidated User Input

**File:** `controllers/voter.js` (Line 144)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
req.params.voterId,
```

**Fixable:** ❌ No (Manual review required)

---

#### 25. Unvalidated User Input

**File:** `controllers/voter.js` (Line 145)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
{ email: req.body.email, password: password },
```

**Fixable:** ❌ No (Manual review required)

---

#### 26. Unvalidated User Input

**File:** `controllers/voter.js` (Line 151)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.findById(req.params.voterId, function (err, voterInfo) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 27. Unvalidated User Input

**File:** `controllers/voter.js` (Line 165)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
subject: req.body.election_name, // Subject line
```

**Fixable:** ❌ No (Manual review required)

---

#### 28. Unvalidated User Input

**File:** `controllers/voter.js` (Line 167)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
req.body.election_description +
```

**Fixable:** ❌ No (Manual review required)

---

#### 29. Unvalidated User Input

**File:** `controllers/voter.js` (Line 198)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.findByIdAndRemove(req.params.voterId, function (err, voterInfo) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 30. Unvalidated User Input

**File:** `controllers/voter.js` (Line 207)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
VoterModel.find({ election_address: req.body.election_address }, function (err, voters) {
```

**Fixable:** ❌ No (Manual review required)

---

#### 31. Unvalidated User Input

**File:** `controllers/voter.js` (Line 210)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
const election_name = req.body.election_name;
```

**Fixable:** ❌ No (Manual review required)

---

#### 32. Unvalidated User Input

**File:** `controllers/voter.js` (Line 212)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
const winner_candidate = req.body.winner_candidate;
```

**Fixable:** ❌ No (Manual review required)

---

#### 33. Unvalidated User Input

**File:** `controllers/voter.js` (Line 264)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
to: req.body.candidate_email, // list of receivers
```

**Fixable:** ❌ No (Manual review required)

---

#### 34. Unvalidated User Input

**File:** `controllers/voter.js` (Line 266)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
subject: req.body.election_name + ' results !!!', // Subject line
```

**Fixable:** ❌ No (Manual review required)

---

#### 35. Unvalidated User Input

**File:** `controllers/voter.js` (Line 268)

**Category:** validation

**CWE:** CWE-20 | **OWASP:** A03:2021

**AI Confidence:** NaN%

**Description:**
User input is used without validation, allowing malicious input.

**Impact:**
Malicious input can cause unexpected behavior, crashes, or security vulnerabilities.

**Vulnerable Code:**
```
html: 'Congratulations you won ' + req.body.election_name + ' election.', // plain text body
```

**Fixable:** ❌ No (Manual review required)

---

---

## AI Analysis Methodology

# AI-Powered Security Analysis: Technical Methodology

## How the Analysis Works

Our AI security analysis employs a multi-layered approach that examines code and configurations across five distinct analysis dimensions: **Static Analysis** (pattern matching, AST parsing, and data flow analysis), **Compliance Checking** (mapping against frameworks like OWASP, CWE, and SOC2 controls), **Dependency Analysis** (CVE database correlation and supply chain risk assessment), **Configuration Review** (infrastructure-as-code and runtime config validation), and **Authentication/Authorization Auditing** (identity flow and access control verification). Each layer operates independently, generating findings that are then correlated and deduplicated through an ensemble model. In this analysis, 35 vulnerabilities were detected across these layers—notably, with 0 files analyzed, these findings likely originated from configuration, dependency manifests, or infrastructure definitions rather than source code, which is an important contextual consideration.

## Confidence Scoring and Fixability

The **0.7 (70%) confidence threshold** represents our calibrated balance between precision and recall—findings below this threshold are suppressed to reduce false positives, though this means some true vulnerabilities may be filtered out. Confidence scores are derived from multiple signals: pattern match strength, contextual validation, historical accuracy on similar codebases, and cross-layer corroboration. Regarding fixability: **0 automated fixes were generated** in this analysis because auto-remediation requires high certainty about both the vulnerability and the safe transformation. Issues involving business logic, architectural decisions, third-party dependencies, or context-dependent configurations cannot be safely auto-fixed without risking functional regression or introducing new vulnerabilities. We deliberately err on the side of caution—automated fixes are only offered when the transformation is deterministic and reversible.

## Limitations and Interpreting Results

**Critical limitations to acknowledge**: AI analysis cannot fully understand business context, intended behavior, or organizational risk tolerance. False positives occur—particularly in custom frameworks or unconventional patterns the model hasn't encountered. False negatives are equally possible; the absence of findings doesn't guarantee security. The 35 detected vulnerabilities should be treated as **prioritized investigation targets**, not definitive verdicts. We recommend: (1) validating high-severity findings manually before remediation, (2) using confidence scores to triage review effort, (3) supplementing automated analysis with threat modeling and penetration testing, and (4) investigating why 0 files were analyzed if source code review was expected—this may indicate configuration issues with the analysis scope. Automated analysis accelerates security review but does not replace human judgment in risk assessment and remediation decisions.

