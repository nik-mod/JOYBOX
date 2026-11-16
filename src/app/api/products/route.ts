import {getProducts} from '@/lib/catalog';
export async function GET() {
  try { return Response.json({products:await getProducts()}); }
  catch { return Response.json({error:'პროდუქტების ჩატვირთვა ვერ მოხერხდა.'},{status:503}); }
}
