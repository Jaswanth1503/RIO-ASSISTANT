export type ProjectCategory = "Upcoming" | "Active" | "On Hold" | "Completed" | "Cancelled";
export type ProjectPhase = "Discovery" | "Planning" | "Design" | "Development" | "Testing" | "Deployment" | "Support";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Blocked" | "Overdue";
export type MeetingStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
export type FollowUpStatus =
  | "Need Contact"
  | "Contacted"
  | "Meeting Scheduled"
  | "Proposal Sent"
  | "Waiting Response"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

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

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  project_count: number;
  total_revenue: number;
  last_contact: string;
  status: "Active" | "Lead" | "Former" | "Prospect";
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  client_id?: string;
  client_name: string;
  project_type: string;
  description: string;
  budget: number;
  deadline: string;
  start_date: string;
  end_date?: string;
  progress_pct: number;
  status: ProjectCategory;
  phase: ProjectPhase;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assigned_resources: string;
  risk_status: "Low" | "Medium" | "High";
  probability_pct: number;
  rating?: number;
  outcome_notes?: string;
  notes: string;
}

export interface Task {
  id: string;
  project_id?: string;
  project_name?: string;
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  due_date: string;
  status: TaskStatus;
  assigned_to: string;
}

export interface Meeting {
  id: string;
  client_name: string;
  client_email?: string;
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  notes: string;
  outcome: string;
  next_action: string;
  status: MeetingStatus;
}

export interface FollowUp {
  id: string;
  lead_id?: string;
  client_name: string;
  company: string;
  phone: string;
  email: string;
  status: FollowUpStatus;
  next_date: string;
  last_contact: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  notes: string;
}

