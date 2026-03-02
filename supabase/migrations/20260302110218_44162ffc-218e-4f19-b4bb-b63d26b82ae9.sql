
-- Create cloud provider enum
CREATE TYPE public.cloud_provider AS ENUM ('aws', 'azure', 'openai', 'gcp');

-- Create connection status enum
CREATE TYPE public.connection_status AS ENUM ('connected', 'disconnected', 'error');

-- Create cloud_connections table
CREATE TABLE public.cloud_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider cloud_provider NOT NULL,
  display_name TEXT NOT NULL,
  account_identifier TEXT, -- AWS Account ID, Azure Subscription ID, etc.
  region TEXT,
  status connection_status NOT NULL DEFAULT 'connected',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider, account_identifier)
);

-- Enable RLS
ALTER TABLE public.cloud_connections ENABLE ROW LEVEL SECURITY;

-- Users can only see their own connections
CREATE POLICY "Users can view own connections"
  ON public.cloud_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert own connections"
  ON public.cloud_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own connections
CREATE POLICY "Users can update own connections"
  ON public.cloud_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own connections"
  ON public.cloud_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_cloud_connections_updated_at
  BEFORE UPDATE ON public.cloud_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
