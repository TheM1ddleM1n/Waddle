# Security Policy

## Supported Versions

Only the latest version of Waddle receives security fixes.

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |
| Older   | ❌        |

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

**Do not open a public GitHub issue for security vulnerabilities.**

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

- Acknowledgement within **48 hours**
- A fix or mitigation within **7 days** for critical issues
- Credit given in the changelog if you want it
