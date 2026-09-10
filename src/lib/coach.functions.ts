import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FREE_DAILY_MESSAGES = 5;

const inputSchema = z.object({
  message: z.string().min(1).max(2000),
  scenario: z.string().max(120).optional(),
});

const SYSTEM_PROMPT = `You are the Shoulder Check driving coach, an AI coach that helps learners in Alberta, Canada prepare for the Class 5 road test.

Rules you must follow:
- You are an independent study aid. You are NOT affiliated with the Alberta government, a registry agent, or any examiner. If asked, say so plainly.
- Teach HOW TO DRIVE, not just how to answer questions. Give concrete, physical instructions: where to look, when to brake, what the hands and eyes do, what the examiner sees.
- Ground answers in Alberta rules (Traffic Safety Act, Basic Licence Driver's Handbook, GDL zero-alcohol rule, 30 km/h school and playground zones, 5 m railway stop distance, 50 cm parallel-park distance, doubled construction-zone fines, slow down move over at 60 km/h).
- If a rule varies by municipality or the posted sign, say to read the sign.
- Never invent fines, dates, test-booking details, or fees. If you are unsure, say what to verify with a registry agent.
- Be warm, direct and brief. 120 words or fewer unless the learner asks for a walkthrough. Use short paragraphs or a tight numbered list.
- Always end a coaching answer with one specific thing to practise next.`;

export const askCoach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    const isPremium = profile?.plan === "premium";

    if (!isPremium) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("coach_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "user")
        .gte("created_at", since);

      if ((count ?? 0) >= FREE_DAILY_MESSAGES) {
        return {
          limited: true as const,
          reply:
            "You've used today's free coaching questions. Premium unlocks unlimited coaching, full road-test simulations and every scenario lesson.",
        };
      }
    }

    const { data: history } = await supabase
      .from("coach_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const priorTurns = (history ?? [])
      .slice()
      .reverse()
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI coach is not configured yet.");
    }

    const userContent = data.scenario
      ? `[Learner is studying the scenario: ${data.scenario}]\n${data.message}`
      : data.message;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...priorTurns,
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      const message =
        res.status === 429
          ? "The coach is busy right now. Give it a few seconds and ask again."
          : res.status === 402
            ? body?.message ?? "The coach is out of AI credits. Add credits to keep coaching."
            : body?.message ?? "The coach could not answer that. Try rephrasing.";
      return { limited: false as const, reply: message, failed: true as const };
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = payload.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { limited: false as const, reply: "The coach had nothing to say. Try asking again.", failed: true as const };
    }

    await supabase.from("coach_messages").insert([
      { user_id: userId, role: "user", content: data.message },
      { user_id: userId, role: "assistant", content: reply },
    ]);

    return { limited: false as const, reply };
  });
