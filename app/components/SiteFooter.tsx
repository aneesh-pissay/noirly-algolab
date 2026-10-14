import Link from 'next/link';
import { BrandMark } from '@/src/components/BrandMark';

export default function SiteFooter() {
  return (
    <footer className="section-rule relative">
      <div className="shell flex flex-wrap items-center justify-between gap-4 py-7">
        <span className="flex items-center gap-4 text-[var(--text)]">
          <BrandMark className="size-12 md:size-14" name="" />
          <span className="display-md">Noirly AlgoLab</span>
        </span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-4">
          <span className="meta">Theory · Visualize · Quiz</span>
          <Link href="/privacy" className="meta underline-offset-4 hover:text-[var(--text)] hover:underline">
            Privacy policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
