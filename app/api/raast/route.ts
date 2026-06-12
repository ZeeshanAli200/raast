import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getSecretKey } from '@/lib/server/utils';
import { Filter, Document } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = await getSecretKey();
    const authHeader = req.headers.get('x-api-key');

    if (authHeader !== secret) {
      return new Response('Unauthorized', { status: 401 });
    }

    const bankName = searchParams.get('bankName');
    const query: Filter<Document> = bankName
      ? {
          bankName,
          status: true,
          steps: { $exists: true, $ne: null },
        }
      : { status: true, steps: { $exists: true, $ne: null } };

    const client = await clientPromise;
    const db = client.db();

    const raastResponse = await db.collection('raast_redirection_banks').findOne(query);

    return NextResponse.json({ response: raastResponse });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch raasts', e }, { status: 500 });
  }
}
