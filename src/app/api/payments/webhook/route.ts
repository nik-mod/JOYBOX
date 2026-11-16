export async function POST() {
  // Deliberately refuse all callbacks until the selected provider's signature and verification API are implemented.
  return Response.json({error:'Payment provider is not configured.'},{status:503});
}
