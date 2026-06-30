// High-quality mock articles to ensure the application works immediately
// and serves as a reliable fallback during CORS errors or when no API Key is provided.
const MOCK_NEWS = {
  general: [
    {
      source: { name: "Apex Global" },
      title: "The Future of Smart Cities: Integrating AI in Urban Logistics",
      description: "How metropolitan hubs are leveraging advanced neural networks and connected IoT infrastructure to optimize public transport, reduce carbon emissions, and streamline waste management.",
      url: "https://example.com/smart-cities",
      urlToImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T10:15:00Z"
    },
    {
      source: { name: "Daily Pulse" },
      title: "Global Renewable Energy Generation Reaches Historic Milestone",
      description: "In a landmark achievement, solar and wind power accounted for over 45% of the global electricity generation during the last quarter, signaling an accelerated shift away from fossil fuels.",
      url: "https://example.com/renewable-energy",
      urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T08:30:00Z"
    },
    {
      source: { name: "Chronicle Network" },
      title: "Deep Space Telescope Uncovers Water Vapor on Nearby Exoplanet",
      description: "Astronomers utilizing the next-generation spatial observatory have detected robust signatures of water vapor in the atmosphere of a super-Earth orbiting a neighboring red dwarf.",
      url: "https://example.com/exoplanet-water",
      urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T21:45:00Z"
    }
  ],
  technology: [
    {
      source: { name: "TechCrunch" },
      title: "Generative AI Codebots Enter the Next Paradigm of Self-Correction",
      description: "Silicon Valley startups are demonstrating AI agents capable of diagnosing their own logic flaws, writing regression tests, and refactoring performance bottlenecks with zero human intervention.",
      url: "https://example.com/ai-codebots",
      urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T12:00:00Z"
    },
    {
      source: { name: "Wired" },
      title: "Solid-State Battery Tech Prepares for Commercial Electric Vehicle Trials",
      description: "A leading battery consortium announces automotive-grade solid-state cells that promise double the energy density of traditional lithium-ion packs and 10-minute fast charging capabilities.",
      url: "https://example.com/solid-state-batteries",
      urlToImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T09:10:00Z"
    },
    {
      source: { name: "Gizmodo" },
      title: "Augmented Reality Eyewear Finally Achieves Form-Factor Breakthrough",
      description: "New light-guided waveguide technology enables high-definition AR projections inside glasses that weigh under 60 grams, paving the way for mainstream consumer adoption.",
      url: "https://example.com/ar-glasses-breakthrough",
      urlToImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T05:00:00Z"
    }
  ],
  business: [
    {
      source: { name: "Bloomberg" },
      title: "Interest Rate Cuts Trigger Surge in Venture Funding and Tech M&A",
      description: "Central banks worldwide have relaxed interest rates, prompting immediate capital deployment into early-stage deep-tech, biotechnology, and clean energy enterprises.",
      url: "https://example.com/venture-funding-surge",
      urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T11:20:00Z"
    },
    {
      source: { name: "The Wall Street Journal" },
      title: "Supply Chain Reshoring Reshapes Global Manufacturing Corridors",
      description: "Multinational corporations are accelerating the construction of high-tech automated fabrication facilities in North America and Europe to insulate themselves from geopolitical friction.",
      url: "https://example.com/supply-chain-reshoring",
      urlToImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T07:45:00Z"
    },
    {
      source: { name: "Financial Times" },
      title: "The Rise of Decentralized Autonomous Organizations in Micro-Finance",
      description: "DAOs are capturing market share in emerging markets, allowing local farming collectives to secure transparent, low-interest micro-loans directly from global pools without intermediaries.",
      url: "https://example.com/daos-micro-finance",
      urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T18:30:00Z"
    }
  ],
  sports: [
    {
      source: { name: "ESPN" },
      title: "Underdog Squad Clinches Historic Victory in World Football Finals",
      description: "Against all odds, the lowest-seeded team in the tournament emerged victorious after a dramatic penalty shootout, sparking massive celebrations across their home nation.",
      url: "https://example.com/football-underdogs",
      urlToImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T09:40:00Z"
    },
    {
      source: { name: "Athletic Journal" },
      title: "Next-Gen Bio-Sensors Revolutionize Athletic Training and Recovery",
      description: "Elite sports organizations are deploying micro-implants and smart patches to measure real-time lactic acid buildup and muscular stress, successfully reducing injuries by 40%.",
      url: "https://example.com/athletic-recovery-tech",
      urlToImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T06:15:00Z"
    },
    {
      source: { name: "Sports Weekly" },
      title: "Championship Runner Breaks 100m Record in Eco-Friendly Tracks",
      description: "Equipped with custom 3D-printed biopolymer running spikes, the champion sprinter shattered the long-standing record on a track constructed entirely from recycled marine plastic.",
      url: "https://example.com/sprinter-record",
      urlToImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T15:20:00Z"
    }
  ],
  health: [
    {
      source: { name: "Medical News Today" },
      title: "CRISPR Therapy Successfully Halts Hereditary Vision Loss in Trials",
      description: "Clinical trials yield unprecedented success as direct targeted gene editing corrects a mutation responsible for progressive retinal degeneration in 95% of adult study participants.",
      url: "https://example.com/crispr-vision-therapy",
      urlToImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T10:05:00Z"
    },
    {
      source: { name: "Science Daily" },
      title: "Neuromorphic Brain Stimulation Found to Enhance Memory Retention",
      description: "Non-invasive brain stimulation mimicking the natural firing patterns of the hippocampus during sleep boosts memory consolidation in patients suffering early stages of dementia.",
      url: "https://example.com/brain-stimulation-memory",
      urlToImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T07:15:00Z"
    },
    {
      source: { name: "Wellness Today" },
      title: "The Science-Backed Benefits of Circadian Lighting in Workplaces",
      description: "New studies demonstrate that workspaces with dynamic lighting systems synced with natural solar cycles improve employee focus, reduce eye strain, and boost overall sleep quality.",
      url: "https://example.com/circadian-lighting-study",
      urlToImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T14:40:00Z"
    }
  ],
  science: [
    {
      source: { name: "Nature Science" },
      title: "Room-Temperature Superconductivity Achieved with Novel Metal Alloy",
      description: "Physicists have developed a complex metallic compound that exhibits zero electrical resistance at temperatures up to 21°C, marking a historic breakthrough for clean grids and quantum computing.",
      url: "https://example.com/room-temp-superconductor",
      urlToImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T11:45:00Z"
    },
    {
      source: { name: "Scientific American" },
      title: "Deep-Sea Expedition Discovers 80 Previously Unknown Marine Species",
      description: "A crew of oceanic explorers operating robotic submersibles inside the Mariana Trench returned with biological specimens of deep-sea organisms that defy typical evolutionary categories.",
      url: "https://example.com/mariana-trench-expedition",
      urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T08:00:00Z"
    },
    {
      source: { name: "Physics World" },
      title: "Quantum Entanglement Linked with Microscopic Wormholes in New Model",
      description: "Theoretical physicists propose a unifying framework suggesting that Einstein-Podolsky-Rosen paradox pairs are physically connected by minuscule spatial throat shortcuts.",
      url: "https://example.com/quantum-wormholes",
      urlToImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T20:10:00Z"
    }
  ],
  entertainment: [
    {
      source: { name: "Hollywood Reporter" },
      title: "Indie Sci-Fi Epic Sweeps Major Accolades at the Cannes Film Festival",
      description: "A crowdfunded, micro-budget sci-fi feature leveraging real physics and practical effects won the top prize, stunning the traditional studio giants and redefining filmmaking economies.",
      url: "https://example.com/indie-scifi-cannes",
      urlToImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T10:30:00Z"
    },
    {
      source: { name: "Variety" },
      title: "Live Virtual Reality Concert Series Draws Record Global Audience",
      description: "Using interactive volumetric stage captures, the virtual concert set a record with over 15 million concurrent participants experiencing the immersive show via headset devices.",
      url: "https://example.com/vr-concert-record",
      urlToImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-30T06:55:00Z"
    },
    {
      source: { name: "Billboard" },
      title: "Generational Shift: Analogue Vinyl Sales Overtake Digital Downloads",
      description: "For the first time in three decades, standard physical vinyl pressings generated higher revenue than direct digital album purchases, signaling a strong consumer preference for physical artifacts.",
      url: "https://example.com/vinyl-sales-boom",
      urlToImage: "https://images.unsplash.com/photo-1539628399213-d6aa89c93074?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-06-29T16:15:00Z"
    }
  ]
};

// Search helper function inside mock data to simulate search filtering
function searchMockNews(query) {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return MOCK_NEWS.general;
  }
  
  const allArticles = Object.values(MOCK_NEWS).flat();
  
  // Basic filtering based on title and description matching the query keywords
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(normalizedQuery) || 
    article.description.toLowerCase().includes(normalizedQuery)
  );
}

// Export object for global browser access
window.MOCK_NEWS = MOCK_NEWS;
window.searchMockNews = searchMockNews;
