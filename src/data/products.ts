export type Concern =
  | "acne"
  | "oiliness"
  | "pores"
  | "texture"
  | "dryness"
  | "redness"
  | "dark_spots"
  | "dullness"
  | "fine_lines"
  | "sensitivity";

export type IngredientTag =
  | "niacinamide"
  | "salicylic_acid"
  | "retinoid"
  | "azelaic_acid"
  | "ceramides"
  | "hyaluronic_acid"
  | "vitamin_c"
  | "glycolic_acid"
  | "fragrance"
  | "alcohol_denat"
  | "benzoyl_peroxide"
  | "panthenol"
  | "centella"
  | "squalane"
  | "mineral_spf"
  | "chemical_spf"
  | "peptides"
  | "tranexamic_acid"
  | "licorice"
  | "urea"
  | "lactic_acid";

export type ProductCategory =
  | "cleanser"
  | "serum"
  | "treatment"
  | "moisturizer"
  | "sunscreen"
  | "toner";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: "$" | "$$" | "$$$";
  rating: number; // 0-5
  image?: string;
  colors?: string[];
  keyIngredients: IngredientTag[];
  ingredientsText: string;
  claims: string[];
  forConcerns: Concern[];
  avoidIf: IngredientTag[];
  howToUse: string;
};

export const INGREDIENT_HELP: Record<IngredientTag, string> = {
  niacinamide: "Helps oil balance, pores appearance, and uneven tone.",
  salicylic_acid: "BHA that unclogs pores and helps acne/blackheads.",
  retinoid: "Supports texture + fine lines; start slowly (PM only).",
  azelaic_acid: "Helps redness, acne marks, and uneven tone; usually gentle.",
  ceramides: "Supports skin barrier and reduces dryness/irritation.",
  hyaluronic_acid: "Humectant that pulls water into skin for hydration.",
  vitamin_c: "Brightening antioxidant; supports dark spots and dullness.",
  glycolic_acid: "AHA exfoliant for texture + dullness; introduce gradually.",
  fragrance: "May irritate sensitive skin; consider fragrance-free.",
  alcohol_denat: "Can feel drying for some; depends on formula + skin type.",
  benzoyl_peroxide: "Antibacterial for acne; can be drying/irritating.",
  panthenol: "Soothing + barrier support (pro-vitamin B5).",
  centella: "Calming ingredient, supports redness and irritation.",
  squalane: "Lightweight emollient that supports dryness + barrier.",
  mineral_spf: "Zinc/TiO2; often better tolerated for sensitive skin.",
  chemical_spf: "Modern filters can feel lighter; can irritate some.",
  peptides: "Support skin feel and signs of aging (fine lines).",
  tranexamic_acid: "Targets discoloration and dark spots.",
  licorice: "Brightening + soothing, helps uneven tone.",
  urea: "Hydration + gentle smoothing for rough texture.",
  lactic_acid: "Gentle AHA for dryness + texture; usually milder than glycolic.",
};

