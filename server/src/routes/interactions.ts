import { Router } from 'express';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { target_user_id, interaction_type, comment_text } = req.body;

    if (!target_user_id || !interaction_type) {
      throw new AppError(400, 'target_user_id and interaction_type are required');
    }

    if (target_user_id === req.user!.id) {
      throw new AppError(400, 'Cannot interact with yourself');
    }

    const { data: interaction, error } = await supabase
      .from('interactions')
      .insert({
        user_id: req.user!.id,
        target_user_id,
        interaction_type,
        comment_text: comment_text || null,
      })
      .select()
      .maybeSingle();

    if (error) {
      if (error.message.includes('duplicate key')) {
        throw new AppError(400, 'You have already interacted with this user in this way');
      }
      throw new AppError(400, 'Failed to create interaction');
    }

    if (interaction_type === 'like') {
      const { data: reciprocalLike } = await supabase
        .from('interactions')
        .select('*')
        .eq('user_id', target_user_id)
        .eq('target_user_id', req.user!.id)
        .eq('interaction_type', 'like')
        .maybeSingle();

      if (reciprocalLike) {
        const [user1, user2] = [req.user!.id, target_user_id].sort();

        const { error: matchError } = await supabase
          .from('matches')
          .insert({
            user_id_1: user1,
            user_id_2: user2,
          })
          .select()
          .maybeSingle();

        if (!matchError) {
          return res.status(201).json({
            interaction,
            matched: true,
          });
        }
      }
    }

    res.status(201).json({
      interaction,
      matched: false,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId } = req.params;

    const { data: interactions, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new AppError(500, 'Failed to fetch interactions');
    }

    res.json(interactions || []);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data: likesCount } = await supabase
      .from('interactions')
      .select('id', { count: 'exact' })
      .eq('target_user_id', req.user!.id)
      .eq('interaction_type', 'like');

    const { data: matchesCount } = await supabase
      .from('matches')
      .select('id', { count: 'exact' })
      .or(`user_id_1.eq.${req.user!.id},user_id_2.eq.${req.user!.id}`);

    const { data: commentsCount } = await supabase
      .from('interactions')
      .select('id', { count: 'exact' })
      .eq('target_user_id', req.user!.id)
      .eq('interaction_type', 'comment');

    res.json({
      likes: likesCount?.length || 0,
      matches: matchesCount?.length || 0,
      comments: commentsCount?.length || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
