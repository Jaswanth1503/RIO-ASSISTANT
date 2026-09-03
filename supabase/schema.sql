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
-- BUSINESS OPERATING SYSTEM EXTENSION TABLES
-- =================================================================

-- 5. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    project_count INTEGER DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT CHECK (status IN ('Active', 'Lead', 'Former', 'Prospect')) DEFAULT 'Active',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    description TEXT DEFAULT '',
    budget NUMERIC DEFAULT 0,
    deadline DATE,
    start_date DATE,
    end_date DATE,
    progress_pct INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('Upcoming', 'Active', 'On Hold', 'Completed', 'Cancelled')) DEFAULT 'Active',
    phase TEXT CHECK (phase IN ('Discovery', 'Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Support')) DEFAULT 'Discovery',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    assigned_resources TEXT DEFAULT 'Annu Jaswanth',
    risk_status TEXT CHECK (risk_status IN ('Low', 'Medium', 'High')) DEFAULT 'Low',
    probability_pct INTEGER DEFAULT 100,
    rating INTEGER DEFAULT 5,
    outcome_notes TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    due_date DATE,
    status TEXT CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Blocked', 'Overdue')) DEFAULT 'Pending',
    assigned_to TEXT DEFAULT 'Annu Jaswanth',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TEXT NOT NULL,
    meeting_type TEXT DEFAULT 'Discovery Call (Google Meet)',
    notes TEXT DEFAULT '',
    outcome TEXT DEFAULT '',
    next_action TEXT DEFAULT '',
    status TEXT CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Follow-Ups Table
CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('Need Contact', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Waiting Response', 'Negotiation', 'Closed Won', 'Closed Lost')) DEFAULT 'Need Contact',
    next_date DATE NOT NULL,
    last_contact DATE DEFAULT CURRENT_DATE,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT CHECK (entity_type IN ('lead', 'project', 'client')) NOT NULL,
    entity_id TEXT NOT NULL,
    note_text TEXT NOT NULL,
    author TEXT DEFAULT 'Annu Jaswanth',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Communications History Table
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    comm_type TEXT CHECK (comm_type IN ('Call', 'Email', 'Meeting', 'Note', 'Message')) NOT NULL,
    summary TEXT NOT NULL,
    details TEXT DEFAULT '',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Revenues Table
CREATE TABLE IF NOT EXISTS public.revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT CHECK (category IN ('Received', 'Projected', 'Pending', 'Lost')) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

