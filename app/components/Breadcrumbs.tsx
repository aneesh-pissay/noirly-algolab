'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useRegisterCrumbs } from '@/src/components/ShellBreadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * The page's trail. On desktop it is shown in the shell's top bar; this
 * in-page copy is for narrow screens, where the top bar has no room for it.
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  useRegisterCrumbs(items);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-[0.8125rem] lg:hidden">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-1.5">
          {index > 0 && <ChevronRight aria-hidden size={13} className="text-fg-3" />}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="whitespace-nowrap text-fg-3 transition-colors hover:text-fg">
              {item.label}
            </Link>
          ) : (
            <span aria-current={index === items.length - 1 ? 'page' : undefined} className="max-w-[12rem] truncate font-medium text-fg">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
