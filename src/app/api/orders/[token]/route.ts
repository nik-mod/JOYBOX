import { getOrderByToken } from '@/lib/catalog';
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' };
  try {
    const order = await getOrderByToken((await params).token);
    return order ? Response.json({ order }, { headers })
      : Response.json({ error: 'შეკვეთა ვერ მოიძებნა.' }, { status: 404, headers });
  } catch {
    return Response.json({ error: 'შეკვეთის სტატუსი ვერ ჩაიტვირთა.' }, { status: 503, headers });
  }
}
