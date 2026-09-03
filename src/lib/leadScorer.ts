export interface ScoreResult {
  score: "HOT" | "WARM" | "COLD";
  points: number;
  reasons: string[];
}

export function evaluateLeadScore(lead: {
  budget?: string;
  timeline?: string;
  business_name?: string;
  project_type?: string;
  requirements?: string;
}): ScoreResult {
  let points = 0;
  const reasons: string[] = [];

  const budgetStr = (lead.budget || "").toLowerCase();
  const timelineStr = (lead.timeline || "").toLowerCase();
  const reqStr = (lead.requirements || "").toLowerCase();
  const businessStr = (lead.business_name || "").trim();

  // 1. Budget Evaluation
  // Extract numbers from strings like "₹35,000", "50000", "30k", "$800"
  let numericBudget = 0;
  if (budgetStr.includes("k")) {
    const match = budgetStr.match(/(\d+(\.\d+)?)\s*k/);
    if (match) {
      numericBudget = parseFloat(match[1]) * 1000;
    }
  } else if (budgetStr.includes("$")) {
    const match = budgetStr.match(/\$?(\d[\d,]*)/);
    if (match) {
      numericBudget = parseFloat(match[1].replace(/,/g, "")) * 85; // Approx USD to INR
    }
  } else {
    const cleaned = budgetStr.replace(/[^\d]/g, "");
    if (cleaned.length > 0) {
      numericBudget = parseInt(cleaned, 10);
    }
  }

  if (numericBudget >= 20000 || budgetStr.includes(">20") || budgetStr.includes("30k") || budgetStr.includes("50k") || budgetStr.includes("lakh")) {
    points += 35;
    reasons.push("High budget indicator (> ₹20,000)");
  } else if (numericBudget >= 10000 || budgetStr.includes("10k") || budgetStr.includes("15k")) {
    points += 20;
    reasons.push("Moderate budget indicator (₹10,000 - ₹20,000)");
  } else if (budgetStr.includes("no budget") || budgetStr.includes("free") || budgetStr.includes("₹0")) {
    points -= 20;
    reasons.push("Zero/No budget stated");
  } else {
    points += 5;
    reasons.push("Budget to be defined in discussion");
  }

  // 2. Timeline Evaluation
  if (
    timelineStr.includes("urgent") ||
    timelineStr.includes("week") ||
    timelineStr.includes("asap") ||
    timelineStr.includes("immediate") ||
    timelineStr.includes("month") ||
    /\d+\s*(day|week|month)/i.test(timelineStr)
  ) {
    points += 25;
    reasons.push("Defined, actionable timeline");
  } else if (timelineStr.includes("flexible") || timelineStr.includes("exploring")) {
    points += 10;
    reasons.push("Flexible timeline");
  }

  // 3. Business use case & Decision maker
  if (businessStr && businessStr.length > 1) {
    points += 20;
    reasons.push(`Commercial/Business entity identified: ${businessStr}`);
  }

  // 4. Project clarity & depth of requirements
  if (reqStr.length > 40) {
    points += 20;
    reasons.push("Detailed project scope and requirements provided");
  } else if (reqStr.length > 15) {
    points += 10;
    reasons.push("Basic requirements outlined");
  }

  // Final tier categorization
  let score: "HOT" | "WARM" | "COLD" = "WARM";
  if (points >= 60 || numericBudget >= 20000) {
    score = "HOT";
  } else if (points <= 20 || budgetStr.includes("free") || reqStr.includes("student project")) {
    score = "COLD";
  } else {
    score = "WARM";
  }

  return { score, points, reasons };
}