export interface Note {
  id: string;
  entity_type: "lead" | "project" | "client";
  entity_id: string;
  note_text: string;
  author: string;
  created_at: string;
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

export interface RevenueRecord {
  id: string;
  project_name: string;
  amount: number;
  category: "Received" | "Projected" | "Pending" | "Lost";
  payment_date: string;
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "lead" | "followup" | "meeting" | "project" | "task";
  time: string;
  unread: boolean;
}

export const PHASE_PROGRESS_MAP: Record<ProjectPhase, number> = {
  Discovery: 15,
  Planning: 30,
  Design: 50,
  Development: 75,
  Testing: 90,
  Deployment: 98,
  Support: 100,
};

// Initial in-memory data store for Annu Jaswanth's Business OS
export const initialClients: Client[] = [
  {
    id: "cli-1",
    name: "Suresh Reddy",
    company: "Reddy Infrastructure & ReadyMix",
    email: "suresh.reddy@techventures.io",
    phone: "+91 98480 22334",
    address: "Hyderabad, Telangana",
    project_count: 2,
    total_revenue: 125000,
    last_contact: "2026-09-02",
    status: "Active",
    notes: "Owner of concrete batch plants and transit fleet. Strong referral partner.",
  },
  {
    id: "cli-2",
    name: "Ananya Sharma",
    company: "GrowthPulse Marketing",
    email: "ananya@growthpulse.co",
    phone: "+91 99887 76655",
    address: "Bangalore, Karnataka",
    project_count: 1,
    total_revenue: 35000,
    last_contact: "2026-09-01",
    status: "Active",
    notes: "Fast growing digital agency, requested AI agent to handle qualification.",
  },
  {
    id: "cli-3",
    name: "Ravi Teja",
    company: "Acme Agritech Solutions",
    email: "ravi@acmeagritech.com",
    phone: "+91 99887 76655",
    address: "Vijayawada, Andhra Pradesh",
    project_count: 1,
    total_revenue: 45000,
    last_contact: "2026-09-03",
    status: "Active",
    notes: "Interested in PestRisk computer vision extension for vineyard disease diagnostics.",
  },
  {
    id: "cli-4",
    name: "Vikram Malhotra",
    company: "Malhotra & Partners",
    email: "vikram.m@gmail.com",
    phone: "+91 91234 56789",
    address: "Mumbai, Maharashtra",
    project_count: 1,
    total_revenue: 15000,
    last_contact: "2026-08-28",
    status: "Active",
    notes: "Corporate executive portfolio with publication blog and booking integration.",
  },
];

export const initialProjects: Project[] = [
  {
    id: "prj-1",
    name: "Veera RMC Fleet Telemetry Platform",
    client_id: "cli-1",
    client_name: "Suresh Reddy",
    project_type: "Industrial IoT & Full Stack Web",
    description: "Real-time GPS tracking, batch queue scheduler, driver e-POD, and transit delay optimization.",
    budget: 65000,
    deadline: "2026-09-18",
    start_date: "2026-08-15",
    progress_pct: 85,
    status: "Active",
    phase: "Testing",
    priority: "Urgent",
    assigned_resources: "Annu Jaswanth",
    risk_status: "Low",
    probability_pct: 100,
    notes: "Fleet telemetry integration complete. Conducting stress tests on GPS websocket relays.",
  },
  {
    id: "prj-2",
    name: "PestRisk Computer Vision Agritech Engine",
    client_id: "cli-3",
    client_name: "Ravi Teja",
    project_type: "Deep Learning & Mobile PWA",
    description: "YOLO crop pest diagnostic model with microclimate spore risk forecast integration.",
    budget: 45000,
    deadline: "2026-09-28",
    start_date: "2026-08-25",
    progress_pct: 75,
    status: "Active",
    phase: "Development",
    priority: "High",
    assigned_resources: "Annu Jaswanth",
    risk_status: "Low",
    probability_pct: 100,
    notes: "Model trained to 94.2% accuracy. Building frontend image upload canvas.",
  },
  {
    id: "prj-3",
    name: "GrowthPulse AI Qualification Agent",
    client_id: "cli-2",
    client_name: "Ananya Sharma",
    project_type: "Autonomous AI Agent",
    description: "Custom conversational AI with Calendly and HubSpot integration for marketing leads.",
    budget: 35000,
    deadline: "2026-10-10",
    start_date: "2026-09-12",
    progress_pct: 15,
    status: "Upcoming",
    phase: "Discovery",
    priority: "Medium",
    assigned_resources: "Annu Jaswanth",
    risk_status: "Low",
    probability_pct: 90,
    notes: "Discovery call completed. Wireframes approved.",
  },
  {
    id: "prj-4",
    name: "Malhotra Executive Brand Platform",
    client_id: "cli-4",
    client_name: "Vikram Malhotra",
    project_type: "Portfolio Website",
    description: "Modern dark-mode executive showcase with writing archive and speaking request form.",
    budget: 15000,
    deadline: "2026-08-20",
    start_date: "2026-08-10",
    end_date: "2026-08-19",
    progress_pct: 100,
    status: "Completed",
    phase: "Support",
    priority: "Low",
    assigned_resources: "Annu Jaswanth",
    risk_status: "Low",
    probability_pct: 100,
    rating: 5,
    outcome_notes: "Delivered 1 day ahead of schedule. Client gave 5/5 stars.",
    notes: "Source code handed over via GitHub.",
  },
];

export const initialTasks: Task[] = [
  {
    id: "tsk-1",
    project_id: "prj-1",
    project_name: "Veera RMC",
    name: "Configure WebSocket reconnect retry for GPS units",
    description: "Ensure transit trucks reconnect automatically when exiting tunnel dead-zones.",
    priority: "Urgent",
    due_date: "2026-09-04",
    status: "In Progress",
    assigned_to: "Annu Jaswanth",
  },
  {
    id: "tsk-2",
    project_id: "prj-2",
    project_name: "PestRisk",
    name: "Fine-tune YOLO anchor boxes for grape leaf blight",
    description: "Optimize bounding box confidence on early stage fungal lesions.",
    priority: "High",
    due_date: "2026-09-06",
    status: "Pending",
    assigned_to: "Annu Jaswanth",
  },
  {
    id: "tsk-3",
    project_id: "prj-1",
    project_name: "Veera RMC",
    name: "Audit e-POD digital signature canvas on mobile",
    description: "Verify touch event latency on Android field tablets.",
    priority: "Medium",
    due_date: "2026-09-08",
    status: "Pending",
    assigned_to: "Annu Jaswanth",
  },
  {
    id: "tsk-4",
    name: "Send milestone invoice to GrowthPulse",
    description: "40% advance payment for AI agent development kickoff.",
    priority: "High",
    due_date: "2026-09-05",
    status: "Pending",
    assigned_to: "Annu Jaswanth",
  },
  {
    id: "tsk-5",
    project_id: "prj-4",
    project_name: "Malhotra Brand",
    name: "DNS verification & SSL Certificate renewal",
    description: "Verify Cloudflare CNAME and edge certificates.",
    priority: "Low",
    due_date: "2026-08-18",
    status: "Completed",
    assigned_to: "Annu Jaswanth",
  },
];

export const initialMeetings: Meeting[] = [
  {
    id: "mtg-1",
    client_name: "Ravi Teja (Acme Agritech)",
    client_email: "ravi@acmeagritech.com",
    meeting_date: "2026-09-04",
    meeting_time: "03:00 PM IST",
    meeting_type: "Architecture Review & Dataset Check (Google Meet)",
    notes: "Reviewing leaf image resolution and API latency requirements.",
    outcome: "Pending",
    next_action: "Finalize deployment server specs on AWS / Vercel",
    status: "Scheduled",
  },
  {
    id: "mtg-2",
    client_name: "Ananya Sharma (GrowthPulse)",
    client_email: "ananya@growthpulse.co",
    meeting_date: "2026-09-07",
    meeting_time: "11:30 AM IST",
    meeting_type: "AI Bot Prompt & Tool Schema Walkthrough",
    notes: "Walk through custom qualification rules and CRM integration fields.",
    outcome: "Pending",
    next_action: "Deliver interactive prototype preview",
    status: "Scheduled",
  },
  {
    id: "mtg-3",
    client_name: "Suresh Reddy (Veera RMC)",
    client_email: "suresh.reddy@techventures.io",
    meeting_date: "2026-08-30",
    meeting_time: "05:00 PM IST",
    meeting_type: "UAT Sign-off & Driver Training Demo",
    notes: "Demonstrated live truck telemetry and digital delivery receipt generation.",
    outcome: "Approved with praise. Client requested minor font enlargement for field tablets.",
    next_action: "Deploy production release v1.4",
    status: "Completed",
  },
];

export const initialFollowUps: FollowUp[] = [
  {
    id: "flw-1",
    client_name: "Suresh Reddy",
    company: "Reddy Infrastructure & ReadyMix",
    phone: "+91 98480 22334",
    email: "suresh.reddy@techventures.io",
    status: "Closed Won",
    next_date: "2026-09-15",
    last_contact: "2026-09-02",
    priority: "Urgent",
    notes: "Check on dispatch speed after first full week of live operations.",
  },
  {
    id: "flw-2",
    client_name: "Ananya Sharma",
    company: "GrowthPulse Marketing",
    phone: "+91 99887 76655",
    email: "ananya@growthpulse.co",
    status: "Proposal Sent",
    next_date: "2026-09-05",
    last_contact: "2026-09-01",
    priority: "High",
    notes: "Proposal sent for ₹35,000 AI Agent. Following up on contract approval.",
  },
  {
    id: "flw-3",
    client_name: "Ravi Teja",
    company: "Acme Agritech Solutions",
    phone: "+91 99887 76655",
    email: "ravi@acmeagritech.com",
    status: "Negotiation",
    next_date: "2026-09-04",
    last_contact: "2026-09-03",
    priority: "High",
    notes: "Discovery call scheduled. Finalizing computer vision model deployment options.",
  },
  {
    id: "flw-4",
    client_name: "Dr. K. Srinivas",
    company: "Srinivas Diagnostics Clinic",
    phone: "+91 94401 55667",
    email: "dr.srinivas@clinic.org",
    status: "Need Contact",
    next_date: "2026-09-04",
    last_contact: "2026-09-03",
    priority: "Urgent",
    notes: "Requested automated patient WhatsApp appointment confirmation agent.",
  },
];

export const initialCommunications: Communication[] = [
  {
    id: "comm-1",
    client_id: "cli-1",
    client_name: "Suresh Reddy",
    comm_type: "Call",
    summary: "Reviewed telemetry GPS refresh intervals",
    details: "Agreed to set transit polling interval to 5 seconds when truck in motion, 60s when parked.",
    timestamp: "2026-09-02T14:30:00Z",
  },
  {
    id: "comm-2",
    client_id: "cli-2",
    client_name: "Ananya Sharma",
    comm_type: "Email",
    summary: "Sent proposal and architecture diagram",
    details: "Delivered comprehensive PDF proposal covering Gemini tool schemas and HubSpot webhook hooks.",
    timestamp: "2026-09-01T10:15:00Z",
  },
  {
    id: "comm-3",
    client_id: "cli-3",
    client_name: "Ravi Teja",
    comm_type: "Meeting",
    summary: "Dataset intake & requirements kickoff",
    details: "Received sample 4K leaf images. Model requirements confirmed at 90%+ confidence threshold.",
    timestamp: "2026-08-29T16:00:00Z",
  },
];

export const initialRevenues: RevenueRecord[] = [
  {
    id: "rev-1",
    project_name: "Veera RMC Platform (Phase 1 Deposit)",
    amount: 30000,
    category: "Received",
    payment_date: "2026-08-15",
    notes: "Bank wire advance deposit received.",
  },
  {
    id: "rev-2",
    project_name: "Veera RMC Platform (Phase 2 Demo)",
    amount: 25000,
    category: "Received",
    payment_date: "2026-08-30",
    notes: "UAT milestone sign-off payment received.",
  },
  {
    id: "rev-3",
    project_name: "Malhotra Executive Brand Platform",
    amount: 15000,
    category: "Received",
    payment_date: "2026-08-20",
    notes: "Final production sign-off settlement.",
  },
  {
    id: "rev-4",
    project_name: "Veera RMC Final Settlement",
    amount: 10000,
    category: "Pending",
    payment_date: "2026-09-18",
    notes: "Scheduled upon final production rollout completion.",
  },
  {
    id: "rev-5",
    project_name: "PestRisk Agritech Engine",
    amount: 45000,
    category: "Pending",
    payment_date: "2026-09-28",
    notes: "Advance invoice generated.",
  },
  {
    id: "rev-6",
    project_name: "GrowthPulse AI Qualification Agent",
    amount: 35000,
    category: "Projected",
    payment_date: "2026-10-10",
    notes: "Probability 90%, proposal under review.",
  },
  {
    id: "rev-7",
    project_name: "Local Gym Website Inquiry",
    amount: 8000,
    category: "Lost",
    payment_date: "2026-08-12",
    notes: "Client opted for DIY builder template.",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "⚡ Hot Lead Qualified",
    description: "Suresh Reddy submitted an industrial dispatch inquiry (₹65,000 budget).",
    type: "lead",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: "notif-2",
    title: "📅 Strategy Call in 1 Hour",
    description: "Meeting with Ravi Teja (Acme Agritech) at 03:00 PM IST on Google Meet.",
    type: "meeting",
    time: "45 mins ago",
    unread: true,
  },
  {
    id: "notif-3",
    title: "⏰ Follow-Up Due Today",
    description: "Proposal follow-up with Ananya Sharma (GrowthPulse Marketing).",
    type: "followup",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "notif-4",
    title: "⚠️ High Priority Task Due Tomorrow",
    description: "Configure WebSocket reconnect retry for GPS units (Veera RMC).",
    type: "task",
    time: "4 hours ago",
    unread: false,
  },
];
