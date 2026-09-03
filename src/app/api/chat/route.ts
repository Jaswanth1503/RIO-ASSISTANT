import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCompleteSystemPrompt } from "@/lib/systemPrompt";
import { saveLead } from "@/lib/leadStore";
import { ChatRequestSchema } from "@/lib/validations";

export const runtime = "nodejs";

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = geminiApiKey && !geminiApiKey.includes("your-gemini") ? new GoogleGenerativeAI(geminiApiKey) : null;

// Built-in intelligent rule-based responses for instant testing when API key is pending
function generateSmartFallbackResponse(lastMessage: string, history: Array<{ role: string; content: string }>) {
  const query = lastMessage.toLowerCase();

  // 1. Projects & Case studies
  if (query.includes("veera") || query.includes("rmc") || query.includes("fleet") || query.includes("truck")) {
    return `### Veera RMC (Ready-Mix Concrete Operations Platform)
Annu engineered an end-to-end industrial fleet telemetry and dispatch management platform for **Veera RMC**:

- **Real-Time Telemetry**: Live GPS tracking, mixer rotation verification, and route compliance.
- **Automated Dispatch Scheduler**: Dynamic truck queueing balancing batch plant mixing rates against transit times to prevent concrete setting.
- **Driver & Site e-POD**: Digital proof-of-delivery timestamps and electronic signatures.
- **Business Impact**: Reduced idle transit time by over 28% and eliminated billing disputes.

Would you like to build an operations dashboard or logistics tracking system for your business?`;
  }

  if (query.includes("pestrisk") || query.includes("pest") || query.includes("crop") || query.includes("agriculture") || query.includes("computer vision")) {
    return `### PestRisk (AI Crop Disease & Pest Risk Intelligence)
**PestRisk** is an agritech computer vision platform built by Annu Jaswanth:

- **Sub-Second Diagnosis**: Farmers upload leaf or fruit photos; deep learning models (YOLO & EfficientNet) diagnose disease with 94%+ accuracy.
- **Micro-Climate Risk Correlation**: Correlates weather data (humidity, heat) to forecast fungal spore outbreaks before visible damage.
- **Smart Treatment Engine**: Recommends organic remedies alongside chemical dosage to reduce pesticide spend by 35%.

Are you exploring machine learning or computer vision for your own project?`;
  }

  // 2. Services
  if (query.includes("service") || query.includes("offer") || query.includes("what can you do") || query.includes("build")) {
    return `Annu specializes in high-converting modern web engineering and intelligent AI systems:

1. **Portfolio & Brand Websites**: Sleek dark-mode, high-converting personal/executive sites.
2. **Business Websites**: Fast, responsive web applications with SEO and lead generation.
3. **AI Chatbots & Virtual Assistants**: Custom knowledge agents with streaming and lead capture (just like me!).
4. **Autonomous AI Agents**: Multi-step reasoning agents that execute tools, query databases, and automate workflows.
5. **Custom Dashboards**: Internal portals with real-time charts, role-based access, and telemetry.
6. **Full-Stack SaaS Applications**: End-to-end apps with auth, payment gateways, and databases.
7. **Machine Learning & Vision**: Bespoke predictive models and computer vision pipelines.

Which of these best matches what you're planning to build?`;
  }

  // 3. Pricing
  if (query.includes("price") || query.includes("pricing") || query.includes("cost") || query.includes("rate") || query.includes("how much") || query.includes("budget")) {
    return `Here is Annu's typical investment guide for common projects:

- **Portfolio Website**: ₹5,000 – ₹15,000 *(3–7 days turnaround)*
- **Business Website**: ₹10,000 – ₹50,000 *(1–2 weeks turnaround)*
- **AI Chatbot**: ₹10,000 – ₹50,000 *(5–10 days turnaround)*
- **Autonomous AI Agent**: ₹15,000 – ₹1,00,000+ *(1–3 weeks turnaround)*
- **Custom Software / SaaS**: Scope-based upon architectural review

*Note: As an AI representative, I never provide final binding quotations—final pricing is determined after reviewing your exact feature scope, integrations, and timeline.*

Could you share a bit about what you want to build and your target timeline?`;
  }

  // 4. Contact & Info
  if (query.includes("contact") || query.includes("email") || query.includes("linkedin") || query.includes("github") || query.includes("annu")) {
    return `You can connect directly with **Annu Jaswanth**:
- **Email**: [annujaswanth15@gmail.com](mailto:annujaswanth15@gmail.com)
- **GitHub**: [github.com/Jaswanth1503](https://github.com/Jaswanth1503)
- **LinkedIn**: [linkedin.com/in/annu-jaswanth-88aa4033b](https://www.linkedin.com/in/annu-jaswanth-88aa4033b/)

If you'd like Annu to review your project, feel free to drop your Name, Email, and Project Details right here, and I'll notify him immediately!`;
  }

  // 5. Lead details detection (Name, email, budget in message)
  const emailMatch = lastMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    const email = emailMatch[0];
    return `Thank you! I've recorded your email address (**${email}**). 

Could you also share your **Name**, your **estimated budget**, and when you'd like to get started? Once I have those, I will summarize your requirements and send a high-priority alert directly to Annu's inbox!`;
  }

  // Default consultative response
  return `Hello! I'm **RIO**, the personal AI representative for **Annu Jaswanth**. 

I can guide you through Annu's portfolio, explain his flagship projects (like **Veera RMC** and **PestRisk**), discuss services and pricing ranges, or help you schedule a direct strategy call.

What kind of project are you looking to create, or what questions can I answer for you?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = ChatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: parseResult.error.format() }, { status: 400 });
    }

    const { messages, leadContext } = parseResult.data;
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";

    // Check if user is sharing contact info / lead data in text
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const phoneRegex = /(?:(?:\+91|91|0)?[ -]?[6-9]\d{9})/;

    const emailMatch = lastUserMessage.match(emailRegex);
    const phoneMatch = lastUserMessage.match(phoneRegex);

    let detectedLead = null;
    if (emailMatch || (leadContext && leadContext.email)) {
      const email = emailMatch ? emailMatch[1] : leadContext?.email;
      const phone = phoneMatch ? phoneMatch[0] : leadContext?.phone || "";

      detectedLead = await saveLead({
        name: leadContext?.name || "Portfolio Visitor",
        email: email,
        phone: phone,
        business_name: leadContext?.business_name || "",
        project_type: leadContext?.project_type || "AI / Web Project",
        budget: leadContext?.budget || "Discussing in chat",
        timeline: leadContext?.timeline || "Standard",
        requirements: `${lastUserMessage} (Captured via RIO dialogue)`,
      });
    }

    // If Gemini API is configured, use Gemini 2.5 Flash / 1.5 Flash
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: getCompleteSystemPrompt(),
        });

        // Format history for Gemini SDK
        const geminiHistory = messages.slice(0, -1).map((m) => ({
          role: m.role === "assistant" || m.role === "model" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
          history: geminiHistory,
        });

        const result = await chat.sendMessageStream(lastUserMessage);

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              if (detectedLead) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: "lead_captured",
                      lead: detectedLead,
                    }) + "\n"
                  )
                );
              }

              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({
                        type: "text",
                        content: text,
                      }) + "\n"
                    )
                  );
                }
              }
              controller.close();
            } catch (streamErr) {
              controller.error(streamErr);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          },
        });
      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to smart engine:", geminiError?.message || geminiError);
      }
    }

    // Smart consultative fallback stream
    const fallbackText = generateSmartFallbackResponse(lastUserMessage, messages);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (detectedLead) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "lead_captured",
                lead: detectedLead,
              }) + "\n"
            )
          );
        }

        // Simulate smooth typing stream
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i += 3) {
          const slice = words.slice(i, i + 3).join(" ") + " ";
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "text",
                content: slice,
              }) + "\n"
            )
          );
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}
