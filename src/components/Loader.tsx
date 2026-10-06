export function LoadingState({ label = 'Opening the collection' }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__mark">E</span>
      <span className="eyebrow">{label}</span>
      <span className="loading-state__line"><i /></span>
    </div>
  );
}
