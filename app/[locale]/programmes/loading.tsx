export default function ProgrammesLoading() {
  return (
    <main className="programme-directory-page">
      <div className="route-loading-screen" role="status" aria-live="polite">
        <div className="route-loading-spinner" />
        <strong>Loading programmes…</strong>
        <span>Preparing the programme directory and filters.</span>
      </div>
    </main>
  );
}
