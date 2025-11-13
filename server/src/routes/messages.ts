import { Router } from 'express';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/:matchId', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      throw new AppError(400, 'Message content is required');
    }

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (matchError || !match) {
      throw new AppError(404, 'Match not found');
    }

    const isUserInMatch = match.user_id_1 === req.user!.id || match.user_id_2 === req.user!.id;
    if (!isUserInMatch) {
      throw new AppError(403, 'Unauthorized');
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: req.user!.id,
        content: content.trim(),
      })
      .select()
      .maybeSingle();

    if (error || !message) {
      throw new AppError(400, 'Failed to send message');
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

router.get('/:matchId', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { matchId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (matchError || !match) {
      throw new AppError(404, 'Match not found');
    }

    const isUserInMatch = match.user_id_1 === req.user!.id || match.user_id_2 === req.user!.id;
    if (!isUserInMatch) {
      throw new AppError(403, 'Unauthorized');
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(id, name, avatar_url)
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      throw new AppError(500, 'Failed to fetch messages');
    }

    res.json((messages || []).reverse());
  } catch (error) {
    next(error);
  }
});

router.patch('/:messageId/read', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { messageId } = req.params;

    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .maybeSingle();

    if (fetchError || !message) {
      throw new AppError(404, 'Message not found');
    }

    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', message.match_id)
      .maybeSingle();

    const isUserInMatch = match && (match.user_id_1 === req.user!.id || match.user_id_2 === req.user!.id);
    if (!isUserInMatch) {
      throw new AppError(403, 'Unauthorized');
    }

    const { error } = await supabase
      .from('messages')
      .update({
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (error) {
      throw new AppError(400, 'Failed to mark as read');
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
