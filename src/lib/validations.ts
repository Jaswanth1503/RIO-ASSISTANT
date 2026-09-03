import { z } from "zod";

export const LeadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  business_name: z.string().optional().default(""),
  project_type: z.string().min(2, "Project type is required"),
  budget: z.string().optional().default("Undisclosed"),
  timeline: z.string().optional().default("Flexible"),
  requirements: z.string().optional().default(""),
  lead_score: z.enum(["HOT", "WARM", "COLD"]).optional(),
  summary: z.string().optional().default(""),
  created_at: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "model", "system", "assistant"]),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
  leadContext: z.record(z.any()).optional(),
});
