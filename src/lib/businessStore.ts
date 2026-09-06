// RIO Business Operating System Store & Types
// Full Client Lifecycle: Lead -> Discovery Call -> Meeting -> Proposal -> Project -> Revenue -> Completion

export type ProjectCategory = "Upcoming" | "Active" | "On Hold" | "Completed" | "Cancelled";
export type ProjectPhase = "Discovery" | "Planning" | "Design" | "Development" | "Testing" | "Deployment" | "Support";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Blocked" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type MeetingStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "No Show"
  | "Rescheduled";

export type ProposalStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected" | "Expired";

export type ClientStatus = "Lead" | "Prospect" | "Active Client" | "Completed Client" | "Lost Client";

export type PaymentStatus = "Pending" | "Partially Paid" | "Paid" | "Overdue";

export type PipelineStage =
  | "NEW LEAD"
  | "CONTACT REQUIRED"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL SENT"
  | "NEGOTIATION"
  | "PROJECT STARTED"
  | "PROJECT COMPLETED"
  | "PROJECT LOST";

export type FollowUpStatus = "Pending" | "Completed" | "Missed" | "Cancelled";

export type TimelineEventType =
  | "Lead Created"
  | "Meeting Scheduled"
  | "Meeting Completed"
  | "Proposal Sent"
  | "Proposal Accepted"
  | "Proposal Rejected"
  | "Project Started"
  | "Project Completed"
  | "Payment Received"
  | "Follow Up Added";

export interface TimelineEvent {
  id: string;
  client_id: string;
  event_type: TimelineEventType;
  event_title: string;
  description: string;
  created_at: string;
}

export interface Client {
  id: string;
  client_name: string;
  name?: string; // backwards compatibility
  company: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  total_revenue: number;
  project_count: number;
  status: ClientStatus;
  created_at: string;
}

export interface Meeting {
  id: string;
  meeting_id?: string;
  client_id?: string;
  lead_id?: string;
  client_name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  description?: string;
  meeting_date: string;
  meeting_time: string;
  meeting_mode: string;
  meeting_status: MeetingStatus;
  status?: MeetingStatus; // backwards compat
  notes: string;
  created_at: string;
  updated_at?: string;
}

export interface Proposal {
  id: string;
  proposal_id: string;
  client_id: string;
  client_name: string;
  project_name: string;
  scope: string;
  deliverables: string[];
  timeline: string;
  cost: number;
  payment_terms: string;
  status: ProposalStatus;
  notes: string;
  created_at: string;
}

export interface Project {
  id: string;
  project_id?: string;
  client_id?: string;
  client_name: string;
  project_name: string;
  name?: string; // backwards compat
  description: string;
  budget: number;
  start_date: string;
  deadline: string;
  status: ProjectCategory;
  priority: TaskPriority;
  progress: number;
  progress_pct?: number; // backwards compat
  current_phase: ProjectPhase;
  phase?: ProjectPhase; // backwards compat
  risk_status: "Low" | "Medium" | "High";
  notes: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id?: string;
  project_name?: string;
  title: string;
  name?: string; // backwards compat
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
}

export interface RevenueRecord {
  id: string;
  project_id?: string;
  client_id?: string;
  client_name?: string;
  project_name?: string;
  amount: number;
  payment_type: string;
  status: PaymentStatus;
  received_date: string;
}

export interface FollowUp {
  id: string;
  client_id?: string;
  client_name: string;
  company?: string;
  phone?: string;
  email?: string;
  followup_date: string;
  next_date?: string; // backwards compat
  last_contact?: string;
  status: FollowUpStatus;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  notes: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  description?: string;
  timestamp: string;
  time?: string;
  unread: boolean;
  type: "lead" | "meeting" | "proposal" | "project" | "revenue" | "task" | "followup";
}

export interface Communication {
  id: string;
  client_id: string;
  client_name: string;
  comm_type: "Call" | "Email" | "Meeting" | "Note" | "Message";
  summary: string;
  details: string;
  timestamp: string;
}

// Phase Progress Map
export const PHASE_PROGRESS_MAP: Record<ProjectPhase, number> = {
  Discovery: 15,
  Planning: 30,
  Design: 50,
  Development: 75,
  Testing: 90,
  Deployment: 98,
  Support: 100,
};

// =================================================================
// LIVE BUSINESS DATA REPOSITORIES (INITIALIZED CLEAN - NO DEMO DATA)
// =================================================================

