// Backend for the portfolio page's "fit assessment" and Q&A widgets.
//
// Locked down so it can't be used as a free general-purpose Claude endpoint:
//   - same-origin requests only (no wildcard CORS)
//   - model and token limit fixed here, not chosen by the caller
//   - request size capped, and a daily per-visitor limit kept in Netlify Blobs
//     (visitors are counted by a salted hash of their IP; raw IPs are not stored)
//
// Accepts either {prompt: "..."} (index.html) or {messages: [...]} (index_dark.html,
// index_transparent.html). Returns the Anthropic response plus a `response` text field.

import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1000;
const MAX_INPUT_CHARS = 24000;
const PER_VISITOR_PER_DAY = Number(process.env.PROXY_REQUESTS_PER_DAY || 30);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const origin = req.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(req.url).host) return json({ error: 'Forbidden' }, 403);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'API key not configured' }, 500);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  let messages;
  if (typeof body.prompt === 'string') {
    messages = [{ role: 'user', content: body.prompt }];
  } else if (Array.isArray(body.messages)) {
    messages = body.messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content }));
  }
  if (!messages || !messages.length) return json({ error: 'Nothing to send' }, 400);
  if (JSON.stringify(messages).length > MAX_INPUT_CHARS) return json({ error: 'That request is too long.' }, 413);

  const day = new Date().toISOString().slice(0, 10);
  const visitor = crypto.createHash('sha256').update(`${context.ip}|${day}|proxy`).digest('hex').slice(0, 32);
  const store = getStore({ name: 'claude-proxy', consistency: 'strong' });
  const vkey = `visitors/${day}/${visitor}`;
  const used = (await store.get(vkey, { type: 'json' }))?.n ?? 0;
  if (used >= PER_VISITOR_PER_DAY) return json({ error: "You've reached today's limit. Please try again tomorrow." }, 429);
  await store.setJSON(vkey, { n: used + 1 });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages }),
    signal: AbortSignal.timeout(25000),
  }).catch((e) => ({ ok: false, status: 504, json: async () => ({ error: e.message }) }));

  const data = await res.json();
  if (res.ok) data.response = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  return json(data, res.status);
};
