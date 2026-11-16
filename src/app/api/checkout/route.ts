import { checkoutSchema } from '@/lib/validation';
export async function POST(request: Request) {
  const origin=request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return Response.json({error:'მოთხოვნა არ არის დაშვებული.'},{status:403});
  if (Number(request.headers.get('content-length') ?? 0)>20000) return Response.json({error:'მოთხოვნა ძალიან დიდია.'},{status:413});
  let input: unknown;
  try { const body=await request.text(); if(body.length>20000) return Response.json({error:'მოთხოვნა ძალიან დიდია.'},{status:413}); input=JSON.parse(body); }
  catch { return Response.json({error:'შეამოწმეთ შეყვანილი ინფორმაცია.'},{status:400}); }
  if(!checkoutSchema.safeParse(input).success) return Response.json({error:'შეამოწმეთ საკონტაქტო ინფორმაცია, მისამართი და კალათა.'},{status:422});
  return Response.json({error:'ონლაინ შეკვეთა ჯერ არ არის ხელმისაწვდომი. გადახდა არ შესრულებულა.'},{status:503,headers:{'Cache-Control':'no-store'}});
}
