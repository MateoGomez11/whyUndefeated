import { notFound } from 'next/navigation';
import { loadAllEntries, getEntryBySlug } from '@/lib/content/loader';
import { relatedEntries } from '@/lib/content/related';
import { EntryDetail } from '@/components/EntryDetail';

// Statically generated: exactly the 7 seed slugs, no client fetching, fully
// readable without JS (FR-005, FR-011). Unknown slugs fall through to
// app/not-found.tsx (FR-015).
export const dynamicParams = false;

export function generateStaticParams() {
  return loadAllEntries().map((entry) => ({ slug: entry.slug }));
}

export default async function EntryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const related = relatedEntries(entry, loadAllEntries());

  return <EntryDetail entry={entry} related={related} />;
}
