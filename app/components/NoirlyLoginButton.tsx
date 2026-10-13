import { LogIn } from 'lucide-react';
import { cn } from '@noirly-dev/ui';
import { noirlyLogin } from '@/app/login/actions';

/**
 * Starts sign-in with Noirly Identity (a plain redirect; Identity offers
 * email and Google). Works without client JavaScript.
 */
export function NoirlyLoginButton({ next = '/dashboard', className, size = 'lg' }: { next?: string; className?: string; size?: 'sm' | 'lg' }) {
  return (
    <form action={noirlyLogin} className={className}>
      <input type="hidden" name="next" value={next} />
      <button type="submit" className={cn('btn btn-solid w-full', size === 'lg' ? 'btn-lg' : 'btn-sm')}>
        <LogIn size={size === 'lg' ? 16 : 14} aria-hidden />
        Noirly Login
      </button>
    </form>
  );
}