export const initialClients: Client[] = [];
export const initialTimelineEvents: TimelineEvent[] = [];
export const initialProposals: Proposal[] = [];
export const initialProjects: Project[] = [];
export const initialTasks: Task[] = [];
export const initialMeetings: Meeting[] = [];
export const initialFollowUps: FollowUp[] = [];
export const initialRevenues: RevenueRecord[] = [];
export const initialCommunications: Communication[] = [];
export const initialNotifications: NotificationItem[] = [];

// =================================================================
// LIFECYCLE AUTOMATION ENGINES
// =================================================================

/**
 * Automation Rule 1:
 * When a meeting is scheduled via the form:
 * Automatically creates: Lead + Client (if new) + Meeting ("Scheduled") + Timeline Event
 */
export function scheduleCallLifecycle(params: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  date?: string;
  time?: string;
  notes?: string;
}) {
  const clientId = `cli-${Date.now()}`;
  const meetingId = `meet-${Date.now()}`;
  const now = new Date().toISOString();

  const client: Client = {
    id: clientId,
    client_name: params.name,
    name: params.name,
    company: params.company || "Independent / Startup",
    email: params.email,
    phone: params.phone || "",
    address: "India",
    notes: `Acquired via RIO Discovery Call form. Topic: ${params.topic || "Consultation"}`,
    total_revenue: 0,
    project_count: 0,
    status: "Lead",
    created_at: now,
  };

  const meeting: Meeting = {
    id: meetingId,
    meeting_id: `MTG-${Date.now().toString().slice(-4)}`,
    client_id: clientId,
    client_name: params.name,
    email: params.email,
    phone: params.phone,
    company: params.company,
    project_type: params.topic || "Consultation Call",
    budget: "₹20,000+",
    description: `Discovery Call: ${params.topic || "AI / Full-Stack Project"}`,
    meeting_date: params.date || new Date().toISOString().split("T")[0],
    meeting_time: params.time || "11:00 AM IST",
    meeting_mode: "Autonomous AI Phone Call (RIO)",
    meeting_status: "Scheduled",
    status: "Scheduled",
    notes: params.notes || "Inbound booking via RIO scheduler.",
    created_at: now,
  };

  const timelineEvents: TimelineEvent[] = [
    {
      id: `tl-${Date.now()}-1`,
      client_id: clientId,
      event_type: "Lead Created",
      event_title: "Lead Created",
      description: `Prospect ${params.name} submitted lead inquiry for ${params.topic || "Project"}.`,
      created_at: now,
    },
    {
      id: `tl-${Date.now()}-2`,
      client_id: clientId,
      event_type: "Meeting Scheduled",
      event_title: "AI Phone Consultation Initiated",
      description: `Autonomous AI Phone Call by RIO scheduled for ${params.date || "Upcoming"} at ${params.time || "11:00 AM"}. Phone: ${params.phone || "N/A"}.`,
      created_at: now,
    },
  ];

  return { client, meeting, timelineEvents };
}

/**
 * Automation Rule 2:
 * When a meeting is converted to proposal:
 * Generates pre-filled proposal in "Draft" status
 */
export function convertMeetingToProposalDraft(meeting: Meeting): Proposal {
  const cost = parseInt((meeting.budget || "35000").replace(/\D/g, ""), 10) || 35000;
  return {
    id: `prop-${Date.now()}`,
    proposal_id: `PROP-${Date.now().toString().slice(-4)}`,
    client_id: meeting.client_id || `cli-${Date.now()}`,
    client_name: meeting.client_name,
    project_name: `${meeting.project_type} Platform`,
    scope: `Design, architecture, and production delivery of ${meeting.project_type} for ${meeting.company || meeting.client_name}.`,
    deliverables: [
      "Custom responsive frontend built with Next.js 15 and Tailwind CSS",
      "Robust API integration with database & autonomous background worker",
      "Lighthouse 95+ performance optimization and secure authentication",
      "2-week post-launch monitoring and technical handover documentation",
    ],
    timeline: "3-4 Weeks",
    cost,
    payment_terms: "50% mobilization upfront, 50% upon deployment signoff",
    status: "Draft",
    notes: `Derived from meeting notes: ${meeting.notes || "Ready for client scoping"}`,
    created_at: new Date().toISOString(),
  };
}

/**
 * Automation Rule 3:
 * When a proposal is accepted:
 * Automatically converts to active project in Discovery phase + logs timeline event
 */
