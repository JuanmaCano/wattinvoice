-- Create datadis_credentials table
CREATE TABLE IF NOT EXISTS datadis_credentials (
    nif TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE datadis_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage credentials
CREATE POLICY "Service role can manage credentials"
    ON datadis_credentials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create index on nif for faster lookups
CREATE INDEX IF NOT EXISTS idx_datadis_credentials_nif ON datadis_credentials(nif); 