import {
  GitBranch,
  Mail,
  Paperclip,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

const CONTACT_PATHS = [
  {
    label: "Email",
    value: "aden219898@gmail.com",
    href: "mailto:aden219898@gmail.com?subject=Portfolio%20conversation",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/ag9898",
    href: "https://github.com/ag9898",
    icon: GitBranch,
  },
  {
    label: "LinkedIn",
    value: "Search Aden Guo",
    href: "https://www.linkedin.com/search/results/people/?keywords=Aden%20Guo",
    icon: Users,
  },
];

export default function Contact() {
  return (
    <div className="flex min-h-full bg-window text-label-primary">
      <aside className="hidden w-52 shrink-0 border-r border-glass-edge bg-chrome/70 p-2 md:block">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase text-label-secondary">
          Mailboxes
        </div>
        <div className="space-y-1">
          {["Inbox", "VIP", "Sent", "Archive"].map((mailbox, index) => (
            <div
              key={mailbox}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] ${
                index === 0
                  ? "bg-accent text-label-primary"
                  : "text-label-secondary hover:bg-[var(--color-control-hover)]"
              }`}
            >
              <span>{mailbox}</span>
              {index === 0 ? (
                <span className="text-[11px] text-label-primary">1</span>
              ) : null}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="glass-chrome flex h-10 shrink-0 items-center gap-2 border-b border-glass-edge px-3">
          <a
            href="mailto:aden219898@gmail.com?subject=Portfolio%20conversation"
            className="flex h-7 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-label-primary"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send
          </a>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-label-secondary hover:bg-[var(--color-control-hover)]"
            aria-label="Attach file"
          >
            <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-label-secondary hover:bg-[var(--color-control-hover)]"
            aria-label="Message polish"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <div className="ml-auto hidden text-[12px] text-label-secondary sm:block">
            No form backend required
          </div>
        </div>

        <section className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
          <div className="mx-auto max-w-3xl rounded-lg border border-glass-edge bg-chrome">
            <div className="border-b border-glass-edge px-4 py-3">
              <div className="grid gap-2 text-[13px] sm:grid-cols-[72px_1fr]">
                <div className="text-label-secondary">To:</div>
                <div className="min-w-0 truncate">Aden Guo</div>
                <div className="text-label-secondary">Subject:</div>
                <div className="min-w-0 truncate">
                  Portfolio conversation
                </div>
                <div className="text-label-secondary">From:</div>
                <div className="min-w-0 truncate">
                  recruiter-or-collaborator@example.com
                </div>
              </div>
            </div>

            <article className="px-5 py-6 text-[15px] leading-7 sm:px-7">
              <p className="text-[13px] text-label-secondary">
                Mail / contact.msg
              </p>
              <h1 className="mt-1 text-[22px] font-semibold">
                Let&apos;s talk.
              </h1>
              <div className="mt-5 space-y-4">
                <p>
                  The fastest path is email. Send a role, project, technical
                  question, or portfolio note and I will have enough context to
                  reply directly.
                </p>
                <p className="text-label-secondary">
                  This window is a static compose sheet: every action leaves the
                  browser through a normal link, with no database, inbox
                  integration, or hidden form submission.
                </p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {CONTACT_PATHS.map((path) => {
                  const Icon = path.icon;

                  return (
                    <a
                      key={path.label}
                      href={path.href}
                      className="rounded-lg border border-glass-edge bg-window p-4 hover:bg-[var(--color-control-hover)]"
                      target={path.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        path.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <Icon
                        className="h-5 w-5 text-label-secondary"
                        aria-hidden="true"
                      />
                      <div className="mt-3 text-[13px] font-semibold">
                        {path.label}
                      </div>
                      <div className="mt-1 truncate text-[12px] text-label-secondary">
                        {path.value}
                      </div>
                    </a>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