export const PRODUCTS: Product[] = [
  // Cleansers (6)
  {
    id: "c1",
    name: "Gentle Hydrating Cleanser",
    brand: "DermaCare",
    category: "cleanser",
    price: "$$",
    rating: 4.6,
    image: "https://placehold.co/240x300.png?text=Gentle+Cleanser",
    colors: ["#F7E7E9","#F0F8FF"],
    keyIngredients: ["panthenol", "ceramides"],
    ingredientsText: "Water, Glycerin, Cocamidopropyl Betaine, Panthenol, Ceramides...",
    claims: ["Gentle cleanse", "Barrier support"],
    forConcerns: ["dryness", "sensitivity", "redness"],
    avoidIf: [],
    howToUse: "AM/PM. Massage 30–60s, rinse.",
  },
  {
    id: "c2",
    name: "Oil-Control Gel Cleanser",
    brand: "ClearSkin",
    category: "cleanser",
    price: "$",
    rating: 4.2,
    image: "https://placehold.co/240x300.png?text=Oil+Control",
    colors: ["#E8F8F5","#FFF5F7"],
    keyIngredients: ["niacinamide"],
    ingredientsText: "Water, Surfactants, Niacinamide...",
    claims: ["Removes excess oil", "Fresh finish"],
    forConcerns: ["oiliness", "pores", "acne"],
    avoidIf: ["fragrance"],
    howToUse: "AM/PM. Use small amount, rinse well.",
  },
  {
    id: "c3",
    name: "Cream Cleanser (Sensitive)",
    brand: "CalmLab",
    category: "cleanser",
    price: "$$",
    rating: 4.5,
    image: "https://placehold.co/240x300.png?text=Cream+Cleanser",
    colors: ["#F6F9FF","#FFF8F0"],
    keyIngredients: ["centella", "panthenol"],
    ingredientsText: "Water, Mild Cleansers, Centella, Panthenol...",
    claims: ["Calming", "No tight feeling"],
    forConcerns: ["sensitivity", "redness", "dryness"],
    avoidIf: ["fragrance"],
    howToUse: "AM/PM. Gentle massage, rinse or wipe off.",
  },
  {
    id: "c4",
    name: "BHA Cleanser (Low %)",
    brand: "PoreFix",
    category: "cleanser",
    price: "$$",
    rating: 4.1,
    image: "https://placehold.co/240x300.png?text=BHA+Cleanser",
    colors: ["#F0FFF4","#F7F7FF"],
    keyIngredients: ["salicylic_acid"],
    ingredientsText: "Water, Salicylic Acid, Mild Surfactants...",
    claims: ["Helps clogged pores"],
    forConcerns: ["pores", "oiliness", "acne"],
    avoidIf: [],
    howToUse: "PM preferred. 3–5x/week if sensitive.",
  },
  {
    id: "c5",
    name: "Hydrating Cleanser + HA",
    brand: "HydraPlus",
    category: "cleanser",
    price: "$$",
    rating: 4.4,
    keyIngredients: ["hyaluronic_acid", "panthenol"],
    ingredientsText: "Water, Glycerin, Hyaluronic Acid, Panthenol...",
    claims: ["Hydration boost"],
    forConcerns: ["dryness", "dullness", "sensitivity"],
    avoidIf: [],
    howToUse: "AM/PM. Rinse with lukewarm water.",
  },
  {
    id: "c6",
    name: "Brightening Cleanser",
    brand: "GlowLab",
    category: "cleanser",
    price: "$",
    rating: 4.0,
    keyIngredients: ["vitamin_c"],
    ingredientsText: "Water, Mild Surfactants, Vitamin C derivative...",
    claims: ["Refresh + glow"],
    forConcerns: ["dullness"],
    avoidIf: ["fragrance"],
    howToUse: "AM. Follow with SPF.",
  },

  // Toners (4)
  {
    id: "t1",
    name: "Hydrating Toner (Alcohol-free)",
    brand: "HydraPlus",
    category: "toner",
    price: "$",
    rating: 4.5,
    keyIngredients: ["hyaluronic_acid", "panthenol"],
    ingredientsText: "Water, Glycerin, Hyaluronic Acid, Panthenol...",
    claims: ["Hydration", "Plumps"],
    forConcerns: ["dryness", "dullness", "sensitivity"],
    avoidIf: ["alcohol_denat"],
    howToUse: "AM/PM after cleansing. Pat into skin.",
  },
  {
    id: "t2",
    name: "Pore-Minimizing Toner",
    brand: "PoreFix",
    category: "toner",
    price: "$$",
    rating: 4.1,
    keyIngredients: ["niacinamide"],
    ingredientsText: "Water, Niacinamide, Soothing agents...",
    claims: ["Oil balance", "Refined look"],
    forConcerns: ["pores", "oiliness"],
    avoidIf: ["fragrance"],
    howToUse: "AM/PM. Use before serums.",
  },
  {
    id: "t3",
    name: "Soothing Mist Toner",
    brand: "CalmLab",
    category: "toner",
    price: "$$",
    rating: 4.3,
    keyIngredients: ["centella", "panthenol"],
    ingredientsText: "Centella, Panthenol, Humectants...",
    claims: ["Calms redness"],
    forConcerns: ["redness", "sensitivity"],
    avoidIf: ["fragrance"],
    howToUse: "Anytime. Especially after cleansing.",
  },
  {
    id: "t4",
    name: "Mild AHA Toner",
    brand: "SmoothCo",
    category: "toner",
    price: "$$",
    rating: 4.0,
    keyIngredients: ["lactic_acid"],
    ingredientsText: "Water, Lactic Acid, Humectants...",
    claims: ["Smooth texture gently"],
    forConcerns: ["texture", "dullness"],
    avoidIf: [],
    howToUse: "PM 2–3x/week. Avoid same night as strong retinoid initially.",
  },

  // Serums (8)
  {
    id: "s1",
    name: "Niacinamide 10% Serum",
    brand: "GlowLab",
    category: "serum",
    price: "$",
    rating: 4.4,
    keyIngredients: ["niacinamide"],
    ingredientsText: "Water, Niacinamide, Zinc PCA...",
    claims: ["Oil control", "Tone", "Pores"],
    forConcerns: ["oiliness", "pores", "texture", "dark_spots"],
    avoidIf: [],
    howToUse: "AM/PM. 2–3 drops before moisturizer.",
  },
  {
    id: "s2",
    name: "Hyaluronic Acid Serum",
    brand: "HydraPlus",
    category: "serum",
    price: "$",
    rating: 4.3,
    keyIngredients: ["hyaluronic_acid"],
    ingredientsText: "Water, Hyaluronic Acid, Humectants...",
    claims: ["Hydration", "Plump look"],
    forConcerns: ["dryness", "dullness", "fine_lines"],
    avoidIf: [],
    howToUse: "AM/PM. Apply on slightly damp skin.",
  },
  {
    id: "s3",
    name: "Vitamin C Brightening Serum",
    brand: "BrightCo",
    category: "serum",
    price: "$$$",
    rating: 4.2,
    keyIngredients: ["vitamin_c", "licorice"],
    ingredientsText: "Vitamin C derivative, Licorice Extract...",
    claims: ["Glow", "Dark spots"],
    forConcerns: ["dark_spots", "dullness"],
    avoidIf: [],
    howToUse: "AM. Follow with SPF.",
  },
  {
    id: "s4",
    name: "Soothing Serum (Centella + Panthenol)",
    brand: "CalmLab",
    category: "serum",
    price: "$$",
    rating: 4.6,
    keyIngredients: ["centella", "panthenol"],
    ingredientsText: "Centella, Panthenol, Humectants...",
    claims: ["Calms", "Redness support"],
    forConcerns: ["redness", "sensitivity"],
    avoidIf: ["fragrance"],
    howToUse: "AM/PM. Great after actives.",
  },
  {
    id: "s5",
    name: "Peptide Serum",
    brand: "AgeDefy",
    category: "serum",
    price: "$$$",
    rating: 4.1,
    keyIngredients: ["peptides", "hyaluronic_acid"],
    ingredientsText: "Peptides, Hyaluronic Acid...",
    claims: ["Skin feel", "Fine lines support"],
    forConcerns: ["fine_lines", "dullness"],
    avoidIf: [],
    howToUse: "AM/PM. Before moisturizer.",
  },
  {
    id: "s6",
    name: "Tranexamic Acid Serum",
    brand: "ToneFix",
    category: "serum",
    price: "$$",
    rating: 4.3,
    keyIngredients: ["tranexamic_acid", "niacinamide"],
    ingredientsText: "Tranexamic Acid, Niacinamide...",
    claims: ["Dark spots", "Uneven tone"],
    forConcerns: ["dark_spots", "dullness"],
    avoidIf: [],
    howToUse: "PM (or AM). Use daily; SPF mandatory.",
  },
  {
    id: "s7",
    name: "Urea + HA Serum",
    brand: "SmoothCo",
    category: "serum",
    price: "$$",
    rating: 4.0,
    keyIngredients: ["urea", "hyaluronic_acid"],
    ingredientsText: "Urea, Hyaluronic Acid...",
    claims: ["Roughness", "Hydration"],
    forConcerns: ["texture", "dryness"],
    avoidIf: [],
    howToUse: "PM. Use 3–5x/week.",
  },
  {
    id: "s8",
    name: "Glow Booster Serum",
    brand: "GlowLab",
    category: "serum",
    price: "$$",
    rating: 4.2,
    keyIngredients: ["niacinamide", "vitamin_c"],
    ingredientsText: "Niacinamide, Vitamin C derivative...",
    claims: ["Glow", "Tone"],
    forConcerns: ["dullness", "dark_spots"],
    avoidIf: [],
    howToUse: "AM. Follow with SPF.",
  },

  // Treatments (6)
  {
    id: "tr1",
    name: "BHA 2% Exfoliant",
    brand: "ClearSkin",
    category: "treatment",
    price: "$$",
    rating: 4.5,
    keyIngredients: ["salicylic_acid"],
    ingredientsText: "Salicylic Acid 2%...",
    claims: ["Unclogs pores", "Helps acne"],
    forConcerns: ["acne", "pores", "oiliness", "texture"],
    avoidIf: [],
    howToUse: "PM 2–4x/week. Start slow.",
  },
  {
    id: "tr2",
    name: "Azelaic Acid 10% Treatment",
    brand: "CalmTone",
    category: "treatment",
    price: "$$",
    rating: 4.3,
    keyIngredients: ["azelaic_acid"],
    ingredientsText: "Azelaic Acid 10%...",
    claims: ["Redness", "Tone", "Acne marks"],
    forConcerns: ["redness", "acne", "dark_spots", "sensitivity"],
    avoidIf: [],
    howToUse: "PM. 3x/week → daily if tolerated.",
  },
  {
    id: "tr3",
    name: "Retinoid Starter (Low Strength)",
    brand: "AgeDefy",
    category: "treatment",
    price: "$$",
    rating: 4.2,
    keyIngredients: ["retinoid"],
    ingredientsText: "Retinoid (low strength), emollients...",
    claims: ["Texture", "Fine lines"],
    forConcerns: ["texture", "fine_lines", "dark_spots"],
    avoidIf: [],
    howToUse: "PM 2x/week → increase slowly. SPF daily.",
  },
  {
    id: "tr4",
    name: "Glycolic Night Exfoliant",
    brand: "SmoothCo",
    category: "treatment",
    price: "$$",
    rating: 4.1,
    keyIngredients: ["glycolic_acid"],
    ingredientsText: "Glycolic Acid...",
    claims: ["Glow", "Texture"],
    forConcerns: ["texture", "dullness", "dark_spots"],
    avoidIf: [],
    howToUse: "PM 1–3x/week. Avoid with retinoid same night at first.",
  },
  {
    id: "tr5",
    name: "Benzoyl Peroxide Spot Gel",
    brand: "ClearSkin",
    category: "treatment",
    price: "$",
    rating: 4.0,
    keyIngredients: ["benzoyl_peroxide"],
    ingredientsText: "Benzoyl Peroxide, gel base...",
    claims: ["Spot treatment"],
    forConcerns: ["acne"],
    avoidIf: [],
    howToUse: "PM on spots only. Can be drying.",
  },
  {
    id: "tr6",
    name: "Lactic Acid Gentle Peel",
    brand: "SmoothCo",
    category: "treatment",
    price: "$$",
    rating: 4.2,
    keyIngredients: ["lactic_acid"],
    ingredientsText: "Lactic Acid, humectants...",
    claims: ["Gentle smooth", "Glow"],
    forConcerns: ["texture", "dullness", "dryness"],
    avoidIf: [],
    howToUse: "PM 1–2x/week. Good for dry/rough skin.",
  },

  // Moisturizers (4)
  {
    id: "m1",
    name: "Barrier Moisturizer",
    brand: "Barrier+",
    category: "moisturizer",
    price: "$$",
    rating: 4.7,
    keyIngredients: ["ceramides", "squalane", "hyaluronic_acid"],
    ingredientsText: "Ceramides, Squalane, Hyaluronic Acid...",
    claims: ["Barrier repair", "Hydration"],
    forConcerns: ["dryness", "sensitivity", "texture", "redness"],
    avoidIf: [],
    howToUse: "AM/PM after serums/treatments.",
  },
  {
    id: "m2",
    name: "Gel Moisturizer (Oil-Free)",
    brand: "PoreFix",
    category: "moisturizer",
    price: "$",
    rating: 4.3,
    keyIngredients: ["niacinamide", "hyaluronic_acid"],
    ingredientsText: "Niacinamide, HA, gel base...",
    claims: ["Light hydration", "Oil control feel"],
    forConcerns: ["oiliness", "pores", "acne"],
    avoidIf: [],
    howToUse: "AM/PM. Great under SPF.",
  },
  {
    id: "m3",
    name: "Rich Cream (Dry Skin)",
    brand: "HydraPlus",
    category: "moisturizer",
    price: "$$",
    rating: 4.4,
    keyIngredients: ["ceramides", "squalane", "urea"],
    ingredientsText: "Ceramides, Squalane, Urea...",
    claims: ["Deep hydration", "Barrier comfort"],
    forConcerns: ["dryness", "fine_lines"],
    avoidIf: ["fragrance"],
    howToUse: "PM (or AM if very dry).",
  },
  {
    id: "m4",
    name: "Calming Moisturizer",
    brand: "CalmLab",
    category: "moisturizer",
    price: "$$",
    rating: 4.5,
    keyIngredients: ["centella", "panthenol", "ceramides"],
    ingredientsText: "Centella, Panthenol, Ceramides...",
    claims: ["Redness support", "Soothing"],
    forConcerns: ["redness", "sensitivity", "dryness"],
    avoidIf: ["fragrance"],
    howToUse: "AM/PM. Great after actives.",
  },

  // Sunscreens (2)
  {
    id: "sp1",
    name: "Mineral SPF 50",
    brand: "SunShield",
    category: "sunscreen",
    price: "$$",
    rating: 4.2,
    keyIngredients: ["mineral_spf", "niacinamide"],
    ingredientsText: "Zinc Oxide, Titanium Dioxide, ...",
    claims: ["Broad-spectrum SPF 50", "Sensitive-skin friendly"],
    forConcerns: ["dark_spots", "sensitivity", "redness", "dullness"],
    avoidIf: [],
    howToUse: "AM last step. Reapply outdoors.",
  },
  {
    id: "sp2",
    name: "Lightweight SPF 50 (Chemical)",
    brand: "SunShield",
    category: "sunscreen",
    price: "$$",
    rating: 4.3,
    keyIngredients: ["chemical_spf"],
    ingredientsText: "Modern UV filters...",
    claims: ["No white cast", "Light feel"],
    forConcerns: ["dark_spots", "oiliness", "pores"],
    avoidIf: [],
    howToUse: "AM last step. Reapply outdoors.",
  },
];
