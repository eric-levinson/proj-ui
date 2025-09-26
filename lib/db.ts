import { createClient as createServerClient } from '@/utils/supabase/server'

export async function getPlayerProjections({ limit = 100, offset = 0, orderBy = 'projected_points', order = 'desc' } = {}) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('player_projection')
    .select('*')
    .order(orderBy, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data || []
}
