'use client';

import { useFormState } from 'react-dom';
import { updateSettingsAction, updateHeroBgAction, type FormState } from '@/lib/actions/settings';
import SubmitButton from './SubmitButton';

const initial: FormState = {};

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction] = useFormState(updateSettingsAction, initial);
  const [bgState, bgFormAction] = useFormState(updateHeroBgAction, initial);

  return (
    <>
      {/* ── Business Information ── */}
      <form action={formAction} className="form-grid">
        {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}
        {state.success && <div className="alert alert--success" role="status">{state.success}</div>}

        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor="business_name">Business Name</label>
            <input id="business_name" name="business_name" type="text" required
              defaultValue={settings.business_name} />
          </div>
          <div className="field">
            <label htmlFor="tagline">Tagline</label>
            <input id="tagline" name="tagline" type="text" defaultValue={settings.tagline} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" required defaultValue={settings.address} />
        </div>

        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor="whatsapp_number">Main WhatsApp Number</label>
            <input id="whatsapp_number" name="whatsapp_number" type="tel" required
              defaultValue={settings.whatsapp_number} />
            <span className="hint">Used for all WhatsApp order buttons across the website.</span>
          </div>
          <div className="field">
            <label htmlFor="contact_2">Other Contact Number</label>
            <input id="contact_2" name="contact_2" type="tel" defaultValue={settings.contact_2} />
          </div>
        </div>

        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor="contact_3">Other Contact Number (2)</label>
            <input id="contact_3" name="contact_3" type="tel" defaultValue={settings.contact_3} />
          </div>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" defaultValue={settings.email} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="business_description">Business Description</label>
          <textarea id="business_description" name="business_description" maxLength={2000}
            defaultValue={settings.business_description} />
          <span className="hint">Shown on the homepage and About page.</span>
        </div>

        <div className="form-actions"><SubmitButton label="Save Settings" /></div>
      </form>

      {/* ── Hero Background Image ── */}
      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--gray-100)' }} />
      <div style={{ marginBottom: '0.5rem' }}>
        <strong style={{ fontSize: '0.95rem', color: 'var(--navy-800)' }}>Hero Background Image</strong>
        <p className="hint" style={{ marginTop: '0.3rem' }}>
          Upload a full-width background photo for the homepage hero section (JPG / PNG / WEBP, max 6 MB).
          Leave empty to use the default brand gradient.
        </p>
      </div>

      {/* Current preview */}
      {settings.hero_bg_image && (
        <div style={{ marginBottom: '1rem' }}>
          <img
            src={settings.hero_bg_image}
            alt="Current hero background"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-300)',
            }}
          />
          <span className="hint" style={{ display: 'block', marginTop: '0.35rem' }}>Current background image</span>
        </div>
      )}

      {bgState.error && <div className="alert alert--error" role="alert">{bgState.error}</div>}
      {bgState.success && <div className="alert alert--success" role="status">{bgState.success}</div>}

      {/* Upload form */}
      <form action={bgFormAction} encType="multipart/form-data" className="form-grid">
        <input type="hidden" name="_action" value="upload" />
        <div className="field">
          <label htmlFor="hero_bg_image">Choose New Background Image</label>
          <input
            id="hero_bg_image"
            name="hero_bg_image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ padding: '0.5rem 0' }}
          />
        </div>
        <div className="form-actions">
          <SubmitButton label="Upload Background" />
        </div>
      </form>

      {/* Remove form */}
      {settings.hero_bg_image && (
        <form action={bgFormAction} style={{ marginTop: '0.75rem' }}>
          <input type="hidden" name="_action" value="remove" />
          <button
            type="submit"
            className="btn btn--outline btn--sm"
            style={{ borderColor: 'var(--red-600)', color: 'var(--red-600)' }}
          >
            ✕ Remove Background Image
          </button>
        </form>
      )}
    </>
  );
}
