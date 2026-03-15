import React, { useMemo } from 'react';

const maskApiKey = (key = '') => {
  if (!key) return '';
  if (key.length < 12) return key;
  return `${key.slice(0, 7)}...${key.slice(-6)}`;
};

export default function Integrations({
  integration,
  externalPosts,
  docs,
  showSecret,
  onToggleSecret,
  onRegenerate,
  isRegenerating
}) {
  const curlSnippet = useMemo(() => {
    const body = JSON.stringify(docs?.sampleBody || {}, null, 2);
    return [
      `curl -X ${docs?.method || 'POST'}`,
      `  "${integration?.baseUrl || 'http://localhost:3001'}${docs?.endpoint || '/api/external/employer/jobs'}"`,
      '  -H "Content-Type: application/json"',
      `  -H "x-employer-api-key: ${integration?.externalApiKey || 'YOUR_API_KEY'}"`,
      `  -d '${body.replace(/\n/g, ' ')}'`
    ].join('\n');
  }, [docs, integration]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>External API Management</h3>
        <p style={{ marginTop: 0, color: '#64748b', fontSize: 13 }}>
          Post jobs from your website into this portal and centralize internal + external hiring operations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Company Workspace</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>
              /company/{integration?.companySlug || 'not-set'}
            </div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Onboarding Status</div>
            <div style={{ fontWeight: 700, color: integration?.onboardingStatus === 'approved' ? '#15803d' : '#b45309' }}>
              {(integration?.onboardingStatus || 'pending').toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Employer API Key</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <code style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}>
              {showSecret ? (integration?.externalApiKey || '') : maskApiKey(integration?.externalApiKey || '')}
            </code>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onToggleSecret} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 10px', background: '#fff', cursor: 'pointer' }}>
                {showSecret ? 'Hide Key' : 'Show Key'}
              </button>
              <button onClick={onRegenerate} disabled={isRegenerating} style={{ border: 'none', borderRadius: 8, padding: '8px 12px', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Integration Endpoint</div>
          <code style={{ display: 'block', marginBottom: 8 }}>{integration?.baseUrl || 'http://localhost:3001'}{docs?.endpoint || '/api/external/employer/jobs'}</code>
          <pre style={{ margin: 0, background: '#0f172a', color: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 12, overflowX: 'auto' }}>{curlSnippet}</pre>
        </div>
      </section>

      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>External API Job Post Logs</h3>
        {!externalPosts?.length ? (
          <p style={{ color: '#64748b', marginBottom: 0 }}>No external API activity yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {externalPosts.map((entry) => (
              <div key={entry.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{entry.actionType}</div>
                <div style={{ color: '#475569', fontSize: 12 }}>{new Date(entry.createdAt).toLocaleString()}</div>
                {entry.details?.title && <div style={{ fontSize: 12, marginTop: 4 }}>Title: {entry.details.title}</div>}
                {entry.details?.jobId && <div style={{ fontSize: 12 }}>Job ID: {entry.details.jobId}</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