export function convertProposalToProjectLifecycle(proposal: Proposal): {
  project: Project;
  timelineEvent: TimelineEvent;
} {
  const now = new Date().toISOString();
  const projectId = `proj-${Date.now()}`;

  const project: Project = {
    id: projectId,
    project_id: `PROJ-${Date.now().toString().slice(-4)}`,
    client_id: proposal.client_id,
    client_name: proposal.client_name,
    project_name: proposal.project_name,
    name: proposal.project_name,
    description: proposal.scope,
    budget: proposal.cost,
    start_date: now.split("T")[0],
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "Active",
    priority: "High",
    progress: 15,
    progress_pct: 15,
    current_phase: "Discovery",
    phase: "Discovery",
    risk_status: "Low",
    notes: `Originated from approved proposal ${proposal.proposal_id}`,
    created_at: now,
  };

  const timelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    client_id: proposal.client_id,
    event_type: "Proposal Accepted",
    event_title: "Proposal Accepted & Project Started",
    description: `Proposal ${proposal.proposal_id} accepted. Project ${proposal.project_name} initialized.`,
    created_at: now,
  };

  return { project, timelineEvent };
}

/**
 * Automation Rule 4:
 * When a project is completed:
 * Advances phase to Support (100%), updates revenue, and logs timeline event
 */
export function completeProjectLifecycle(project: Project): {
  revenueRecord: RevenueRecord;
  timelineEvent: TimelineEvent;
} {
  const now = new Date().toISOString();

  const revenueRecord: RevenueRecord = {
    id: `rev-${Date.now()}`,
    project_id: project.id,
    client_id: project.client_id,
    client_name: project.client_name,
    project_name: project.project_name,
    amount: project.budget,
    payment_type: "Bank Wire Milestone",
    status: "Paid",
    received_date: now.split("T")[0],
  };

  const timelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    client_id: project.client_id || "cli-1",
    event_type: "Project Completed",
    event_title: "Project Completed & Settled",
    description: `Project ${project.project_name} successfully delivered. Settlement of ₹${project.budget.toLocaleString("en-IN")} recorded.`,
    created_at: now,
  };

  return { revenueRecord, timelineEvent };
}

// =================================================================
// RIO BUSINESS ASSISTANT QUERY RESOLVER
// =================================================================

export interface RioBusinessSummary {
  activeProjectsCount: number;
  hotLeadsCount: number;
  todayMeetingsCount: number;
  pendingProposalsCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
  overdueProjectsCount: number;
  clientsNeedingFollowupCount: number;
  todayMeetingsList: string[];
  activeProjectsList: string[];
  pendingProposalsList: string[];
  clientsNeedingFollowupList: string[];
}

export function computeRioBusinessSummary(
  projects: Project[],
  meetings: Meeting[],
  proposals: Proposal[],
  revenues: RevenueRecord[],
  followUps: FollowUp[],
  hotLeadsCount = 0
): RioBusinessSummary {
  const todayStr = new Date().toISOString().split("T")[0];

  const activeProjects = projects.filter((p) => p.status === "Active");
  const overdueProjects = projects.filter(
    (p) => p.status === "Active" && p.deadline && p.deadline < todayStr
  );
  const todayMeetings = meetings.filter(
    (m) => m.meeting_date === todayStr && m.meeting_status !== "Cancelled"
  );
  const pendingProposals = proposals.filter(
    (p) => p.status === "Sent" || p.status === "Viewed" || p.status === "Draft"
  );
  const clientsNeedingFollowup = followUps.filter((f) => f.status === "Pending");

  const monthlyRevenue = revenues
    .filter((r) => r.status === "Paid" && (r.received_date || "").startsWith(todayStr.slice(0, 7)))
    .reduce((sum, r) => sum + r.amount, 0);

  const totalRevenue = revenues
    .filter((r) => r.status === "Paid")
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    activeProjectsCount: activeProjects.length,
    hotLeadsCount,
    todayMeetingsCount: todayMeetings.length,
    pendingProposalsCount: pendingProposals.length,
    monthlyRevenue,
    totalRevenue,
    overdueProjectsCount: overdueProjects.length,
    clientsNeedingFollowupCount: clientsNeedingFollowup.length,
    todayMeetingsList: todayMeetings.map((m) => `${m.client_name} at ${m.meeting_time}`),
    activeProjectsList: activeProjects.map((p) => `${p.project_name} (${p.progress}%)`),
    pendingProposalsList: pendingProposals.map((p) => `${p.project_name} for ${p.client_name} (₹${p.cost.toLocaleString("en-IN")})`),
    clientsNeedingFollowupList: clientsNeedingFollowup.map((f) => `${f.client_name} (Due: ${f.followup_date})`),
  };
}
