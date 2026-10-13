"use client";

import Link from "next/link";
import BrandMark from "./components/BrandMark";
import SiteFooter from "./components/SiteFooter";
import PublicHeader from "./components/PublicHeader";
import { tracks } from "./data/curriculum";
import { countCurriculumLessons } from "./data/curriculumTheory";
import { useAuth } from "./contexts/AuthContext";

const features = [
  {
    icon: "play_circle",
    title: "Interactive Visualizers",
    description:
      "Step through algorithms frame by frame with synced code highlighting — like a debugger for DSA.",
  },
  {
    icon: "route",
    title: "Structured Learning Path",
    description:
      "318 lessons across Data Structures, Algorithms, and Patterns — beginner to advanced, unlocked in order.",
  },
  {
    icon: "menu_book",
    title: "Theory → Visualize → Quiz",
    description:
      "Every lesson follows a proven flow: read the concept, watch it run, then prove you understood with a quiz.",
  },
  {
    icon: "trending_up",
    title: "Progress That Sticks",
    description:
      "Your place in the roadmap is saved. Pick up exactly where you left off, on any device.",
  },
];

const steps = [
  {
    step: "01",
    title: "Read Theory",
    description:
      "Concise explanations with complexity analysis before you code.",
  },
  {
    step: "02",
    title: "Run the Visualizer",
    description:
      "Play, pause, and scrub through each algorithm step with live state.",
  },
  {
    step: "03",
    title: "Pass the Quiz",
    description: "Score 70%+ to complete the lesson and unlock the next one.",
  },
];

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

function HeroPreview() {
  return (
    <div className="glass-card w-full max-w-sm rounded-2xl p-5 sm:p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-on-surface-variant">
        Bubble Sort — Live Preview
      </p>
      <div className="flex h-28 items-end justify-center gap-1.5 sm:h-36 sm:gap-2">
        {[30, 60, 90, 50, 75].map((h, i) => (
          <div
            key={i}
            className={`w-6 rounded-t border sm:w-8 ${
              i === 2
                ? "border-primary bg-primary shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                : "border-primary/30 bg-primary/20"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Step 4 / 12</span>
        <span className="font-mono text-primary">O(n²)</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const totalLessons = countCurriculumLessons();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="pt-16 sm:pt-[4.5rem]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-outline-variant/30">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.25) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-tertiary/10 blur-3xl" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-center sm:gap-10 sm:px-6 sm:py-16 lg:flex-row lg:gap-10 lg:py-28 lg:text-left">
            <div className="flex-1 space-y-5 sm:space-y-6">
              <div className="flex justify-center lg:justify-start">
                <BrandMark variant="hero" href={null} />
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl lg:text-[3.25rem]">
                Don&apos;t memorize algorithms.
                <br />
                <span className="text-primary">Understand them visually.</span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-on-surface-variant sm:text-lg lg:mx-0">
                A visual DSA learning platform with step-by-step animations,
                synced code tracing, and structured lessons from arrays to
                graphs.
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:justify-start">
                {!loading && user ? (
                  <Link
                    href="/learn-path"
                    className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
                  >
                    Go to Learning Path
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      href="/login"
                      className="cursor-pointer rounded-lg border border-outline-variant/40 px-6 py-3 text-center font-display font-semibold text-on-surface transition hover:bg-surface-container-high"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="w-full max-w-sm flex-shrink-0 lg:max-w-sm">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-outline-variant/20 bg-surface-container/50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-4">
            {[
              { value: String(totalLessons), label: "Visual Lessons" },
              { value: "3", label: "Learning Tracks" },
              { value: "3", label: "Difficulty Tiers" },
              { value: "100%", label: "Free to Learn" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              Everything you need to master DSA
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
              Visual lessons, step-by-step animations, and quizzes — all in one
              guided path.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card cursor-pointer rounded-xl p-5 sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tracks */}
        <section className="border-y border-outline-variant/20 bg-surface-container/30 py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                Three tracks, one roadmap
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
                Progress through Beginner → Intermediate → Advanced across every
                topic.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="glass-card rounded-xl p-5 sm:p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      {track.icon}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-on-surface sm:text-xl">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {track.description}
                  </p>
                  <ul className="mt-4 space-y-1">
                    {levels.map((level) => {
                      const count = track.topics[level]?.length ?? 0;
                      return (
                        <li
                          key={level}
                          className="flex items-center justify-between text-xs text-on-surface-variant"
                        >
                          <span>{level}</span>
                          <span className="font-mono text-primary">
                            {count} topics
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              How every lesson works
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
              A consistent three-step flow across all {totalLessons} lessons.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-xl border border-outline-variant/30 bg-surface-container p-5 sm:p-6"
              >
                <span className="font-mono text-3xl font-bold text-primary/20 sm:text-4xl">
                  {s.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-on-surface">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-outline-variant/20 bg-gradient-to-br from-primary/10 via-background to-tertiary/5">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              Ready to see algorithms in action?
            </h2>
            <p className="mt-4 text-sm text-on-surface-variant sm:text-base">
              Create a free account and start with your first visual lesson in
              minutes.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {!loading && user ? (
                <Link
                  href="/dashboard"
                  className="cursor-pointer rounded-lg bg-primary px-8 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="cursor-pointer rounded-lg bg-primary px-8 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    href="/login"
                    className="cursor-pointer rounded-lg border border-outline-variant/40 px-8 py-3 text-center font-display font-semibold text-on-surface transition hover:bg-surface-container-high"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <SiteFooter>
          <div className="flex gap-4 text-sm">
            <Link
              href="/login"
              className="text-on-surface-variant transition hover:text-primary"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="text-on-surface-variant transition hover:text-primary"
            >
              Sign Up
            </Link>
          </div>
        </SiteFooter>
      </main>
    </div>
  );
}
