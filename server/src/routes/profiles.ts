import { Router } from 'express';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/me', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_details(*),
        profile_photos(*)
      `)
      .eq('id', req.user!.id)
      .maybeSingle();

    if (profileError) {
      throw new AppError(500, 'Failed to fetch profile');
    }

    if (!profile) {
      throw new AppError(404, 'Profile not found');
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        age,
        bio,
        gender,
        province,
        neighborhood,
        avatar_url,
        profile_details(height, occupation, smoking, drinking, exercise, interests, languages, religion, life_desires, relationship_intention),
        profile_photos(photo_url, "order")
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new AppError(500, 'Failed to fetch profile');
    }

    if (!profile) {
      throw new AppError(404, 'Profile not found');
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.put('/me', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, age, bio, gender, gender_interest, province, neighborhood } = req.body;

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        age,
        bio,
        gender,
        gender_interest,
        province,
        neighborhood,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user!.id);

    if (error) {
      throw new AppError(400, 'Failed to update profile');
    }

    const { data: updatedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_details(*),
        profile_photos(*)
      `)
      .eq('id', req.user!.id)
      .maybeSingle();

    if (fetchError || !updatedProfile) {
      throw new AppError(500, 'Failed to fetch updated profile');
    }

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
});

router.put('/me/details', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const {
      height,
      occupation,
      company,
      education,
      educational_institution,
      smoking,
      drinking,
      exercise,
      diet,
      pets,
      children,
      interests,
      languages,
      religion,
      political_view,
      life_desires,
      relationship_intention,
    } = req.body;

    const { error } = await supabase
      .from('profile_details')
      .update({
        height,
        occupation,
        company,
        education,
        educational_institution,
        smoking,
        drinking,
        exercise,
        diet,
        pets,
        children,
        interests,
        languages,
        religion,
        political_view,
        life_desires,
        relationship_intention,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', req.user!.id);

    if (error) {
      throw new AppError(400, 'Failed to update profile details');
    }

    const { data: updated, error: fetchError } = await supabase
      .from('profile_details')
      .select('*')
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (fetchError || !updated) {
      throw new AppError(500, 'Failed to fetch updated details');
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.get('/explore/feed', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        age,
        bio,
        gender,
        province,
        neighborhood,
        avatar_url,
        profile_details(height, occupation, smoking, drinking, exercise, interests, languages, religion, life_desires, relationship_intention),
        profile_photos(photo_url, "order")
      `)
      .neq('id', req.user!.id)
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .limit(Number(limit));

    if (error) {
      throw new AppError(500, 'Failed to fetch profiles');
    }

    res.json(profiles || []);
  } catch (error) {
    next(error);
  }
});

export default router;
