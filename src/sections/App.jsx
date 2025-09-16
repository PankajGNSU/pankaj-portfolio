import React, { useEffect, useMemo, useState } from "react";

/** Pankaj Kumar — Portfolio (React + Tailwind)
 * - Left Contents (TOC) with active highlight
 * - Smooth scroll
 * - Projects grid with search + tag filters
 */

const SECTIONS = [
  { id: "top", label: "(Top)" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// ====== YOUR PROJECTS (edit links if you have repos/live demos) ======
const ALL_PROJECTS = [
  {
    title: "Smart Class Solution (IoT + Face Recognition)",
    summary:
      "Automated attendance & class analytics using Raspberry Pi camera, face recognition, and a Flask dashboard. Sends GSM/SMS alerts for exceptions and logs data for reports.",
    tags: ["Python", "Raspberry Pi", "OpenCV", "Flask", "IoT"],
    link: "https://github.com/PankajGNSU", // change to repo if you have it
  },
  {
    title: "Camera Monitor Application (WebRTC)",
    summary:
      "Real-time phone-to-phone video streaming. Firebase handles signaling; WebRTC provides low-latency media. Built for simple remote monitoring.",
    tags: ["Android", "WebRTC", "Firebase"],
    link: "https://github.com/PankajGNSU", // change to repo if you have it
  },
  {
    title: "Hospital Management System",
    summary:
      "Java/Spring Boot back-end with REST APIs for patients, appointments, doctors, billing; MySQL for persistence; Docker Compose for easy run. Focus on validation and layered architecture.",
    tags: ["Java", "Spring Boot", "REST", "MySQL", "Docker"],
    link: "https://github.com/PankajGNSU", // change to repo if you have it
  },
  {
    title: "My Portfolio (this site)",
    summary:
      "Responsive React + Tailwind UI with a left TOC, project search & tag filters. Deployed on GitHub Pages (can also deploy to Azure).",
    tags: ["React", "Tailwind", "GitHub Pages", "Azure"],
    link: "https://pankajgnsu.github.io/pankaj-portfolio/",
  },
];

const ALL_TAGS = Array.from(new Set(ALL_PROJECTS.flatMap((p) => p.tags))).sort();

// ====== UTILITIES ======
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const opts = { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0.2 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
    }, opts);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-600/50 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-200">
      {children}
    </span>
  );
}

function ProjectCard({ p }) {
  return (
    <div className="group rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4 shadow-sm transition hover:border-slate-500/70 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold tracking-tight text-slate-100">
          {p.title}
        </h4>
        <a
          href={p.link}
          target="_blank"
          rel="noreferrer"
          className="opacity-0 group-hover:opacity-100 text-xs underline text-blue-300"
        >
          View
        </a>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-slate-300/90">
        {p.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
        {title}
      </h2>
      <div className="mt-3 text-slate-300/90 leading-relaxed">{children}</div>
    </section>
  );
}

// ====== PAGE ======
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  const filtered = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      const matchesQuery = `${p.title} ${p.summary} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => p.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, selectedTags]);

  const toggleTag = (t) =>
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400" />
            <div className="text-sm/5 tracking-wide">
              <div className="font-semibold">Pankaj Kumar</div>
              <div className="text-slate-400">Full Stack Development</div>
            </div>
          </div>
          <nav className="hidden gap-4 md:flex">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-sm text-slate-300 hover:text-white"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Body grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr_260px]">
        {/* Left TOC */}
        <aside className="sticky top-20 hidden self-start md:block">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Contents</h3>
              <span className="text-[11px] text-slate-400">auto</span>
            </div>
            <ul className="space-y-1 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left hover:underline ${
                      active === s.id ? "text-blue-300" : "text-slate-300"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-12">
          <Section id="top" title="Portfolio Overview">
            <p>
              Hi, I’m <strong>Pankaj Kumar</strong>, a developer focused on{" "}
              <strong>Java/Spring Boot</strong> back-ends and modern{" "}
              <strong>React</strong> front-ends. This site highlights a few
              projects and the tech I enjoy.
            </p>
          </Section>

          <Section id="about" title="About">
            <p>
              I build full-stack applications with clean architecture,
              reliability, and practical DevOps in mind. I’m comfortable with
              databases (MySQL), containerization (Docker), CI/CD, and cloud
              deployment (GitHub Pages / Azure). I also explore IoT and
              real-time systems.
            </p>
          </Section>

          <Section id="skills" title="Skills">
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                "Java",
                "Spring Boot",
                "REST APIs",
                "JPA/Hibernate",
                "MySQL",
                "Docker / Compose",
                "React",
                "Tailwind CSS",
                "Git / GitHub",
                "GitHub Actions",
                "Azure (SWA/App Service)",
                "Linux",
                "Unit Testing (JUnit)",
              ].map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Section>

          <Section id="projects" title="Projects">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <input
                className="w-full max-w-sm rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search projects, tech, keywords…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {ALL_TAGS.map((t) => {
                const on = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      on
                        ? "border-blue-400 bg-blue-500/20 text-blue-200"
                        : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((p) => (
                <ProjectCard key={p.title} p={p} />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-6 text-sm text-slate-300">
                  No projects match your search.
                </div>
              )}
            </div>
          </Section>

          <Section id="contact" title="Contact">
            <p className="space-x-2">
              <a
                className="underline text-blue-300"
                href="mailto:pankajkssm2@gmail.com"
              >
                pankajkssm2@gmail.com
              </a>
              <span>·</span>
              <a
                className="underline text-blue-300"
                href="https://github.com/PankajGNSU"
                target="_blank"
                rel="noreferrer"
              >
                github.com/PankajGNSU
              </a>
              <span>·</span>
              <a
                className="underline text-blue-300"
                href="https://www.linkedin.com/in/pankaj-kumar-82a6a321b/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Tip: we can add a contact form later that posts to a small Spring
              Boot API and emails you.
            </p>
          </Section>
        </main>

        {/* Right column (optional quick links) */}
        <aside className="sticky top-20 hidden self-start lg:block">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-slate-200">Quick Links</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <a className="text-blue-300 underline" href="#">
                  Download Resume (PDF)
                </a>
              </li>
              <li>
                <a
                  className="text-blue-300 underline"
                  href="https://github.com/PankajGNSU"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Profile
                </a>
              </li>
              <li>
                <a
                  className="text-blue-300 underline"
                  href="https://pankajgnsu.github.io/pankaj-portfolio/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Portfolio
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <footer className="border-t border-slate-800/70 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Pankaj Kumar — Built with React & Tailwind
      </footer>
    </div>
  );
}
