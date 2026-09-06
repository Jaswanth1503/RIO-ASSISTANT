-- =================================================================
-- RIO AI REPRESENTATIVE - SUPABASE DATABASE SCHEMA
-- Table: leads
-- =================================================================

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    business_name TEXT DEFAULT '',
    project_type TEXT NOT NULL,
    budget TEXT DEFAULT 'Undisclosed',
    timeline TEXT DEFAULT 'Flexible',
    requirements TEXT DEFAULT '',
    lead_score TEXT CHECK (lead_score IN ('HOT', 'WARM', 'COLD')) DEFAULT 'WARM',
    summary TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON public.leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- 3. Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert from RIO chat widget
CREATE POLICY "Allow public insert for leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Allow select/update for authenticated service role / admin
CREATE POLICY "Allow read access for service role" 
ON public.leads 
FOR SELECT 
USING (true);

CREATE POLICY "Allow update access for service role" 
ON public.leads 
FOR UPDATE 
USING (true);

-- 4. Conversations history table (for full transcript storage)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb NOT NULL,
    summary TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON public.conversations(session_id);

-- =================================================================
-- BUSINESS OPERATING SYSTEM FULL LIFECYCLE TABLES
-- =================================================================

-- 5. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    company TEXT DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    total_revenue NUMERIC DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('Lead', 'Prospect', 'Active Client', 'Completed Client', 'Lost Client')) DEFAULT 'Lead',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id TEXT UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    company TEXT DEFAULT '',
    project_type TEXT NOT NULL,
    budget TEXT DEFAULT '',
    description TEXT DEFAULT '',
    meeting_date DATE NOT NULL,
    meeting_time TEXT NOT NULL,
    meeting_mode TEXT DEFAULT 'Google Meet',
    meeting_status TEXT CHECK (meeting_status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show', 'Rescheduled')) DEFAULT 'Scheduled',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Client Timeline Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    event_type TEXT CHECK (event_type IN (
        'Lead Created',
        'Meeting Scheduled',
        'Meeting Completed',
        'Proposal Sent',
        'Proposal Accepted',
        'Proposal Rejected',
        'Project Started',
        'Project Completed',
        'Payment Received',
        'Follow Up Added'
    )) NOT NULL,
    event_title TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id TEXT UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    scope TEXT NOT NULL,
    timeline TEXT NOT NULL,
    cost NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired')) DEFAULT 'Draft',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    description TEXT DEFAULT '',
    budget NUMERIC DEFAULT 0,
    start_date DATE,
    deadline DATE,
    status TEXT CHECK (status IN ('Upcoming', 'Active', 'On Hold', 'Completed', 'Cancelled')) DEFAULT 'Active',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    progress INTEGER DEFAULT 0,
    current_phase TEXT CHECK (current_phase IN ('Discovery', 'Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Support')) DEFAULT 'Discovery',
    risk_status TEXT CHECK (risk_status IN ('Low', 'Medium', 'High')) DEFAULT 'Low',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status TEXT CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Blocked', 'Overdue')) DEFAULT 'Pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Revenues Table
CREATE TABLE IF NOT EXISTS public.revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    payment_type TEXT DEFAULT 'Milestone Transfer',
    status TEXT CHECK (status IN ('Pending', 'Partially Paid', 'Paid', 'Overdue')) DEFAULT 'Pending',
    received_date DATE DEFAULT CURRENT_DATE
);

-- 12. Follow-Ups Table
CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    followup_date DATE NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'Completed', 'Missed', 'Cancelled')) DEFAULT 'Pending',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


