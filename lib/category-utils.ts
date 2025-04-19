// Map of similar categories to normalized versions
const categoryMap: Record<string, string> = {
  // Technology
  tech: "Technology",
  technology: "Technology",
  software: "Technology",
  ai: "AI & Machine Learning",
  "artificial intelligence": "AI & Machine Learning",
  "machine learning": "AI & Machine Learning",

  // Business
  business: "Business",
  entrepreneurship: "Entrepreneurship",
  startup: "Startups",
  startups: "Startups",

  // Marketing
  marketing: "Marketing",
  "digital marketing": "Marketing",
  "social media": "Social Media",
  "social media marketing": "Social Media",

  // Finance
  finance: "Finance",
  investing: "Investing",
  investment: "Investing",
  crypto: "Cryptocurrency",
  cryptocurrency: "Cryptocurrency",
  blockchain: "Cryptocurrency",

  // Health
  health: "Health & Wellness",
  wellness: "Health & Wellness",
  fitness: "Health & Wellness",

  // Education
  education: "Education",
  learning: "Education",
  "e-learning": "Education",
  elearning: "Education",

  // E-commerce
  ecommerce: "E-commerce",
  "e-commerce": "E-commerce",
  retail: "E-commerce",

  // SaaS
  saas: "SaaS",
  "software as a service": "SaaS",

  // Content Creation
  content: "Content Creation",
  "content creation": "Content Creation",
  "content marketing": "Content Creation",

  // Real Estate
  "real estate": "Real Estate",
  property: "Real Estate",

  // Other
  other: "Other",
  misc: "Other",
  miscellaneous: "Other",
}

// Normalize a category string
export function normalizeCategory(category: string): string {
  if (!category) return "Uncategorized"

  const lowerCategory = category.toLowerCase().trim()

  // Check for exact matches
  if (categoryMap[lowerCategory]) {
    return categoryMap[lowerCategory]
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerCategory.includes(key)) {
      return value
    }
  }

  // If no match found, capitalize the first letter of each word
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
