'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { VerificationTier } from '@/lib/alternatives/types';

interface TargetOption {
  slug: string;
  name: string;
}

const AVAILABLE_TARGETS: TargetOption[] = [
  { slug: 'general', name: 'None / Independent Tool' },
  { slug: 'wikipedia', name: 'Wikipedia' },
  { slug: 'notion', name: 'Notion' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'spotify', name: 'Spotify' },
  { slug: 'duolingo', name: 'Duolingo' },
  { slug: 'stack-overflow', name: 'Stack Overflow' },
  { slug: 'reddit', name: 'Reddit' },
  { slug: 'twitter-x', name: 'Twitter / X' },
  { slug: 'tiktok', name: 'TikTok' },
  { slug: 'linkedin', name: 'LinkedIn' },
  { slug: 'goodreads', name: 'Goodreads' },
  { slug: 'pinterest', name: 'Pinterest' },
  { slug: 'imdb', name: 'IMDb' },
  { slug: 'chess-com', name: 'Chess.com' },
];

const EMOJI_PRESETS = ['⚡', '🚀', '🛠️', '🛡️', '✨', '🧠', '🤖', '🌐', '💡', '🔍'];

export function SubmitAlternativeForm({
  initialTargetSlug = 'general',
}: {
  initialTargetSlug?: string;
}) {
  const normalizedInitialTarget = AVAILABLE_TARGETS.some(
    (t) => t.slug === initialTargetSlug.toLowerCase(),
  )
    ? initialTargetSlug.toLowerCase()
    : 'general';

  const [targetSlug, setTargetSlug] = useState<string>(normalizedInitialTarget);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [description, setDescription] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [verificationTier, setVerificationTier] = useState<VerificationTier>('none');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleStripeCheckout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          tier: verificationTier,
          creator_email: creatorEmail,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Could not initialize checkout. Please try again.');
      }
    } catch {
      alert('Checkout network error');
    } finally {
      setIsCheckingOut(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and convert uploaded image file to lightweight data URL
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image is too large. Please upload an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 128;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png', 0.85);
          setIcon(dataUrl);
          setIsCustomImage(true);
          setErrorMessage(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Client-side validation
    if (!name.trim()) {
      setFieldErrors((prev) => ({ ...prev, name: 'App name is required.' }));
      return;
    }
    if (!url.trim() || !/^https?:\/\//i.test(url.trim())) {
      setFieldErrors((prev) => ({
        ...prev,
        url: 'Please provide a valid URL starting with https:// or http://',
      }));
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      setFieldErrors((prev) => ({
        ...prev,
        description: 'Short description must be at least 5 characters.',
      }));
      return;
    }
    if (!creatorEmail.trim() || !creatorEmail.includes('@')) {
      setFieldErrors((prev) => ({
        ...prev,
        creator_email: 'Please provide a valid contact email.',
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/alternatives/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_slug: targetSlug,
          name: name.trim(),
          url: url.trim(),
          icon: icon.trim() || '⚡',
          description: description.trim(),
          creator_email: creatorEmail.trim(),
          verification_tier: verificationTier,
          website_hp: honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setErrorMessage(data.message || 'Submission failed. Please check the form.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedTargetName =
    AVAILABLE_TARGETS.find((t) => t.slug === targetSlug)?.name || 'Community Tool';
  const targetBadgeText =
    targetSlug === 'general' ? 'Community Tool' : `Alternative to ${selectedTargetName}`;

  if (isSuccess) {
    const isPaid = verificationTier !== 'none';
    const amount = verificationTier === 'priority' ? '$29' : '$19';
    const tierTitle =
      verificationTier === 'priority' ? 'Priority Fast-Track & #1 Boost' : 'Verified Creator Badge';

    return (
      <div
        style={{
          background: 'var(--bg-1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--threat-low)',
          borderRadius: 'var(--radius-xs)',
          padding: 'var(--space-8)',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto',
        }}
        role="alert"
      >
        <div style={{ fontSize: '40px', marginBottom: 'var(--space-3)' }}>🎉</div>
        <h2
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-h2)',
            color: 'var(--fg-primary)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Alternative Submitted Successfully!
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-6)',
          }}
        >
          Your project <strong>{name}</strong> has been saved in our database. Our team verifies all
          links for safety and builder quality before publishing publicly.
        </p>

        {isPaid && (
          <div
            style={{
              padding: 'var(--space-5)',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid var(--brand-500)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: 'var(--space-6)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: 'var(--brand-400)',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  background: 'var(--brand-500)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '10px',
                }}
              >
                AUTOMATED CHECKOUT COMING SOON
              </span>
              <span>· {tierTitle}</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: 'var(--text-h3)',
                color: 'var(--fg-primary)',
                margin: '0 0 6px 0',
              }}
            >
              🚀 Tier Reservation Saved!
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '12px',
                color: 'var(--fg-secondary)',
                lineHeight: 1.6,
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Your project is now queued for priority review. Automated credit card payments are activating soon.
              We will notify you at <strong>{creatorEmail}</strong> as soon as founder verification goes live!
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'var(--bg-2)',
                  color: 'var(--brand-400)',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  border: '1px dashed var(--brand-500)',
                }}
              >
                ⚡ Payment Gateway: Launching Soon
              </div>

              <a
                href={`mailto:sponsor@whyundefeated.com?subject=Early%20Verification%20Inquiry%20${encodeURIComponent(
                  tierTitle,
                )}%20for%20${encodeURIComponent(name)}&body=Hi%2C%20I%20submitted%20${encodeURIComponent(
                  name,
                )}%20for%20the%20${encodeURIComponent(tierTitle)}%20tier.`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--fg-secondary)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 'var(--text-xs)',
                  textDecoration: 'none',
                }}
              >
                Inquire / Early Access via Email →
              </a>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/alternatives"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              background: isPaid ? 'transparent' : 'var(--brand-500)',
              border: isPaid ? '1px solid var(--border-default)' : 'none',
              color: isPaid ? 'var(--fg-primary)' : '#ffffff',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Explore Directory →
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setName('');
              setUrl('');
              setIcon('⚡');
              setIsCustomImage(false);
              setDescription('');
              setCreatorEmail('');
              setVerificationTier('none');
            }}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--fg-primary)',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            Submit Another App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--space-8)',
        maxWidth: '1080px',
        margin: '0 auto',
        alignItems: 'start',
      }}
    >
      {/* Form Column */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          padding: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
        aria-label="Submit community alternative form"
      >
        {/* Honeypot hidden input against bots */}
        <input
          type="text"
          name="website_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {errorMessage && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'rgba(240, 98, 146, 0.15)',
              border: '1px solid var(--threat-high)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--threat-high)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
            }}
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* Target Incumbent App */}
        <div>
          <label
            htmlFor="target_slug"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '6px',
            }}
          >
            Which company or app does it challenge?
          </label>
          <select
            id="target_slug"
            value={targetSlug}
            onChange={(e) => setTargetSlug(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-body)',
            }}
          >
            {AVAILABLE_TARGETS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* App Name */}
        <div>
          <label
            htmlFor="app_name"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '6px',
            }}
          >
            Alternative App Name *
          </label>
          <input
            id="app_name"
            type="text"
            placeholder="e.g. Kagi Search, Obsidian, Postiz"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-2)',
              border: `1px solid ${fieldErrors.name ? 'var(--threat-high)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-body)',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.name && (
            <span
              style={{
                color: 'var(--threat-high)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono), monospace',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.name}
            </span>
          )}
        </div>

        {/* Product URL */}
        <div>
          <label
            htmlFor="app_url"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '6px',
            }}
          >
            Website / Repository URL *
          </label>
          <input
            id="app_url"
            type="url"
            placeholder="https://yourproduct.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-2)',
              border: `1px solid ${fieldErrors.url ? 'var(--threat-high)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.url && (
            <span
              style={{
                color: 'var(--threat-high)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono), monospace',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.url}
            </span>
          )}
        </div>

        {/* Logo / Image Upload */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '6px',
            }}
          >
            App Logo / Icon
          </label>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="logo_file_input"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--fg-primary)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}
            >
              📁 Upload Logo Image
            </button>

            {isCustomImage && (
              <button
                type="button"
                onClick={() => {
                  setIcon('⚡');
                  setIsCustomImage(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                style={{
                  padding: '6px 10px',
                  background: 'transparent',
                  border: '1px solid var(--threat-high)',
                  color: 'var(--threat-high)',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                ✕ Remove Image
              </button>
            )}
          </div>

          {!isCustomImage && (
            <div style={{ marginTop: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  color: 'var(--fg-tertiary)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Or pick an icon:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {EMOJI_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-xs)',
                      background: icon === emoji ? 'var(--brand-500)' : 'var(--bg-2)',
                      border: `1px solid ${icon === emoji ? 'var(--brand-500)' : 'var(--border-default)'}`,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label
              htmlFor="app_description"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-secondary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-label)',
              }}
            >
              Short Description / Value Pitch *
            </label>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: description.length > 150 ? 'var(--threat-medium)' : 'var(--fg-tertiary)',
              }}
            >
              {description.length}/160
            </span>
          </div>
          <textarea
            id="app_description"
            rows={3}
            maxLength={160}
            placeholder="Describe why builders should use your solution and how it challenges the incumbent."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-2)',
              border: `1px solid ${fieldErrors.description ? 'var(--threat-high)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-body)',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.description && (
            <span
              style={{
                color: 'var(--threat-high)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono), monospace',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.description}
            </span>
          )}
        </div>

        {/* Creator Email */}
        <div>
          <label
            htmlFor="creator_email"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '6px',
            }}
          >
            Founder / Contact Email *
          </label>
          <input
            id="creator_email"
            type="email"
            placeholder="founder@yourproject.com"
            value={creatorEmail}
            onChange={(e) => setCreatorEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-2)',
              border: `1px solid ${fieldErrors.creator_email ? 'var(--threat-high)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              color: 'var(--fg-tertiary)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono), monospace',
              marginTop: '4px',
              display: 'block',
            }}
          >
            Kept 100% private. Used only for status updates regarding your listing.
          </span>
          {fieldErrors.creator_email && (
            <span
              style={{
                color: 'var(--threat-high)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono), monospace',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.creator_email}
            </span>
          )}
        </div>

        {/* Pricing & Verification Tiers */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginBottom: '8px',
            }}
          >
            Listing Tier & Verification
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Free */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: verificationTier === 'none' ? 'var(--bg-2)' : 'transparent',
                border: `1px solid ${verificationTier === 'none' ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="verification_tier"
                value="none"
                checked={verificationTier === 'none'}
                onChange={() => setVerificationTier('none')}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--fg-primary)',
                  }}
                >
                  Standard Community Listing · $0 (Free)
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontFamily: 'var(--font-mono), monospace', color: 'var(--fg-tertiary)' }}>
                  Submitted to community queue. Standard review.
                </p>
              </div>
            </label>

            {/* $19 Verified */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: verificationTier === 'verified' ? 'var(--brand-tint-08)' : 'transparent',
                border: `1px solid ${verificationTier === 'verified' ? 'var(--brand-500)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="verification_tier"
                value="verified"
                checked={verificationTier === 'verified'}
                onChange={() => setVerificationTier('verified')}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--brand-400)',
                  }}
                >
                  ⚡ Verified Creator Badge · $19 USD (Launching Soon)
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontFamily: 'var(--font-mono), monospace', color: 'var(--fg-secondary)' }}>
                  Reserve official purple VERIFIED badge & priority placement. Automated checkout activating soon.
                </p>
              </div>
            </label>

            {/* $29 Priority */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: verificationTier === 'priority' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                border: `1px solid ${verificationTier === 'priority' ? 'var(--threat-medium)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="verification_tier"
                value="priority"
                checked={verificationTier === 'priority'}
                onChange={() => setVerificationTier('priority')}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--threat-medium)',
                  }}
                >
                  🚀 Priority Fast-Track & #1 Slot · $29 USD (Launching Soon)
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontFamily: 'var(--font-mono), monospace', color: 'var(--fg-secondary)' }}>
                  Reserve Express 12h review + Top #1 position guarantee. Automated checkout activating soon.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '12px var(--space-6)',
            background: isSubmitting ? 'var(--border-default)' : 'var(--brand-500)',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            color: '#ffffff',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            letterSpacing: 'var(--tracking-label)',
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            marginTop: 'var(--space-2)',
            transition: 'background var(--duration-fast)',
          }}
        >
          {isSubmitting
            ? 'Submitting...'
            : verificationTier === 'priority'
            ? 'Submit & Request Priority Fast-Track ($29) →'
            : verificationTier === 'verified'
            ? 'Submit & Request Verified Badge ($19) →'
            : 'Submit Alternative for Review (Free) →'}
        </button>
      </form>

      {/* Live Preview Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
          }}
        >
          Live Card Preview
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'var(--space-5)',
            background:
              verificationTier === 'priority'
                ? 'rgba(245, 158, 11, 0.08)'
                : verificationTier === 'verified'
                ? 'rgba(139, 92, 246, 0.08)'
                : 'var(--bg-1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor:
              verificationTier === 'priority'
                ? 'var(--threat-medium)'
                : verificationTier === 'verified'
                ? 'var(--brand-500)'
                : 'var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            minHeight: '180px',
            boxShadow:
              verificationTier !== 'none' ? '0 4px 20px rgba(139, 92, 246, 0.15)' : 'none',
          }}
        >
          <div>
            {/* Top row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: 'var(--space-3)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  color: 'var(--brand-400)',
                  background: 'var(--bg-2)',
                  padding: '2px 8px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-label)',
                }}
              >
                {targetBadgeText}
              </span>

              {verificationTier !== 'none' && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background:
                      verificationTier === 'priority' ? 'var(--threat-medium)' : 'var(--brand-500)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  {verificationTier === 'priority' ? '🚀 PRIORITY #1' : '⚡ VERIFIED'}
                </span>
              )}
            </div>

            {/* Title + Logo/Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              {icon && (icon.startsWith('data:image/') || icon.startsWith('http')) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={icon}
                  alt=""
                  style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
                />
              ) : (
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon || '⚡'}</span>
              )}
              <h3
                style={{
                  fontFamily: 'var(--font-sans), sans-serif',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 700,
                  color: 'var(--fg-primary)',
                  margin: 0,
                }}
              >
                {name || 'Your App Name'}
              </h3>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-secondary)',
                lineHeight: 1.5,
                margin: '0 0 var(--space-4) 0',
              }}
            >
              {description ||
                'Your short description and pitch will appear here once submitted and approved.'}
            </p>
          </div>

          {/* Outbound Link & Upvote Preview */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 'var(--space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                padding: '3px 8px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--fg-secondary)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              ▲ 0
            </span>

            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--brand-400)',
                fontWeight: 600,
              }}
            >
              visit project ↗
            </span>
          </div>
        </div>

        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--fg-tertiary)',
            lineHeight: 1.5,
          }}
        >
          💡 <strong>Community Ranking Algorithm:</strong>
          <br />
          1. 🚀 Priority Fast-Track ($29) & ⚡ Verified ($19) apps rank first.
          <br />
          2. Apps with more community upvotes (▲) appear higher in the directory.
          <br />
          3. Older submissions break any vote ties.
        </div>
      </div>
    </div>
  );
}
