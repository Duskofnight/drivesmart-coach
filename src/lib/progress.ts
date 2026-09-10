import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { scenarios } from "@/data/scenarios";
import { questions } from "@/data/questions";

export type Profile = {
  id: string;
  display_name: string | null;
  plan: string;
  province: string;
  test_date: string | null;
};

export const profileQuery = (userId: string | undefined) => ({
  queryKey: ["profile", userId],
  enabled: !!userId,
  queryFn: async (): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, plan, province, test_date")
      .eq("id", userId!)
      .maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
});

export const scenarioProgressQuery = (userId: string | undefined) => ({
  queryKey: ["scenario_progress", userId],
  enabled: !!userId,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("scenario_progress")
      .select("scenario_slug, score, attempts, completed")
      .eq("user_id", userId!);
    if (error) throw error;
    return data ?? [];
  },
});

export const practiceQuery = (userId: string | undefined) => ({
  queryKey: ["practice_attempts", userId],
  enabled: !!userId,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("practice_attempts")
      .select("question_id, topic, correct, created_at")
      .eq("user_id", userId!)
      .order("created_at", { ascending: false })
      .limit(400);
    if (error) throw error;
    return data ?? [];
  },
});

export const mockTestsQuery = (userId: string | undefined) => ({
  queryKey: ["mock_tests", userId],
  enabled: !!userId,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("mock_tests")
      .select("id, score, passed, mistakes, created_at")
      .eq("user_id", userId!)
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) throw error;
    return data ?? [];
  },
});

export function useSaveScenario(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { slug: string; score: number }) => {
      const { data: existing } = await supabase
        .from("scenario_progress")
        .select("attempts, score")
        .eq("user_id", userId!)
        .eq("scenario_slug", input.slug)
        .maybeSingle();

      const { error } = await supabase.from("scenario_progress").upsert(
        {
          user_id: userId!,
          scenario_slug: input.slug,
          score: Math.max(input.score, existing?.score ?? 0),
          attempts: (existing?.attempts ?? 0) + 1,
          completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,scenario_slug" },
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scenario_progress", userId] }),
  });
}

export function useSavePractice(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { questionId: string; topic: string; correct: boolean }) => {
      const { error } = await supabase.from("practice_attempts").insert({
        user_id: userId!,
        question_id: input.questionId,
        topic: input.topic,
        correct: input.correct,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_attempts", userId] }),
  });
}

export function useSaveMockTest(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { score: number; passed: boolean; mistakes: string[] }) => {
      const { error } = await supabase.from("mock_tests").insert({
        user_id: userId!,
        score: input.score,
        passed: input.passed,
        mistakes: input.mistakes,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mock_tests", userId] }),
  });
}

export function useProfile(userId: string | undefined) {
  return useQuery(profileQuery(userId));
}

/**
 * Test-readiness score, 0-100.
 * 45% scenario coverage & mastery, 30% practice accuracy, 25% mock-test results.
 */
export function computeReadiness(input: {
  progress: { scenario_slug: string; score: number; completed: boolean }[];
  practice: { correct: boolean }[];
  mocks: { score: number; passed: boolean }[];
}) {
  const totalScenarios = scenarios.length;
  const scenarioScore =
    input.progress.reduce((sum, p) => sum + Math.min(p.score, 100), 0) / (totalScenarios * 100);

  const recentPractice = input.practice.slice(0, 60);
  const practiceAccuracy = recentPractice.length
    ? recentPractice.filter((p) => p.correct).length / recentPractice.length
    : 0;
  const practiceVolume = Math.min(recentPractice.length / 30, 1);

  const bestMocks = input.mocks.slice(0, 3);
  const mockScore = bestMocks.length
    ? bestMocks.reduce((s, m) => s + m.score, 0) / (bestMocks.length * 100)
    : 0;

  const raw =
    scenarioScore * 45 + practiceAccuracy * practiceVolume * 30 + mockScore * 25;

  const score = Math.round(Math.max(0, Math.min(100, raw)));

  const weakest = weakestTopics(input.practice as { correct: boolean; topic?: string }[]);

  return {
    score,
    band:
      score >= 80
        ? ("Test ready" as const)
        : score >= 55
          ? ("Nearly there" as const)
          : score >= 25
            ? ("Building skills" as const)
            : ("Just getting started" as const),
    scenariosDone: input.progress.filter((p) => p.completed).length,
    totalScenarios,
    practiceAccuracy: Math.round(practiceAccuracy * 100),
    practiceCount: input.practice.length,
    bestMock: input.mocks.length ? Math.max(...input.mocks.map((m) => m.score)) : null,
    weakest,
  };
}

function weakestTopics(practice: { correct: boolean; topic?: string }[]) {
  const byTopic = new Map<string, { total: number; right: number }>();
  for (const p of practice) {
    const topic = p.topic ?? "general";
    const entry = byTopic.get(topic) ?? { total: 0, right: 0 };
    entry.total += 1;
    if (p.correct) entry.right += 1;
    byTopic.set(topic, entry);
  }
  return [...byTopic.entries()]
    .filter(([, v]) => v.total >= 2)
    .map(([topic, v]) => ({ topic, accuracy: Math.round((v.right / v.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
}

export const totalQuestions = questions.length;
