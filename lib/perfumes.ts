import type { Perfume } from "./types";

export const PERFUMES: Perfume[] = [
  {
    slug: "etienne",
    name: "Etienne",
    tagline: "The signature.",
    description:
      "A sculpted composition of warm amber, polished woods and a whisper of leather. Etienne is the house in a bottle — confident, refined, unmistakable.",
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Iris", "Cashmeran"],
      base: ["Amber", "Sandalwood", "Soft Leather"],
    },
    mood: ["Confident", "Refined", "Timeless"],
    traits: { warm: 3, refined: 3, sensual: 2 },
    shopUrl: "https://etienneperfumes.com/products/etienne",
    accent: "from-cocoa via-warm to-gold",
  },
  {
    slug: "after-hours",
    name: "After Hours",
    tagline: "When the lights go low.",
    description:
      "Smoked vanilla, dark rose and a velvet trail of oud. After Hours is the perfume of slow conversations and unhurried nights.",
    notes: {
      top: ["Black Plum", "Saffron"],
      heart: ["Damask Rose", "Tobacco"],
      base: ["Oud", "Vanilla", "Benzoin"],
    },
    mood: ["Sensual", "Magnetic", "Nocturnal"],
    traits: { sensual: 3, warm: 2, refined: 1 },
    shopUrl: "https://etienneperfumes.com/products/after-hours",
    accent: "from-ink via-cocoa to-warm",
  },
  {
    slug: "river",
    name: "River",
    tagline: "Cool, clear, alive.",
    description:
      "A green-water accord of fig leaf, mint and white musk that moves the way light moves on a slow river — calm, glittering, kinetic.",
    notes: {
      top: ["Mint", "Lemon Zest"],
      heart: ["Fig Leaf", "Watercress"],
      base: ["White Musk", "Vetiver"],
    },
    mood: ["Fresh", "Energetic", "Optimistic"],
    traits: { fresh: 3, clean: 2, curious: 2 },
    shopUrl: "https://etienneperfumes.com/products/river",
    accent: "from-sand via-beige to-cream",
  },
  {
    slug: "tidal",
    name: "Tidal",
    tagline: "Salt, skin, sun.",
    description:
      "An oceanic eau with sea salt, neroli and warm driftwood — a perfume that remembers long afternoons and the quiet pull of the sea.",
    notes: {
      top: ["Sea Salt", "Neroli"],
      heart: ["Coastal Iris", "Seaweed Absolute"],
      base: ["Driftwood", "Ambergris"],
    },
    mood: ["Free-spirited", "Open", "Sun-warmed"],
    traits: { free: 3, fresh: 2, warm: 1 },
    shopUrl: "https://etienneperfumes.com/products/tidal",
    accent: "from-beige via-sand to-warm",
  },
  {
    slug: "wild-cotton",
    name: "Wild Cotton",
    tagline: "Soft, but never quiet.",
    description:
      "Powdery musk, white tea and a halo of cotton blossom. Wild Cotton is the perfume of folded sheets, slow Sundays and gentle confidence.",
    notes: {
      top: ["White Tea", "Pear Blossom"],
      heart: ["Cotton Flower", "Iris Butter"],
      base: ["Cashmere Musk", "Blonde Woods"],
    },
    mood: ["Soft", "Tender", "Reassuring"],
    traits: { soft: 3, clean: 2, refined: 1 },
    shopUrl: "https://etienneperfumes.com/products/wild-cotton",
    accent: "from-cream via-beige to-sand",
  },
  {
    slug: "linen",
    name: "Linen",
    tagline: "Pressed, polished, present.",
    description:
      "Crisp aldehydes, white florals and a clean wood base. Linen is the scent of a perfectly tailored white shirt — elegant, exact, effortless.",
    notes: {
      top: ["Aldehydes", "Bergamot"],
      heart: ["Lily of the Valley", "White Tea"],
      base: ["Cedar", "Soft Musk"],
    },
    mood: ["Clean", "Polished", "Composed"],
    traits: { clean: 3, refined: 2, soft: 1 },
    shopUrl: "https://etienneperfumes.com/products/linen",
    accent: "from-cream via-cream to-beige",
  },
  {
    slug: "discovery-kit",
    name: "Discovery Kit",
    tagline: "Begin with all of us.",
    description:
      "Six miniatures of the house, presented in a felt-lined case. The Discovery Kit is for the curious — those still listening for their signature.",
    notes: {
      top: ["The full house in miniature"],
      heart: ["Six 2ml flacons"],
      base: ["Hand-finished case"],
    },
    mood: ["Curious", "Open", "Exploring"],
    traits: { curious: 3, fresh: 1, soft: 1 },
    shopUrl: "https://etienneperfumes.com/products/discovery-kit",
    accent: "from-goldlight via-gold to-warm",
  },
];

export const PERFUME_BY_SLUG = Object.fromEntries(
  PERFUMES.map((p) => [p.slug, p])
);
