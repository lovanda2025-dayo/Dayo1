import { Router, Response } from 'express';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, age, gender } = req.body;

    if (!email || !password || !name || !age) {
      throw new AppError(400, 'Missing required fields');
    }

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) {
      throw new AppError(400, signUpError?.message || 'Registration failed');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        name,
        age,
        gender: gender || 'não-especificado',
      });

    if (profileError) {
      throw new AppError(400, 'Failed to create profile');
    }

    const { error: detailsError } = await supabase
      .from('profile_details')
      .insert({
        user_id: user.id,
      });

    if (detailsError) {
      throw new AppError(400, 'Failed to create profile details');
    }

    const { data, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError || !data.session) {
      throw new AppError(400, 'Failed to create session');
    }

    res.status(201).json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new AppError(401, 'Invalid credentials');
    }

    res.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AppError(400, 'Logout failed');
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError(400, 'Refresh token is required');
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      throw new AppError(401, 'Invalid refresh token');
    }

    res.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', verifyAuth, async (req: AuthenticatedRequest, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
