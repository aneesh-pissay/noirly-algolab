/** Other Noirly apps, for the landing tiles and the in-app switcher. */
export interface NoirlyApp {
  id: string;
  name: string;
  description: string;
  url: string;
}

function trimSlash(url: string): string {
  return url.replace(/\/$/, '');
}

export function noirlyApps(): NoirlyApp[] {
  return [
    {
      id: 'flow',
      name: 'Noirly Flow',
      description: 'Boards, workspaces and realtime task tracking.',
      url: trimSlash(process.env.NEXT_PUBLIC_FLOW_URL ?? 'https://noirly.flow.aneesh-pissay.in'),
    },
    {
      id: 'identity',
      name: 'Noirly Identity',
      description: 'One Noirly account: profile, security and connected apps.',
      url: `${trimSlash(process.env.NEXT_PUBLIC_IDENTITY_URL ?? 'http://localhost:3000')}/account`,
    },
  ];
}
