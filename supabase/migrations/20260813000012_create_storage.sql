-- Migration: Create storage buckets and policies
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- CREATE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('hero-banners', 'hero-banners', true, 10485760, '{"image/jpeg","image/png","image/webp"}'),
  ('gallery', 'gallery', true, 10485760, '{"image/jpeg","image/png","image/webp"}'),
  ('projects', 'projects', true, 10485760, '{"image/jpeg","image/png","image/webp","video/mp4"}'),
  ('journal', 'journal', true, 10485760, '{"image/jpeg","image/png","image/webp"}'),
  ('media', 'media', true, 10485760, '{"image/jpeg","image/png","image/webp","audio/mpeg","video/mp4"}'),
  ('documents', 'documents', false, 20971520, '{"application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"}');

-- ============================================================
-- AVATARS POLICIES
-- ============================================================
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- HERO-BANNERS POLICIES
-- ============================================================
CREATE POLICY "Hero banners are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-banners');

CREATE POLICY "Super admin can upload hero banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hero-banners' AND is_super_admin());

CREATE POLICY "Super admin can update hero banners"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hero-banners' AND is_super_admin());

CREATE POLICY "Super admin can delete hero banners"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hero-banners' AND is_super_admin());

-- ============================================================
-- GALLERY POLICIES
-- ============================================================
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Super admin can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND is_super_admin());

CREATE POLICY "Super admin can update gallery images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND is_super_admin());

CREATE POLICY "Super admin can delete gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND is_super_admin());

-- ============================================================
-- PROJECTS POLICIES
-- ============================================================
CREATE POLICY "Project media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

CREATE POLICY "Super admin can upload project media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND is_super_admin());

CREATE POLICY "Super admin can update project media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'projects' AND is_super_admin());

CREATE POLICY "Super admin can delete project media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projects' AND is_super_admin());

-- ============================================================
-- JOURNAL POLICIES
-- ============================================================
CREATE POLICY "Journal images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'journal');

CREATE POLICY "Super admin can upload journal images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'journal' AND is_super_admin());

CREATE POLICY "Super admin can update journal images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'journal' AND is_super_admin());

CREATE POLICY "Super admin can delete journal images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'journal' AND is_super_admin());

-- ============================================================
-- MEDIA POLICIES
-- ============================================================
CREATE POLICY "Media files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Super admin can upload media files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND is_super_admin());

CREATE POLICY "Super admin can update media files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND is_super_admin());

CREATE POLICY "Super admin can delete media files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND is_super_admin());

-- ============================================================
-- DOCUMENTS POLICIES (private)
-- ============================================================
CREATE POLICY "Authenticated users can read own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Super admin can read all documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND is_super_admin());

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Super admin can manage all documents"
  ON storage.objects FOR ALL
  USING (bucket_id = 'documents' AND is_super_admin());

COMMIT;
