import Link from 'next/link';
import { cn } from '@noirly-dev/ui';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';
import { BrandMark as Mark } from '@/src/components/BrandMark';

type BrandVariant = 'header' | 'sidebar' | 'footer' | 'hero';

const markSize: Record<BrandVariant, string> = {
  header: 'h-8 w-8',
  sidebar: 'h-7 w-7',
  footer: 'h-8 w-8',
  hero: 'h-12 w-12',
};

interface BrandMarkProps {
  variant?: BrandVariant;
  href?: string | null;
  className?: string;
}

/** Mark + "Noirly AlgoLab" wordmark + tagline, for public headers and footers. */
export default function BrandMark({ variant = 'header', href = '/', className = '' }: BrandMarkProps) {
  const content = (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      <Mark className={markSize[variant]} name="" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cn('truncate font-display font-semibold tracking-tight text-fg', variant === 'hero' ? 'text-xl' : 'text-sm')}>
          {BRAND_NAME}
        </span>
        <span className="meta truncate text-[0.625rem]">{BRAND_TAGLINE}</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`${BRAND_NAME} home`} className="focusable inline-flex min-w-0 max-w-full shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
