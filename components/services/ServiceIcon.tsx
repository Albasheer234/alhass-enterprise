export default function ServiceIcon({ icon }: { icon?: string | null }) {
  const paths: Record<string, string> = {
    store: 'M3 9l1.5-5h15L21 9M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 21v-7h6v7',
    pos: 'M4 4h16v10H4zM8 20h8M12 14v6M8 8h4',
    data: 'M12 20V10M18 20V4M6 20v-4',
    home: 'M3 11l9-8 9 8M5 9v11h14V9',
  };
  const d = paths[icon ?? ''] ?? paths.store;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
