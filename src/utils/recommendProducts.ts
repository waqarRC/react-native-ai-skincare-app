import { PRODUCTS, type Product, type Concern, type IngredientTag, INGREDIENT_HELP } from "../data/products";

type ConcernScore = { key: string; score: number };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export type RecommendedProduct = {
  product: Product;
  score: number;
  matchPercent: number;
  why: string[];
  warnings: string[];
  ingredientWhy: { tag: IngredientTag; reason: string }[];
};

export function recommendProducts(params: {
  concerns?: ConcernScore[];
  avoidTags?: string[];
  limit?: number;
  category?: Product["category"] | "all";
  query?: string;
}) {
  const concerns = (params.concerns ?? []) as ConcernScore[];
  const avoid = new Set((params.avoidTags ?? []) as IngredientTag[]);
  const limit = params.limit ?? 20;
  const category = params.category ?? "all";
  const q = (params.query ?? "").trim().toLowerCase();

  const weights = new Map<Concern, number>();
  for (const c of concerns) weights.set(c.key as Concern, clamp01(c.score));

  const filtered = PRODUCTS.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (!q) return true;

    const hay = `${p.name} ${p.brand} ${p.category} ${p.keyIngredients.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  const scored: RecommendedProduct[] = filtered
    .map((p) => {
      // Fit score: sum weights of concerns this product targets
      let fit = 0;
      for (const c of p.forConcerns) fit += (weights.get(c) ?? 0);

      // Penalty for avoid tags
      let penalty = 0;
      for (const tag of p.keyIngredients) if (avoid.has(tag)) penalty += 0.6;
      for (const tag of p.avoidIf) if (avoid.has(tag)) penalty += 0.8;

      // Boost by rating
      const ratingBoost = (p.rating / 5) * 0.35;

      const score = fit + ratingBoost - penalty;

      // Build why strings
      const matchedConcerns = p.forConcerns
        .map((c) => ({ c, w: weights.get(c) ?? 0 }))
        .filter((x) => x.w > 0.2)
        .sort((a, b) => b.w - a.w)
        .slice(0, 3);

      const why = [
        ...matchedConcerns.map((x) => `Targets ${x.c} (${Math.round(x.w * 100)}%)`),
        ...p.claims.slice(0, 2).map((c) => c),
      ].slice(0, 4);

      const conflicts = p.keyIngredients.filter((t) => avoid.has(t));
      const warnings: string[] = [];
      if (conflicts.length) warnings.push(`Avoid tags detected: ${conflicts.join(", ")}`);
      if (p.avoidIf.some((t) => avoid.has(t))) warnings.push("May not suit your sensitivity preferences.");

      const ingredientWhy = p.keyIngredients.slice(0, 4).map((tag) => ({
        tag,
        reason: INGREDIENT_HELP[tag] ?? "Supports skin goals.",
      }));

      const matchPercent = Math.max(0, Math.min(100, Math.round(score * 25)));

      return { product: p, score, matchPercent, why, warnings, ingredientWhy };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
