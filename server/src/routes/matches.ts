import { Router } from 'express';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        id,
        user_id_1,
        user_id_2,
        matched_at,
        messages(count)
      `)
      .or(`user_id_1.eq.${req.user!.id},user_id_2.eq.${req.user!.id}`)
      .order('matched_at', { ascending: false });

    if (error) {
      throw new AppError(500, 'Failed to fetch matches');
    }

    const matchesWithProfiles = await Promise.all(
      (matches || []).map(async (match) => {
        const otherUserId = match.user_id_1 === req.user!.id ? match.user_id_2 : match.user_id_1;

        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            age,
            avatar_url,
            bio
          `)
          .eq('id', otherUserId)
          .maybeSingle();

        return {
          ...match,
          otherUser: profile,
        };
      })
    );

    res.json(matchesWithProfiles);
  } catch (error) {
    next(error);
  }
});

router.get('/:matchId', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { matchId } = req.params;

    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (error || !match) {
      throw new AppError(404, 'Match not found');
    }

    const isUserInMatch = match.user_id_1 === req.user!.id || match.user_id_2 === req.user!.id;
    if (!isUserInMatch) {
      throw new AppError(403, 'Unauthorized');
    }

    res.json(match);
  } catch (error) {
    next(error);
  }
});

export default router;
