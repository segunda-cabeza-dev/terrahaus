type LeadWebhookPayload = {
  source: string;
  status: string;
  name: string;
  assigned: string;
  client_id?: string;
  tags?: string;
  contact?: string;
  title?: string;
  email?: string;
  website?: string;
  phonenumber?: string;
  company?: string;
  address?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  default_language?: string;
  description?: string;
  custom_contact_date?: string;
  contacted_today?: string;
  is_public?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} es requerido para webhook de leads`);
  return value;
}

function parseTimeoutMs(raw: string | undefined, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function isLeadsWebhookEnabled(): boolean {
  return Boolean(process.env.LEADS_WEBHOOK_URL && process.env.LEADS_WEBHOOK_AUTHTOKEN);
}

export async function sendLeadWebhook(payload: LeadWebhookPayload): Promise<{ status: number }> {
  const url = getRequiredEnv('LEADS_WEBHOOK_URL');
  const authtoken = getRequiredEnv('LEADS_WEBHOOK_AUTHTOKEN');
  const timeoutMs = parseTimeoutMs(process.env.LEADS_WEBHOOK_TIMEOUT_MS, 5000);

  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    const str = String(value);
    if (str.length === 0) continue;
    form.set(key, str);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        authtoken,
        accept: 'application/json',
        // Este endpoint valida parámetros estilo "form" (no JSON).
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Webhook leads respondió ${res.status}: ${text.slice(0, 500)}`);
    }

    return { status: res.status };
  } finally {
    clearTimeout(timeout);
  }
}
