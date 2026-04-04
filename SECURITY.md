# Security Policy

## Supported Versions

Note: Only the **latest version of Waddle** will receive security fixes.

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |

## Known Data Handling

Waddle's **Custom Skin (Closet)** feature reads your Miniblox session token from
`localStorage` and sends it to `coolmathblox.ca` to apply skins.

- Your token is **never** logged, stored externally, or shared beyond that single request
- The request is made **only** when you click to equip a skin
- You can audit this yourself — see `applySkin()` in `Waddle.user.js`
- **Only use this feature if you trust `coolmathblox.ca`**

If you believe this endpoint has been compromised, or that Waddle is mishandling
your token in any way, please report it privately (see below) rather than opening
a public issue — public issues could expose other users' sessions.

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

Report privately via one of:

- GitHub Private Vulnerability Reporting — click **"Report a vulnerability"**
  under the [Security tab](../../security/advisories/new) of this repo
- Direct message **@TheM1ddleM1n** on GitHub

Please include:
- A clear description of the vulnerability
- Steps to reproduce it
- What data or accounts could be affected
- Any suggested fix if you have one

## Response

- I will pick up your message in a **48 hours** timeframe
- A fix or mitigation within **7 days** for critical issues 
- Credit given in the readme/userscript if you want it
- If i cannot fix the issue - you will have to email miniblox to either mitigate or fix
