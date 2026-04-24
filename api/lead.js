// Vercel serverless function — proxies form submission to GHL
// Keeps PIT token server-side (env var GHL_PIT_TOKEN, never exposed to client)

const GHL_LOCATION_ID = 'fQiT6tA026tzxAjXFopP';
const GHL_API = 'https://services.leadconnectorhq.com';

// Map landing-page route → GHL source tag
const ROUTE_TO_TAG = {
  'home':            'marty-source-website-home',
  'credit-denied':   'marty-source-website-credit',
  'car-died':        'marty-source-website-car-died',
  'something-nicer': 'marty-source-website-upgrade',
  'family':          'marty-source-website-family',
  'about':           'marty-source-website-home',
  'contact':         'marty-source-website-home',
};

// Custom field IDs (verified via MCP read 2026-04-24)
const FIELDS = {
  vehicle:           'dsSPJjS0WF1vY3EdGLz8',
  downPayment:       'yJz436AfFUsYbIyAjT4k',
  biggestChallenge:  '6nC5upxECrv52C1qP7kD',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, phone, vehicle, downPayment, biggestChallenge, sourceRoute, skippedQuickForm } = req.body || {};

  if (!firstName || !phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  if (!process.env.GHL_PIT_TOKEN) {
    console.error('GHL_PIT_TOKEN env var not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const sourceTag = ROUTE_TO_TAG[sourceRoute] || 'marty-source-website-home';
  const normalizedPhone = '+1' + phone.replace(/\D/g, '');

  const headers = {
    'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    // 1) Upsert contact WITHOUT tags (so we don't overwrite existing tags)
    const upsertRes = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        phone: normalizedPhone,
        source: 'Website Phase A',
        customFields: [
          { id: FIELDS.vehicle, value: vehicle },
          { id: FIELDS.downPayment, value: downPayment },
          { id: FIELDS.biggestChallenge, value: biggestChallenge },
        ],
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error('GHL upsert error:', upsertRes.status, errText);
      return res.status(502).json({ error: 'Upstream error (upsert)', status: upsertRes.status });
    }

    const upsertData = await upsertRes.json();
    const contactId = upsertData?.contact?.id;

    if (!contactId) {
      console.error('GHL upsert returned no contact ID', upsertData);
      return res.status(502).json({ error: 'No contact ID returned' });
    }

    // 2) Add tags (additive — preserves existing tags on the contact).
    // `marty-quick-form-skip` signals Marty to ask §5-D qualification over
    // SMS since the user skipped the in-form vehicle/down/challenge questions.
    const baseTags = [sourceTag, 'marty-triggered'];
    const tags = skippedQuickForm ? [...baseTags, 'marty-quick-form-skip'] : baseTags;
    const tagsRes = await fetch(`${GHL_API}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tags }),
    });

    if (!tagsRes.ok) {
      const errText = await tagsRes.text();
      console.error('GHL add-tags error:', tagsRes.status, errText);
      // Don't fail the whole request — contact is created, tags are nice-to-have
      return res.status(200).json({ success: true, contactId, warning: 'Tags not applied' });
    }

    return res.status(200).json({ success: true, contactId });
  } catch (err) {
    console.error('Lead submission error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
