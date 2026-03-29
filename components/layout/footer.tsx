export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white/70 py-6">
      <div className="container-shell flex flex-col justify-between gap-2 text-sm text-stone-600 md:flex-row">
        <p>© {new Date().getFullYear()} SebayBD. Built for Bangladesh service discovery.</p>
        <p>Bangla + English ready architecture • MVP scalable foundation</p>
      </div>
    </footer>
  );
}
