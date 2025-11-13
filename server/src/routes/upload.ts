import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase.js';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config.js';
import fs from 'fs/promises';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const router = Router();

router.post('/avatar', verifyAuth, upload.single('file'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file provided');
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${req.user!.id}/avatar-${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new AppError(400, 'Failed to upload file');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user!.id);

    if (updateError) {
      throw new AppError(400, 'Failed to update profile');
    }

    res.json({
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/profile-photos', verifyAuth, upload.array('files', 10), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError(400, 'No files provided');
    }

    const files = req.files as Express.Multer.File[];

    const uploadedPhotos = await Promise.all(
      files.map(async (file, index) => {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${req.user!.id}/profile-${uuidv4()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload file: ${file.originalname}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('profile-photos').getPublicUrl(fileName);

        const { data: photo, error: insertError } = await supabase
          .from('profile_photos')
          .insert({
            user_id: req.user!.id,
            photo_url: publicUrl,
            order: index,
          })
          .select()
          .maybeSingle();

        if (insertError) {
          throw new Error(`Failed to save photo metadata: ${file.originalname}`);
        }

        return photo;
      })
    );

    res.status(201).json(uploadedPhotos);
  } catch (error) {
    next(error);
  }
});

router.delete('/profile-photos/:photoId', verifyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { photoId } = req.params;

    const { data: photo, error: fetchError } = await supabase
      .from('profile_photos')
      .select('*')
      .eq('id', photoId)
      .maybeSingle();

    if (fetchError || !photo) {
      throw new AppError(404, 'Photo not found');
    }

    if (photo.user_id !== req.user!.id) {
      throw new AppError(403, 'Unauthorized');
    }

    const photoUrl = new URL(photo.photo_url);
    const filePath = photoUrl.pathname.replace('/storage/v1/object/public/profile-photos/', '');

    const { error: deleteError } = await supabase.storage
      .from('profile-photos')
      .remove([filePath]);

    if (deleteError) {
      throw new AppError(400, 'Failed to delete file from storage');
    }

    const { error } = await supabase
      .from('profile_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      throw new AppError(400, 'Failed to delete photo');
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
