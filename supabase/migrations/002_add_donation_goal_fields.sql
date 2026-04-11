-- Thêm cột Mục tiêu và Nội dung cho phần thiện nguyện
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS donation_goal BIGINT,
ADD COLUMN IF NOT EXISTS donation_description TEXT;
