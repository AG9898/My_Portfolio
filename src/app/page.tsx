"use client";

import { useEffect, useState } from "react";

const projects = [
  {
    id: "01",
    title: "Spatial Analysis Platform",
    description:
      "Comprehensive GIS application tailored for spatial data analysis using modern Python libraries.",
    stack: "Python / GeoPandas",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg8O7i0GhXC3ngY7JE4t1ZWu1NR4U7_KU_ApogKnroQHYxYNaCwzlepdCGkdXhNoOFGErH2yNiMjJO7z3x6XHHG3U2Pe2lbWgmKC4Ff9DKBa_bT0IhO-knIRDhT6s0srKuCyuogG1u1sFZQXB6Fg9FIxMtt2qAS0ouTgqCtnkNwo4nrv_80SYXaRSTs1MVbRfyn_5Y5YPCqg_hBhbc6nkI4eGlEgDrfCIDNu5TSzWQioekOKO7dp8mzpKQKA4hcl_SQmS_utIhTGA",
  },
  {
    id: "02",
    title: "Clustering With DBSCAN",
    description:
      "Machine learning implementation for pattern recognition and advanced data clustering.",
    stack: "Scikit-learn / DBSCAN",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDELEfdkSehD8wy9_V2J2bwGJFoIjxI74ykZ8UHD3kaMj-yH4yed4xw1I5Aq_T3ksOxNjkHKZ1VBjYrblD12yOmmDcVCFWwINdJufXPAY49ZeeioRvRHi7ilKGHJmwKgYq0hqOs6kXm-XQ2DMwkdiS8shdr5ES8HzjTzYz5zXXaLgjL04vYOXsd4KFPIQ5vB0VI8ys_qujnFvmTJF3EKyOLTbWZvhVb5UUqqWjKzBQNwNJuqK7HwUh69PzZu6JEEP5kUJ7KVFRpGvs",
  },
  {
    id: "03",
    title: "City Utilities Web App",
    description:
      "Interactive mapping tool locating essential services, from libraries to hospitals.",
    stack: "Flask / Leaflet",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXn-g0yLpPogdZxAe0IViyq2rvQc6wNrhyp5miU9hjbchZUf_JMG01IZDaTti1nEsFNjU65DDBLMrGNVW_qz-lIgNobj-d15glB_7byf9YYcqNsl8UeisA1HcT0GgcENCbzI-EL10oM6DZ5ay8qMrjfhbTK2_hvNp48bopsONrQwv7ojyvcjif0FLV3dc6TuEWvkYvGueukzJXkxTaUhTk1DxjLCVSLOy9jBKgZDp6vn6fN4qu3Qk7RFM8_Ag5yuwTZHTHTIfBP0",
  },
] as const;

const skills = [
  "React / Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js / Express",
  "PostgreSQL",
] as const;

