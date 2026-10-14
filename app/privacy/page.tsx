import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/app/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy policy · Noirly AlgoLab',
  description: 'What Noirly AlgoLab stores about you, why, and how to delete it.',
};

const identityUrl = (process.env.NEXT_PUBLIC_IDENTITY_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      lead={<p>AlgoLab keeps only what it needs to save your place in the curriculum. This page explains what that is.</p>}
    >
      <LegalSection id="collect" title="What we store">
        <ul>
          <li>
            <strong>Your Noirly account details:</strong> your name, email address and profile picture, as shared by
            Noirly Identity when you sign in, and the account id Identity gives you.
          </li>
          <li>
            <strong>Your learning progress:</strong> which lessons you have opened, completed and unlocked, quiz results,
            experience points and streaks.
          </li>
          <li>
            <strong>Your preferences:</strong> appearance and learning settings you choose in Settings.
          </li>
        </ul>
        <p>
          <strong>AlgoLab does not collect</strong> your location, contacts, files, advertising IDs or usage analytics.
          The public Visual Lab can be used without an account; nothing is stored about you while you do.
        </p>
      </LegalSection>

      <LegalSection id="use" title="How we use it">
        <ul>
          <li>To run AlgoLab: show your progress, unlock the next lesson, and keep your place across devices.</li>
          <li>To keep the service secure, for example by checking that requests come from a signed-in learner.</li>
        </ul>
        <p>We do not sell your data, use it for advertising, or build profiles of you.</p>
      </LegalSection>

      <LegalSection id="share" title="Who we share it with">
        <ul>
          <li>
            <strong>Noirly Identity</strong> signs you in. AlgoLab asks it only to confirm who you are.
          </li>
          <li>
            <strong>Service providers</strong> that host AlgoLab&apos;s servers and database for us and process data only on
            our instructions.
          </li>
          <li>
            <strong>Authorities</strong>, only if the law requires it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="device" title="Cookies and your device">
        <p>
          AlgoLab uses strictly necessary cookies to keep you signed in and to protect sign-in. Your theme choice and the
          last lesson tab you used are remembered in your browser. Signing out removes the session cookies.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="How long we keep it">
        <p>
          Your progress and preferences are kept for as long as you have a Noirly account. When your account is deleted,
          AlgoLab deletes your data straight away. Copies in our hosting provider&apos;s backups are overwritten on their
          normal backup cycle.
        </p>
      </LegalSection>

      <LegalSection id="delete" title="Deleting your data">
        <p>
          Delete your Noirly account from <a href={`${identityUrl}/account`}>Noirly Identity</a>. Identity tells AlgoLab,
          and AlgoLab deletes your progress, settings and account record.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
