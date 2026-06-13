import { NextResponse } from 'next/server';
import { userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { os } = userAgent(request);

  const osName = os.name?.toLowerCase() ?? '';
  const platform =
    osName.includes('ios') || osName.includes('iphone') || osName.includes('ipad')
      ? 'ios'
      : osName.includes('android')
        ? 'android'
        : 'web';

  const response = NextResponse.next();
  response.headers.set('x-os-platform', platform);
  return response;
}
