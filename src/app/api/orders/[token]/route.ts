import { getOrderByToken } from '@/lib/catalog';
export async function GET(_request:Request,{params}:{params:Promise<{token:string}>}) {
  const {token}=await params;
  const order=/^[a-zA-Z0-9_-]{32,128}$/.test(token) ? await getOrderByToken(token):null;
  return Response.json(order ? {order} : {error:'შეკვეთა ვერ მოიძებნა.'},{status:order?200:404,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
}
