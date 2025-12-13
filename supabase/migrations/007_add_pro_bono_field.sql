-- Add pro bono field to appointments table
ALTER TABLE appointments ADD COLUMN is_pro_bono boolean DEFAULT false;
