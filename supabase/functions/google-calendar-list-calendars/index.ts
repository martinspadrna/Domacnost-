import { activeConnection, assertHouseholdMember, corsHeaders, getUserFromRequest, googleAccessToken, googleFetch, jsonResponse, publicConnection, readBody, serviceClient } from '../_shared/google-calendar.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    await assertHouseholdMember(supabase, householdId, user.id);
    const connection = await activeConnection(supabase, householdId, user.id);
    const accessToken = await googleAccessToken(supabase, connection.id);
    const data = await googleFetch('/users/me/calendarList?minAccessRole=reader&showHidden=false', accessToken);
    const calendars = (data.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary,
      description: item.description || '',
      primary: Boolean(item.primary),
      accessRole: item.accessRole || '',
      backgroundColor: item.backgroundColor || '',
      foregroundColor: item.foregroundColor || '',
      selected: Boolean(item.selected),
    }));
    return jsonResponse({ connection: publicConnection(connection), calendars });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
