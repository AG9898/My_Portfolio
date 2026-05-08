const ABOUT_NOTES = [
  {
    title: "About Aden",
    date: "Profile note",
    active: true,
  },
  {
    title: "How I Work",
    date: "Process",
    active: false,
  },
  {
    title: "Frontend Focus",
    date: "Craft",
    active: false,
  },
  {
    title: "What I Value",
    date: "Principles",
    active: false,
  },
];

const WORKING_NOTES = [
  "Translate product intent into screens that are easy to scan and hard to misuse.",
  "Keep UI state deterministic, especially when interactions overlap.",
  "Use motion as feedback for focus, navigation, and layout change instead of decoration.",
  "Document the constraints that future work needs to preserve.",
];

export default function About() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-56 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          about_me.txt
        </div>
        <div className="space-y-1">
          {ABOUT_NOTES.map((note) => (
            <div
              key={note.title}
              className={`rounded-lg px-3 py-2 ${
                note.active
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <div className="truncate text-[13px] font-medium">
                {note.title}
              </div>
              <div
                className={`truncate text-[11px] ${
                  note.active ? "text-label-primary" : "text-label-secondary"
                }`}
              >
                {note.date}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-8 text-[15px] leading-7 sm:px-10">
          <p className="text-[13px] text-label-secondary">
            Notes / about_me.txt
          </p>
          <h1 className="mt-1 text-[22px] font-semibold">About Aden</h1>

          <div className="mt-6 space-y-4">
            <p>
              I am a frontend-focused developer interested in interfaces with
              strong interaction models: desktop metaphors, focused tools,
              responsive work surfaces, and systems where visual polish is tied
              to clear behavior.
            </p>
            <p>
              The portfolio itself is part of that work. It uses a macOS-style
              desktop to show how routing, state, animation, and content can fit
              into one coherent browser experience without relying on a
              conventional scrolling landing page.
            </p>
            <p className="text-label-secondary">
              I like building from product shape down to implementation detail:
              what the user should notice first, how controls reveal state, what
              breaks on small screens, and which patterns need to be documented
              before the next feature lands.
            </p>
          </div>

          <section className="mt-8 rounded-lg border border-glass-edge bg-chrome p-4">
            <h2 className="text-[13px] font-semibold uppercase text-label-secondary">
              Working Notes
            </h2>
            <ul className="mt-3 space-y-3">
              {WORKING_NOTES.map((note) => (
                <li key={note} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}
