import { checkoutSchema } from '@/lib/validation';

const maxBodyBytes = 20_000;

export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  const reject = (error: string, status: number) => Response.json({ error }, { status, headers });
  const tooLarge = () => reject('მოთხოვნა ძალიან დიდია.', 413);
  const origin = request.headers.get('origin');
  const requestUrl = new URL(request.url);
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : `${requestUrl.protocol}//${request.headers.get('host') ?? requestUrl.host}`;
  if (origin !== expectedOrigin) return reject('მოთხოვნა არ არის დაშვებული.', 403);
  if (Number(request.headers.get('content-length')) > maxBodyBytes) return tooLarge();
  const reader = request.body?.getReader();
  if (!reader) return reject('შეამოწმეთ შეყვანილი ინფორმაცია.', 400);

  let input: unknown;
  try {
    const bytes = new Uint8Array(maxBodyBytes);
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > maxBodyBytes) {
        await reader.cancel().catch(() => undefined);
        return tooLarge();
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
    input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, size)));
  } catch {
    return reject('შეამოწმეთ შეყვანილი ინფორმაცია.', 400);
  } finally {
    reader.releaseLock();
  }
  if (!checkoutSchema.safeParse(input).success) {
    return reject('შეამოწმეთ საკონტაქტო ინფორმაცია, მისამართი და კალათა.', 422);
  }
  return reject('ონლაინ შეკვეთა ჯერ არ არის ხელმისაწვდომი. გადახდა არ შესრულებულა.', 503);
}
