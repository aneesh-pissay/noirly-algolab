/** Human copy for `?error=` codes from Auth.js and from account linking. */
export function loginErrorMessage(code: string | undefined): string | null {
  switch (code) {
    case undefined:
    case '':
      return null;
    case 'email_unverified':
      return 'An AlgoLab account already uses this email. Verify the email in Noirly Identity, then sign in again to link it.';
    case 'already_linked':
      return 'This email belongs to an AlgoLab account linked to a different Noirly account.';
    case 'missing_email':
      return 'Your Noirly account has no email address. Add one in Noirly Identity and try again.';
    case 'AccessDenied':
      return 'Sign-in was cancelled or refused.';
    case 'Configuration':
      return 'Sign-in is not configured on this server yet. Please try again later.';
    default:
      return 'Sign-in failed. Please try again.';
  }
}
