# Code Review: PR #959 - Settings Page & 2FA

## Commits Reviewed

10 commits from Tarun Aditya and MukeshAbhi across 23 files (+1476/-684)

---

## Critical Bugs

### 1. `TwoFactorAuth.jsx:27-33` - verifyRequest uses stale state ✅ FIXED

Removed `data` from useApi config. Now passing `token` dynamically in `handleFinishSetup`. ✅ FIXED

---

### 2. `Pin.jsx:41` - onClose called without null check ✅ FIXED

Made `PropTypes.func.isRequired` so missing `onClose` will show a warning.

---

### 3. `Pin.jsx:60-63` - Backspace doesn't clear filled input ✅ FIXED

Now clears current digit on backspace before moving focus. ✅ FIXED

---

## Medium Severity

### 4. `TwoFactorAuth.jsx:10` - Incorrect initial mode state ✅ FIXED

Mode now initializes to `"INITIAL"` instead of `"VERIFIED"`.

---

### 5. `TwoFactorAuth.jsx:65-76` - No CSRF protection for enabling 2FA ⚠️ STILL TRUE

Enabling 2FA requires no confirmation (unlike disabling which requires password). An attacker could trick a logged-in user into enabling 2FA via a malicious page. Consider requiring password confirmation or re-authentication for security-sensitive operations.

---

## Minor Issues

### 6. Debug logs left in production code ✅ FIXED

- `Signin.jsx:16` - ✅ Removed
- `Pin.jsx:31` - ✅ Removed

---

### 7. Tests removed but not replaced ⚠️ STILL TRUE

`UserInfo.test.jsx` and `Signin.test.jsx` were deleted. The new MFA-enabled SignIn and new Pin component have no tests. SonarQube flagged "0.0% Coverage on New Code".

---

## Summary

| Severity | Issue                        | Status        |
| -------- | ---------------------------- | ------------- |
| Critical | 1. verifyRequest stale state | ✅ FIXED      |
| Critical | 2. onClose null check        | ✅ FIXED      |
| Critical | 3. Backspace doesn't clear   | ✅ FIXED      |
| Medium   | 4. Incorrect initial mode    | ✅ FIXED      |
| Medium   | 5. No CSRF on 2FA enable     | ⚠️ STILL TRUE |
| Minor    | 6. Debug logs                | ✅ FIXED      |
| Minor    | 7. Tests removed             | ⚠️ STILL TRUE |

**Remaining issues:**

- **#5** - Security concern (not a bug, but worth addressing)
- **#7** - Tests not replaced
