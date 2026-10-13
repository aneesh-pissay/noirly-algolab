import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, CirclePlay, Route, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@noirly-dev/ui";
import { TiltCard } from "@noirly-dev/ui/motion";
import { auth } from "@/auth";
import PublicHeader from "./components/PublicHeader";
import SiteFooter from "./components/SiteFooter";
import { NoirlyLoginButton } from "./components/NoirlyLoginButton";
import { levels, tracks } from "./data/curriculum";
import { countCurriculumLessons } from "./data/curriculumTheory";
import { BrandMark } from "@/src/components/BrandMark";
import { iconFor } from "@/src/components/Icon";
import { noirlyApps } from "@/src/lib/ecosystem";

export const metadata: Metadata = {
  title: "Noirly AlgoLab | Visualize logic. Master algorithms.",
  description:
    "Step through data structures and algorithms frame by frame, with synced code, guided lessons and quizzes.",
};

const features = [
  {
    icon: CirclePlay,
    title: "Interactive visualizers",
    copy: "Step through algorithms frame by frame with synced code highlighting — like a debugger for DSA.",
  },
  {
    icon: Route,
    title: "Structured learning path",
    copy: "Data Structures, Algorithms and Patterns — beginner to advanced, unlocked in order.",
  },
  {
    icon: BookOpen,
    title: "Theory → Visualize → Quiz",
    copy: "Read the idea, watch it run, then prove you understood it with a quiz.",
  },
  {
    icon: TrendingUp,
    title: "Progress that sticks",
    copy: "Your place in the roadmap is saved to your Noirly account, on any device.",
  },
];

const steps = [
  { step: "01", title: "Read the theory", copy: "Concise explanations with complexity analysis before you code." },
  { step: "02", title: "Run the visualizer", copy: "Play, pause and scrub through every step with live state." },
  { step: "03", title: "Pass the quiz", copy: "Score 70% or more to complete the lesson and unlock the next one." },
];

function HeroPreview() {
  const bars = [30, 60, 90, 50, 75];
  return (
    <div className="surface grain w-full max-w-sm rounded-[var(--r-lg)] p-6" aria-hidden>
      <p className="mono-label">Bubble sort · live preview</p>
      <div className="mt-5 flex h-36 items-end justify-center gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-8 rounded-t-[var(--r-xs)] ${i === 2 ? "bg-[var(--accent)]" : "bg-[var(--accent-soft)] shadow-[inset_0_0_0_1px_var(--hairline-strong)]"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="meta">Step 4 / 12</span>
        <span className="matrix-numeral text-sm text-[var(--accent)]">O(n²)</span>
      </div>
    </div>
  );
}

export default async function LandingPage() {
  const session = await auth();
  if (session?.user?.id) {
    // proxy.ts also sends signed-in visitors from `/` to the dashboard.
    redirect("/dashboard");
  }

  const totalLessons = countCurriculumLessons();

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <PublicHeader />

      <main id="main" className="flex flex-1 flex-col">
        <section className="shell section-y">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <BrandMark className="size-[4.25rem] md:size-20" />
              <p className="eyebrow mt-7">Visual DSA</p>
              <h1 className="display-lg mt-4 text-balance">Don&apos;t memorize algorithms. Watch them think.</h1>
              <p className="lede mt-5">
                Step-by-step animations, synced code tracing and {totalLessons} structured lessons, from arrays to graphs.
              </p>
              <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <NoirlyLoginButton className="flex-1" />
                <Link href="/visual-lab" className="btn btn-ghost btn-lg flex-1">
                  Try the Visual Lab
                </Link>
              </div>
              <p className="meta mt-4">Sign in with your Noirly account — email or Google</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroPreview />
            </div>
          </div>
        </section>

        <section className="section-rule relative" aria-labelledby="stats-title">
          <h2 id="stats-title" className="sr-only">
            AlgoLab in numbers
          </h2>
          <dl className="shell grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
            {[
              { value: String(totalLessons), label: "Visual lessons" },
              { value: String(tracks.length), label: "Learning tracks" },
              { value: String(levels.length), label: "Levels" },
              { value: "Free", label: "To learn" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <dd className="matrix-numeral text-3xl text-[var(--accent)]">{stat.value}</dd>
                <dt className="meta mt-2">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="section-rule relative">
          <div className="shell section-y">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">What is inside</p>
              <h2 className="display-md mt-4">Everything you need to master DSA</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {features.map(({ icon: Glyph, title, copy }) => (
                <Card key={title} variant="interactive" className="spotlight">
                  <CardHeader>
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-[var(--r-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Glyph size={18} aria-hidden />
                    </span>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="copy">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-rule relative">
          <div className="shell section-y">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">Tracks</p>
              <h2 className="display-md mt-4">Three tracks, one roadmap</h2>
              <p className="lede mx-auto mt-4">Beginner → Intermediate → Advanced across every topic.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {tracks.map((track) => {
                const Glyph = iconFor(track.id);
                return (
                  <TiltCard key={track.id}>
                    <Card className="h-full p-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[var(--r-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Glyph size={20} aria-hidden />
                      </span>
                      <h3 className="section-title mt-4">{track.title}</h3>
                      <p className="copy mt-2">{track.description}</p>
                      <ul className="mt-5 space-y-1.5">
                        {levels.map((level) => (
                          <li key={level} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">{level}</span>
                            <span className="meta">{track.topics[level]?.length ?? 0} topics</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-rule relative">
          <div className="shell section-y">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">How it works</p>
              <h2 className="display-md mt-4">Every lesson, the same three steps</h2>
            </div>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.step} className="surface-flat p-6">
                  <span className="matrix-numeral text-4xl text-[var(--accent)]/40" aria-hidden>
                    {s.step}
                  </span>
                  <h3 className="section-title mt-3">{s.title}</h3>
                  <p className="copy mt-2">{s.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-rule relative">
          <div className="shell section-y">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">Noirly</p>
              <h2 className="display-md mt-4">One account across the Noirly apps</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
              {noirlyApps().map((app) => (
                <a key={app.id} href={app.url} className="focusable block rounded-[var(--r-lg)]">
                  <Card variant="interactive" className="h-full p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="section-title">{app.name}</h3>
                      <ArrowUpRight size={16} className="text-[var(--text-muted)]" aria-hidden />
                    </div>
                    <p className="copy mt-2">{app.description}</p>
                  </Card>
                </a>
              ))}
            </div>
            <div className="mx-auto mt-12 flex max-w-xs flex-col items-center">
              <NoirlyLoginButton className="w-full" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