const gisStack = [
  "Python (Pandas/GeoPandas)",
  "ArcGIS / QGIS",
  "Leaflet / Mapbox",
  "Spatial SQL",
  "DBSCAN / Scikit-learn",
] as const;

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const label = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(label);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-light)] text-[var(--text-light)]">
      <nav className="fixed w-full z-50 mix-blend-difference text-white border-b border-white/20">
        <div className="max-w-[98%] mx-auto flex justify-between items-center py-6 px-4">
          <div className="font-display font-black text-2xl tracking-tighter uppercase">
            AG.PORTFOLIO
          </div>
          <div className="hidden md:flex space-x-12 font-bold uppercase tracking-[0.25em] text-xs">
            <a className="hover:line-through decoration-2" href="#work">
              Work
            </a>
            <a className="hover:line-through decoration-2" href="#about">
              About
            </a>
            <a className="hover:line-through decoration-2" href="#contact">
              Contact
            </a>
          </div>
          <button className="md:hidden font-bold uppercase tracking-widest text-xs">
            Menu
          </button>
        </div>
      </nav>

      <header
        id="home"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24"
      >
        <div className="absolute inset-0 select-none pointer-events-none flex flex-col justify-center items-center opacity-10 z-0 overflow-hidden">
          <h1 className="font-display font-black text-[20vw] leading-none text-center whitespace-nowrap">
            FULL STACK
          </h1>
          <h1 className="font-display font-black text-[20vw] leading-none text-center whitespace-nowrap ml-[20vw]">
            DEVELOPER
          </h1>
        </div>
        <div className="max-w-[1320px] mx-auto px-4 z-10 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-end h-full pb-20">
          <div className="lg:col-span-7 flex flex-col justify-end space-y-8">
            <div className="border-l-4 border-black pl-6 py-2">
              <p className="font-bold tracking-[0.2em] uppercase text-[var(--accent-gray)] mb-2 text-xs">
                Portfolio 2024
              </p>
              <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tight">
                ADEN <br /> GUO
              </h2>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl font-light leading-relaxed text-neutral-700">
              A{" "}
              <span className="font-bold border-b-2 border-current">
                GIS Specialist
              </span>{" "}
              &amp; Creative Technologist crafting digital experiences where
              spatial data meets brutalist aesthetics.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                className="group relative px-8 py-4 bg-black text-white font-bold uppercase tracking-wider overflow-hidden"
                href="#work"
              >
                <span className="relative z-10 group-hover:text-black transition-colors">
                  Explore Projects
                </span>
                <div className="absolute inset-0 h-full w-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </a>
              <a
                className="px-8 py-4 border-2 border-black font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                href="/cv.pdf"
                download="AdenGuo_CV.pdf"
              >
                Download CV
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-[460px] lg:h-[680px] w-full">
            <div className="absolute -top-10 -right-10 w-24 h-24 border-t-2 border-r-2 border-black"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 border-b-2 border-l-2 border-black"></div>
            <div className="h-full w-full bg-neutral-200 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
              <img
                alt="Aden Guo portrait"
                className="object-cover w-full h-full object-center opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNu4acd4dXXV7DoOQg7t56zdi39tK0cNzyHi585ppRsKbOAf86x5tYnIKEt4NaYqDzAHu6r4LGMwxZdP6mgRoaaiydcM8lAzQZ7jjZojJtdH83OZzzdxzGDup-zkNuvNKcDjvcz61sMl7bl4jGO5rr29BFFlOYTwodtH7_TT3vj2EVKgy5lIOOxq5GrrP2o7JBZxqfj3xDom44en8eiU_MDlU6B6glUlBXK6-1dX6hl_X5Ugjcfj3TD9e6Fsxu8sv0K9TdvYJWKkk"
              />
              <div className="absolute bottom-0 right-0 p-6 bg-black text-white">
                <span className="inline-flex items-center justify-center w-10 h-10 border border-white/40 animate-spin-slow">
                  AG
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <span className="text-lg">â†“</span>
        </div>
      </header>

      <section className="border-y border-black py-6 bg-black text-white overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="text-4xl md:text-6xl font-display font-black uppercase mx-8">
            Full Stack Developer
          </span>
          <span className="text-4xl md:text-6xl font-display font-black mx-4 text-transparent stroke-text opacity-50">
            â€¢
          </span>
          <span className="text-4xl md:text-6xl font-display font-black uppercase mx-8">
            GIS Specialist
          </span>
          <span className="text-4xl md:text-6xl font-display font-black mx-4 text-transparent stroke-text opacity-50">
            â€¢
          </span>
          <span className="text-4xl md:text-6xl font-display font-black uppercase mx-8">
            Data Analysis
          </span>
          <span className="text-4xl md:text-6xl font-display font-black mx-4 text-transparent stroke-text opacity-50">
            â€¢
          </span>
          <span className="text-4xl md:text-6xl font-display font-black uppercase mx-8">
            UI/UX Design
          </span>
        </div>
      </section>

      <section id="work" className="py-24 px-4 md:px-8 border-b border-black/10">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <h2 className="font-display font-black text-6xl md:text-8xl uppercase tracking-tighter">
              Selected
              <br />
              Works
            </h2>
            <p className="text-right mt-4 md:mt-0 max-w-xs text-xs uppercase tracking-widest text-[var(--accent-gray)]">
              (2023 â€” 2025)
              <br />
              Showcasing technical precision
              <br />
              and creative direction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group border-b md:border-r border-black relative min-h-[560px] flex flex-col justify-between p-6 md:p-12 hover:bg-[var(--surface-light)] transition-colors duration-300"
              >
                <div className="w-full h-[360px] bg-neutral-200 overflow-hidden mb-8 relative">
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    src={project.image}
                  />
                  <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                    {project.stack}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline border-b border-black/20 pb-4 mb-4">
                    <span className="font-mono text-sm text-[var(--accent-gray)]">
                      {project.id}
                    </span>
                    <span className="transition-transform duration-300 group-hover:rotate-45">
                      â†—
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-3xl md:text-4xl mb-2 uppercase group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                  </h3>
                  <p className="text-neutral-600 max-w-md">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
            <div className="group border-b border-black relative min-h-[560px] flex flex-col justify-center items-center p-12 bg-black text-white hover:bg-neutral-900 transition-colors">
              <a
                className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300"
                href="#"
              >
                <span className="font-display font-black text-6xl md:text-8xl mb-4">
                  +
                </span>
                <span className="text-xl font-bold uppercase tracking-widest">
                  View All Projects
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-4 md:px-8 bg-neutral-100">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          <div>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase mb-12 relative inline-block">
              About Me
              <span className="absolute -bottom-2 left-0 w-1/3 h-2 bg-black"></span>
            </h2>
            <div className="font-light text-xl leading-relaxed mb-12 space-y-6">
              <p>
                I&apos;m Aden, a passionate developer bridging the gap between{" "}
                <strong className="text-black font-bold">
                  complex spatial data
                </strong>{" "}
                and{" "}
                <strong className="text-black font-bold">
                  intuitive web interfaces
                </strong>
                . My work is driven by a minimalist philosophy: stripping away
                the unnecessary to reveal the core function and beauty of data.
              </p>
              <p>
                With a background in both GIS and Full Stack Development, I
                build tools that help users visualize and understand the world
                around them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold uppercase tracking-widest border-b border-black pb-2 mb-4 text-xs">
                  Tech Stack
                </h4>
                <ul className="space-y-2 font-mono text-sm text-neutral-600">
                  {skills.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest border-b border-black pb-2 mb-4 text-xs">
                  GIS &amp; Data
                </h4>
                <ul className="space-y-2 font-mono text-sm text-neutral-600">
                  {gisStack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[3/4] border-2 border-black p-4">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black z-10 flex items-center justify-center text-white font-bold">
                  AG
                </div>
                <img
                  alt="Workspace"
                  className="w-full h-full object-cover grayscale brightness-90 contrast-125"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkcYdcCbo6x2sWDYLMSwFmu9Dl2Z15CQlj9lWVNOw91ViNx2x-dljlLlcbgFD_adPzJA8CG_0TZkbBGx466N2LC4YC-P2wJD4yPwl6-48odJ3oKCjftm07LaBea_HogCe9_XrgTks4JNMirJxgSc3DroKEiRxCZfAb8nTpJ1Lxy_SJJC4Rhrsw_pe61d_QU8W-IXwFzYt4Rp9WLG9u2g6Bk9ilAiTYXOtdifQjytPrUkEJFwJRS6lgNZBSLpuVb-Z7WAWFxT-tJ0s"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 border border-black">
                  <p className="font-display font-bold text-2xl mb-2">
                    &quot;Design is intelligence made visible.&quot;
                  </p>
                  <p className="text-xs font-mono text-neutral-500">
                    â€” Alina Wheeler
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="bg-black text-white py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-white/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] border border-white/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h2 className="font-display font-black text-6xl md:text-9xl mb-8 uppercase leading-none">
            Let&apos;s Talk
          </h2>
          <p className="text-xl md:text-2xl font-light max-w-2xl mb-12 text-neutral-400">
            Interested in new opportunities or exciting collaborations? I&apos;m
            always open to discussing product design, GIS solutions, or just
            innovative ideas.
          </p>
          <a
            className="inline-flex items-center gap-4 text-3xl md:text-5xl font-bold hover:underline decoration-2 underline-offset-8 transition-all hover:text-neutral-300 mb-16"
            href="mailto:aden.guowe@gmail.com"
          >
            aden.guowe@gmail.com <span className="text-4xl md:text-6xl">â†’</span>
          </a>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full border-t border-white/20 pt-12">
            <a className="flex flex-col items-center md:items-start group" href="#">
              <span className="text-neutral-500 text-xs uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
                Social
              </span>
              <span className="text-xl font-bold">LinkedIn</span>
            </a>
            <a className="flex flex-col items-center md:items-start group" href="#">
              <span className="text-neutral-500 text-xs uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
                Code
              </span>
              <span className="text-xl font-bold">GitHub</span>
            </a>
            <a className="flex flex-col items-center md:items-start group" href="#">
              <span className="text-neutral-500 text-xs uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
                Design
              </span>
              <span className="text-xl font-bold">Dribbble</span>
            </a>
            <a className="flex flex-col items-center md:items-start group" href="#">
              <span className="text-neutral-500 text-xs uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
                Network
              </span>
              <span className="text-xl font-bold">Twitter</span>
            </a>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-24 text-xs text-neutral-500 font-mono">
            <p>Â© 2025 Aden Guo. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <p>
                Local Time: <span>{time || "00:00"}</span>
              </p>
              <p>Location: Earth</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
