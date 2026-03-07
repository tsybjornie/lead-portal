-- ============================================================
-- ROOF MICHELIN RATING — Data Capture Layer
-- Phase 1: Collect, Don't Rate
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- PROJECT LIFECYCLE — The core 8-stage tracker
-- Every project flows: MATCHED → QUOTING → CONTRACTED →
-- IN_PROGRESS → MILESTONE_CHECK → HANDOVER → SURVEY_30D → SURVEY_6M
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_lifecycle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parties
    firm_id UUID REFERENCES firms(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    designer_name TEXT,
    homeowner_name TEXT,
    
    -- Property
    property_type TEXT,
    property_address TEXT,
    country TEXT DEFAULT 'SG' CHECK (country IN ('SG', 'MY')),
    
    -- Financial (the Michelin data gold)
    initial_quote NUMERIC(12,2),          -- first quote given
    final_invoice NUMERIC(12,2),          -- actual final amount
    budget_accuracy NUMERIC(5,2),         -- computed: (final/initial)*100
    variation_orders_total NUMERIC(12,2) DEFAULT 0,
    
    -- Timeline (the second gold)
    planned_start DATE,
    actual_start DATE,
    planned_end DATE,
    actual_end DATE,
    planned_duration_days INTEGER,
    actual_duration_days INTEGER,
    timeline_accuracy NUMERIC(5,2),       -- computed: (planned/actual)*100
    
    -- Lifecycle stage
    stage TEXT DEFAULT 'MATCHED' CHECK (stage IN (
        'MATCHED', 'QUOTING', 'CONTRACTED', 'IN_PROGRESS',
        'MILESTONE_CHECK', 'HANDOVER', 'SURVEY_30D', 'SURVEY_6M',
        'COMPLETED', 'TERMINATED'
    )),
    stage_timestamps JSONB DEFAULT '{}'::JSONB,  -- {"MATCHED": "2026-01-15T...", ...}
    termination_reason TEXT,                      -- only if TERMINATED
    
    -- Communication metrics
    avg_response_time_hours NUMERIC(6,1),  -- avg time to reply to client
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    longest_gap_hours NUMERIC(6,1),        -- longest period without response
    
    -- Completion
    total_milestones INTEGER DEFAULT 0,
    completed_milestones INTEGER DEFAULT 0,
    total_photos INTEGER DEFAULT 0,
    
    -- Metadata
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lifecycle_firm ON project_lifecycle(firm_id);
CREATE INDEX idx_lifecycle_stage ON project_lifecycle(stage);
CREATE INDEX idx_lifecycle_country ON project_lifecycle(country);

-- ────────────────────────────────────────────────────────────
-- PROJECT MILESTONES — Each checkpoint within a project
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES project_lifecycle(id) ON DELETE CASCADE,
    
    -- Milestone info
    milestone_type TEXT NOT NULL CHECK (milestone_type IN (
        'hacking_demolition', 'masonry_tiling', 'waterproofing',
        'electrical', 'plumbing', 'carpentry', 'painting',
        'ceiling', 'flooring', 'glass_aluminium', 'cleaning',
        'defect_check', 'handover', 'custom'
    )),
    milestone_name TEXT NOT NULL,            -- display name
    sequence_order INTEGER DEFAULT 0,        -- order within project
    
    -- Timeline
    planned_date DATE,
    actual_date DATE,
    status TEXT DEFAULT 'upcoming' CHECK (status IN (
        'upcoming', 'in_progress', 'completed', 'delayed', 'skipped'
    )),
    delay_days INTEGER DEFAULT 0,
    delay_reason TEXT,
    
    -- Sign-off
    designer_notes TEXT,
    client_signoff BOOLEAN DEFAULT FALSE,
    client_signoff_date TIMESTAMPTZ,
    
    -- Photo count
    required_photos INTEGER DEFAULT 5,
    uploaded_photos INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_milestones_status ON project_milestones(status);

-- ────────────────────────────────────────────────────────────
-- MILESTONE PHOTOS — Mandatory evidence per milestone
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestone_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES project_lifecycle(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE,
    
    -- Photo
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    room_tag TEXT,                    -- from ROOM_LAYOUTS (e.g. "L1 — Kitchen")
    photo_type TEXT DEFAULT 'progress' CHECK (photo_type IN (
        'progress', 'completion', 'defect', 'before', 'after'
    )),
    
    -- AI scoring (Phase 2 — nullable for now)
    ai_workmanship_score NUMERIC(5,2),   -- 0-100
    ai_alignment_score NUMERIC(5,2),     -- grout/tile alignment
    ai_finish_score NUMERIC(5,2),        -- paint/surface finish
    ai_notes TEXT,                       -- AI-generated observations
    
    -- Metadata
    uploaded_by TEXT,                     -- 'designer' or 'client'
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_project ON milestone_photos(project_id);
CREATE INDEX idx_photos_milestone ON milestone_photos(milestone_id);
CREATE INDEX idx_photos_room ON milestone_photos(room_tag);

-- ────────────────────────────────────────────────────────────
-- CLIENT SURVEYS — Post-project feedback at handover + 6 months
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES project_lifecycle(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Survey type
    survey_type TEXT NOT NULL CHECK (survey_type IN (
        'handover', '30_day', '6_month'
    )),
    
    -- Scores (1-5 scale)
    score_design INTEGER CHECK (score_design BETWEEN 1 AND 5),
    score_workmanship INTEGER CHECK (score_workmanship BETWEEN 1 AND 5),
    score_communication INTEGER CHECK (score_communication BETWEEN 1 AND 5),
    score_value INTEGER CHECK (score_value BETWEEN 1 AND 5),
    score_overall INTEGER CHECK (score_overall BETWEEN 1 AND 5),
    
    -- Would recommend
    would_recommend BOOLEAN,
    
    -- Defects (6-month survey)
    defects_reported JSONB DEFAULT '[]'::JSONB,  -- [{room, issue, severity}]
    defects_resolved BOOLEAN,
    
    -- Free text
    feedback TEXT,
    private_feedback TEXT,         -- visible only to Roof admin, not designer
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'sent', 'completed', 'expired'
    )),
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_surveys_project ON client_surveys(project_id);
CREATE INDEX idx_surveys_type ON client_surveys(survey_type);
CREATE INDEX idx_surveys_status ON client_surveys(status);

-- ────────────────────────────────────────────────────────────
-- DESIGNER METRICS — Aggregated performance (computed)
-- Updated by cron/trigger, not user-entered
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS designer_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES firms(id) ON DELETE CASCADE UNIQUE,
    
    -- Volume
    total_projects INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    terminated_projects INTEGER DEFAULT 0,
    completion_rate NUMERIC(5,2) DEFAULT 0,     -- completed / total * 100
    
    -- Financial accuracy
    avg_budget_accuracy NUMERIC(5,2),           -- avg (final/initial)*100
    budget_under_count INTEGER DEFAULT 0,       -- projects under budget
    budget_over_count INTEGER DEFAULT 0,        -- projects over budget
    avg_variation_percentage NUMERIC(5,2),      -- avg VO as % of original
    
    -- Timeline accuracy
    avg_timeline_accuracy NUMERIC(5,2),         -- avg (planned/actual)*100
    on_time_count INTEGER DEFAULT 0,
    delayed_count INTEGER DEFAULT 0,
    avg_delay_days NUMERIC(5,1) DEFAULT 0,
    
    -- Communication
    avg_response_hours NUMERIC(6,1),
    avg_longest_gap_hours NUMERIC(6,1),
    
    -- Survey scores (averaged across all projects)
    avg_design_score NUMERIC(3,1),
    avg_workmanship_score NUMERIC(3,1),
    avg_communication_score NUMERIC(3,1),
    avg_value_score NUMERIC(3,1),
    avg_overall_score NUMERIC(3,1),
    recommend_rate NUMERIC(5,2),               -- % who would recommend
    
    -- Photo/AI metrics
    total_photos INTEGER DEFAULT 0,
    avg_ai_workmanship NUMERIC(5,2),
    
    -- Shadow rating (internal only — Phase 2)
    shadow_tier TEXT CHECK (shadow_tier IN (
        'unrated', 'bib_gourmand', 'one_star', 'two_star', 'three_star'
    )) DEFAULT 'unrated',
    shadow_score NUMERIC(5,2),
    
    -- Timestamps
    last_computed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_metrics_firm ON designer_metrics(firm_id);
CREATE INDEX idx_metrics_tier ON designer_metrics(shadow_tier);

-- ────────────────────────────────────────────────────────────
-- RLS POLICIES
-- ────────────────────────────────────────────────────────────
ALTER TABLE project_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated access to project_lifecycle"
    ON project_lifecycle FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access to project_milestones"
    ON project_milestones FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access to milestone_photos"
    ON milestone_photos FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access to client_surveys"
    ON client_surveys FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access to designer_metrics"
    ON designer_metrics FOR ALL TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- TRIGGERS
-- ────────────────────────────────────────────────────────────
CREATE TRIGGER update_lifecycle_updated_at BEFORE UPDATE ON project_lifecycle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON project_milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON designer_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
