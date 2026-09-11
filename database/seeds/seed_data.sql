-- VentureNest Seed Data

-- 1. Insert Initial Users
INSERT INTO users (id, email, password_hash, display_name, role) VALUES
('u1111111-1111-1111-1111-111111111111', 'admin@venturenest.com', 'pbkdf2:sha256:adminpass', 'System Administrator', 'admin'),
('u2222222-2222-2222-2222-222222222222', 'student@incubator.edu', 'pbkdf2:sha256:studentpass', 'Alex Rivera (Founder)', 'student_incubator'),
('u3333333-3333-3333-3333-333333333333', 'mentor@advisor.com', 'pbkdf2:sha256:mentorpass', 'Dr. Sarah Chen (Venture Mentor)', 'mentor')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Organisation
INSERT INTO organisations (id, name, slug, plan, ai_token_quota) VALUES
('o1111111-1111-1111-1111-111111111111', 'Innovation Lab Incubator', 'innovation-lab', 'incubator_pro', 1000000)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Organisation Members
INSERT INTO organisation_members (organisation_id, user_id, role) VALUES
('o1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'admin'),
('o1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'founder'),
('o1111111-1111-1111-1111-111111111111', 'u3333333-3333-3333-3333-333333333333', 'mentor')
ON CONFLICT DO NOTHING;

-- 4. Insert Sample Project
INSERT INTO projects (id, organisation_id, name, stage, status, owner_id, context_json) VALUES
('p1111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'EcoPack AI', 'seed', 'active', 'u2222222-2222-2222-2222-222222222222', 
'{"problem": "Sustainable packaging cost calculation is complex for SMBs.", "target_audience": "E-commerce retailers", "geography": "North America"}'::jsonb)
ON CONFLICT DO NOTHING;

-- 5. Insert Sample Submitted Document
INSERT INTO submitted_documents (id, project_id, uploader_id, title, file_type, file_url, file_size_bytes, tags, notes) VALUES
('d1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'EcoPack_PitchDeck_v1.pdf', 'pdf', 'https://storage.venturenest.com/docs/EcoPack_PitchDeck_v1.pdf', 2450000, '["pitch_deck", "v1", "seed_round"]'::jsonb, 'Initial pitch deck submission for Incubator Cohort Spring 2026.')
ON CONFLICT DO NOTHING;

-- 6. Insert Sample Mentorship Request
INSERT INTO mentorship_requests (id, project_id, student_id, mentor_id, title, category, description, status) VALUES
('m1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'u3333333-3333-3333-3333-333333333333', 'Financial Model & CAC Assumptions Review', 'finance', 'We need help reviewing our customer acquisition cost (CAC) assumptions and 12-month runway projection before our incubator demo day.', 'open')
ON CONFLICT DO NOTHING;
