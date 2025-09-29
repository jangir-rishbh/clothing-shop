import crypto from 'crypto';

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'dev_captcha_secret_change_me';

export type CaptchaPayload = {
  code: string; // plaintext alphabetic code, e.g., 'XQPRT'
  exp: number;  // epoch seconds expiry
};

// Generate an alphabet-only code (A-Z), default length 5
export function generateAlphaCode(length = 5): string {
  // Now generating numeric-only codes as requested: 0-9
  const digits = '0123456789';
  let out = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    out += digits[bytes[i] % digits.length];
  }
  return out;
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', CAPTCHA_SECRET).update(data).digest('base64url');
}

export function signCaptcha(payload: CaptchaPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = hmac(body);
  return `${body}.${sig}`;
}

export function verifyCaptchaToken(token: string): CaptchaPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (hmac(body) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CaptchaPayload;
    if (typeof payload.code !== 'string' || typeof payload.exp !== 'number') return null;
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Minimal SVG with wavey baseline to resist trivial OCR; keep simple and dependency-free
export function captchaToSvg(code: string): string {
  const width = 180;
  const height = 60;
  const chars = code.split('');
  const charWidth = width / (chars.length + 1);
  const noiseLines = Array.from({ length: 3 }).map((_, idx) => {
    const y1 = 10 + idx * 15;
    const y2 = 50 - idx * 10;
    return `<path d="M0 ${y1} C ${width / 3} ${y2}, ${(2 * width) / 3} ${y1}, ${width} ${y2}" stroke="#${(Math.random()*0xffffff|0).toString(16).padStart(6,'0')}" stroke-width="1" fill="none" opacity="0.4"/>`;
  }).join('');

  const letters = chars.map((ch, i) => {
    const x = (i + 0.7) * charWidth + (Math.random() * 10 - 5);
    const y = 35 + (Math.random() * 10 - 5);
    const rotate = Math.floor(Math.random() * 30 - 15);
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="28" font-family="Verdana, Geneva, Tahoma, sans-serif" fill="#222" transform="rotate(${rotate} ${x.toFixed(1)} ${y.toFixed(1)})" letter-spacing="2">${ch}</text>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f4f6f9"/>
  ${noiseLines}
  ${letters}
</svg>`;
}
