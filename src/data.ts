import { Order, Message, Lead, Integration, CompetitorPrice, AIResponse, Product, CustomerProfile } from './types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'RF-8829-LX',
    customerName: 'Tunde Adeyemi',
    location: 'Lekki Phase 1',
    product: 'iPhone 15 Pro',
    value: 1450000,
    channel: 'WhatsApp',
    status: 'CONFIRMED',
    time: 'Today, 10:24 AM'
  },
  {
    id: 'RF-8830-LX',
    customerName: 'Amaka Okafor',
    location: 'Ikeja GRA',
    product: 'Sony WH-1000XM5',
    value: 385000,
    channel: 'Instagram',
    status: 'NEW',
    time: 'Today, 09:15 AM'
  },
  {
    id: 'RF-8831-LX',
    customerName: 'Chinedu Eze',
    location: 'Victoria Island',
    product: 'iPad Pro 12.9"',
    value: 950000,
    channel: 'Web',
    status: 'SHIPPED',
    time: 'Yesterday, 04:30 PM'
  },
  {
    id: 'RF-8832-LX',
    customerName: 'Folake Balogun',
    location: 'Abuja (Wuse II)',
    product: 'MacBook Air M3',
    value: 1400000,
    channel: 'WhatsApp',
    status: 'DELIVERED',
    time: 'Yesterday, 11:20 AM'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    channel: 'WhatsApp',
    sender: 'Emeka Nnamdi',
    text: "Hello, do you have the MacBook Air M3 in stock at your Ikeja store? Need 5 units for our new devs.",
    timestamp: '10:14 AM',
    isIncoming: true
  },
  {
    id: 'msg-2',
    channel: 'WhatsApp',
    sender: 'TechHub Concierge',
    text: "Hi Emeka! Yes, we have them. Let me check the current price list and get back to you with a special bulk offer.",
    timestamp: '10:15 AM',
    isIncoming: false
  },
  {
    id: 'msg-3',
    channel: 'Instagram',
    sender: 'Chioma Obi',
    text: "Hi! How much is the iPhone 15 Pro Max Natural Titanium?",
    timestamp: '09:45 AM',
    isIncoming: true
  },
  {
    id: 'msg-4',
    channel: 'Instagram',
    sender: 'TechHub Concierge',
    text: "Hello Chioma! The iPhone 15 Pro Max (256GB) is currently ₦1,250,000. We offer free same-day delivery to Lekki today.",
    timestamp: '09:47 AM',
    isIncoming: false
  },
  {
    id: 'msg-5',
    channel: 'WhatsApp',
    sender: 'Bisi Adeleke',
    text: "Hi, I left an iPad Pro in my cart. Is there any discount available?",
    timestamp: '08:30 AM',
    isIncoming: true
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Emeka Nnamdi',
    score: 'HOT',
    summary: 'Requested bulk invoice for 5x MacBook Air M3. Ready to purchase.',
    statusTag: 'High Intent'
  },
  {
    id: 'lead-2',
    name: 'Bisi Adeleke',
    score: 'HOT',
    summary: 'Left iPad Pro 12.9" in cart 2 hours ago. Initiated chat discount inquiry.',
    statusTag: 'Cart Abandoned'
  },
  {
    id: 'lead-3',
    name: 'Chioma Obi',
    score: 'WARM',
    summary: 'Inquired on Instagram about iPhone 15 Pro Max pricing and Lekki delivery.',
    statusTag: 'Price Inquiry'
  },
  {
    id: 'lead-4',
    name: 'Kunle Shonibare',
    score: 'WARM',
    summary: 'Looking for a premium corporate audio sound system setup for Victoria Island office.',
    statusTag: 'Sound Setup'
  },
  {
    id: 'lead-5',
    name: 'Kelechi Okafor',
    score: 'COLD',
    summary: 'Browsed MacBook accessories last week, did not click any checkout steps.',
    statusTag: 'Inactive Visitor'
  },
  {
    id: 'lead-6',
    name: 'Toyin Alao',
    score: 'COLD',
    summary: 'Visited contact page but exited immediately. Unsubscribed from newsletter.',
    statusTag: 'Bounce Lead'
  }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    name: 'WhatsApp Business',
    description: 'Automate customer notifications, order updates, and support directly via WhatsApp for your local clientele.',
    isConnected: true,
    iconType: 'whatsapp',
    tag: 'Automations Active'
  },
  {
    id: 'int-2',
    name: 'Instagram Shop',
    description: 'Sync your inventory directly to Instagram to enable seamless social commerce and reach more shoppers.',
    isConnected: false,
    iconType: 'instagram',
    tag: 'Catalog Connection'
  },
  {
    id: 'int-3',
    name: 'Retail POS Terminal',
    description: 'Connect physical storefront terminals in Ikeja and Victoria Island to centralize sales data in real-time.',
    isConnected: true,
    iconType: 'pos',
    tag: '3 Terminals Live'
  },
  {
    id: 'int-4',
    name: 'Google Calendar',
    description: 'Sync delivery schedules and vendor meetings. AI agent will automatically block out busy periods.',
    isConnected: false,
    iconType: 'gcal',
    tag: 'Calendar Block'
  },
  {
    id: 'int-5',
    name: 'Sage Accounting',
    description: 'Automatically push daily sales aggregates and vendor invoices to your Sage ledger for seamless reconciliation.',
    isConnected: false,
    iconType: 'sage',
    tag: 'Ledger Sync'
  },
  {
    id: 'int-6',
    name: 'QuickBooks',
    description: 'Sync expenses, payroll data, and inventory valuations to maintain accurate financial health reporting.',
    isConnected: false,
    iconType: 'quickbooks',
    tag: 'Tax Reporting'
  },
  {
    id: 'int-sheets',
    name: 'Google Sheets CRM Ledger',
    description: 'Automatically stream growth diagnostic submissions, prospect inquiries, and scheduled consultation slots directly into a designated Google Sheet.',
    isConnected: false,
    iconType: 'sheets',
    tag: 'Real-Time Sync'
  }
];

export const COMPETITOR_PRICES: CompetitorPrice[] = [
  {
    id: 'comp-1',
    product: 'iPhone 15 Pro',
    category: 'SMARTPHONES',
    imageAlt: 'iPhone 15 Pro titanium',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm1vI6517WYewxDTg2auSvpyj7xgsqzWKNP7LLb4Xc4Pr347NJwo8P7ug7_DRg1IM4EndhkYIkvgRdfD4sCi4VUvZ-3aGhvGuatRiNBiMTn6rIMTbiMDR0-v66QKZbOd8sxb0XBhkOch6UaDVGxl08Pih-4RdSc3WToKDilDoqQnJdpy4yDS6vKiIg7R5xcNRerBWHC5YEmVfJ3nG0TAov6D-uYJ7ev3YDwmkV2Yvaf-brC98U_bcLrtoyO_h9_TvVN70SEm50PPS',
    techHubPrice: 1550000,
    slotPrice: 1530000,
    pointekPrice: 1525000,
    jumiaPrice: 1560000,
    trend: 'down'
  },
  {
    id: 'comp-2',
    product: 'MacBook Air M3',
    category: 'LAPTOPS',
    imageAlt: 'MacBook Air M3 space gray',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wLJrTOOXpIbR85h_Vq3T4uhObAdOUoK4B0c4_JTsTD84DkpLOIMJGHcKfXw72n14XI0nnEu_UStQPjDrGuMBauLRgB7u3KoTKTZRnOGyI0Xw5NOuGbQF4iEHxzYWciHy_Pus60DzmUCPBf6Lfjdw2_RjVzjQcvX-chCsBGDH3bxZaEb6XPXAWVcLO0v89D_WWMPjvUtoNwU4iU844gtLIH22S8SPfhamB0N-eZO7zrlFTBJHDgGTPcXZVoR7e0wTIWURlJzYG8St',
    techHubPrice: 1850000,
    slotPrice: 1875000,
    pointekPrice: 1850000,
    jumiaPrice: 1890000,
    trend: 'up'
  },
  {
    id: 'comp-3',
    product: 'Galaxy S24 Ultra',
    category: 'SMARTPHONES',
    imageAlt: 'Samsung Galaxy S24 Ultra',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-CKG0sXaXLqs8s4uiELYGLHrF5ViZzsn2Pk2UwOhGrTJli26wlM7KvbEiRjpVo79OCZqG9FF-XQEcJgvz7zK2LklI1MCErEAm-4_o00kb_2jB278tlucXO6RiH2KovUV0zw2Kvj_ImVNeDgPFVYAReJeZSuUsRz73DkNTpaP2acgLWF8ZeTLp1jRusN25YvkYMp-GUD7PxJ3XUBL00msWXsL4TRNCgTZCEXxmvS3M_kP4L_tkRuVSp88738zzeS5iosdlCvfZBkA_',
    techHubPrice: 1620000,
    slotPrice: 1610000,
    pointekPrice: 1620000,
    jumiaPrice: 1595000,
    trend: 'down'
  },
  {
    id: 'comp-4',
    product: 'Sony WH-1000XM5',
    category: 'AUDIO',
    imageAlt: 'Sony WH-1000XM5 headphones',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSo-qg0LALUphRXdRe-bsRaIds-8jQj-MtVAuAPXIh2vKmm2KTOZc0kcUFMokT3itbLfn_H83Zm1DCAQeGC7sBhq2ulSwQpE4WASIP9cTfyH5JdtxXt-YdCpKNg4TAEOFtlf126jAss1dSqAEp-2ma23R5V8jFC7NdXih_aCKvg17lBr8q61sx33ZWe_-G_ZJ7GYhINBcaiSCDY8awcEq6WHjFdhugGI_uh7m8civA-YjBj-gl4aLmzyfwDmJ-gLjsKUffpFaM9Yo',
    techHubPrice: 480000,
    slotPrice: 495000,
    pointekPrice: 470000,
    jumiaPrice: 480000,
    trend: 'flat'
  }
];

export const AI_QA_PAIRS: AIResponse[] = [
  {
    keywords: ['macbook', 'laptop', 'm3', 'apple'],
    response: "Our MacBook Air M3 stock is healthy at Ikeja. Current retail price is ₦1,400,000. Demand is trending up 24% in the Ikeja distribution network today."
  },
  {
    keywords: ['iphone', 'phone', '15', 'mobile'],
    response: "iPhone 15 Pro is currently priced at ₦1,450,000 for 256GB. Competing outlets Slot and Pointek are retailing at ₦1,530,000 and ₦1,525,000 respectively, giving TechHub a solid 5% price advantage."
  },
  {
    keywords: ['discount', 'bulk', 'wholesale', 'reduce'],
    response: "For corporate bulk orders (above 5 units), our retail operating system can apply an automated 5% volume discount, pushing the average unit price of a MacBook Air down by ₦70,000."
  },
  {
    keywords: ['delivery', 'shipping', 'lagos', 'send'],
    response: "We offer immediate, automated dispatch and same-day express delivery across Victoria Island, Lekki, and Ikeja for all orders confirmed before 2:00 PM."
  },
  {
    keywords: ['pointek', 'slot', 'competitor', 'jumia'],
    response: "Pointek and Slot recently adjusted prices downward on select mobile models. However, our margins remain optimized with Jumia selling at a premium (+₦40,000 on laptops)."
  },
  {
    keywords: ['revenue', 'sales', 'naira', 'performance'],
    response: "Today's dynamic sales volume stands at ₦4.2M (+12.5% vs yesterday). Peak pipeline volume reached ₦42.8M during the mid-month promotional push."
  },
  {
    keywords: ['stock', 'inventory', 'restock', 'headphones'],
    response: "AI predictive analysis reports an upcoming spike in audio demand for the festive season. I suggest increasing Sony WH-1000XM5 headphone stock by 50 units immediately to avoid stockout."
  },
  {
    keywords: ['help', 'what', 'can', 'do'],
    response: "I can check real-time Lagos inventory, calculate bulk discounts, compare competitor pricing feeds (Slot, Pointek, Jumia), check order delivery statuses, and drafts automatic WhatsApp replies."
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: "Welcome, Operator! I'm your digital concierge for RetailFlow OS. Ask me anything about stock, pricing metrics, or competitor pricing in Lagos."
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro',
    category: 'SMARTPHONES',
    price: 1450000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm1vI6517WYewxDTg2auSvpyj7xgsqzWKNP7LLb4Xc4Pr347NJwo8P7ug7_DRg1IM4EndhkYIkvgRdfD4sCi4VUvZ-3aGhvGuatRiNBiMTn6rIMTbiMDR0-v66QKZbOd8sxb0XBhkOch6UaDVGxl08Pih-4RdSc3WToKDilDoqQnJdpy4yDS6vKiIg7R5xcNRerBWHC5YEmVfJ3nG0TAov6D-uYJ7ev3YDwmkV2Yvaf-brC98U_bcLrtoyO_h9_TvVN70SEm50PPS',
    imageAlt: 'iPhone 15 Pro Titanium',
    specs: ['Super Retina XDR OLED', 'A17 Pro Chip', '48MP Main Camera', 'USB-C Support'],
    stock: 12,
    rating: 4.8,
    description: 'The ultimate professional titanium design, featuring the groundbreaking A17 Pro chip and a customizable Action button.'
  },
  {
    id: 'prod-2',
    name: 'MacBook Air M3',
    category: 'LAPTOPS',
    price: 1400000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wLJrTOOXpIbR85h_Vq3T4uhObAdOUoK4B0c4_JTsTD84DkpLOIMJGHcKfXw72n14XI0nnEu_UStQPjDrGuMBauLRgB7u3KoTKTZRnOGyI0Xw5NOuGbQF4iEHxzYWciHy_Pus60DzmUCPBf6Lfjdw2_RjVzjQcvX-chCsBGDH3bxZaEb6XPXAWVcLO0v89D_WWMPjvUtoNwU4iU844gtLIH22S8SPfhamB0N-eZO7zrlFTBJHDgGTPcXZVoR7e0wTIWURlJzYG8St',
    imageAlt: 'MacBook Air M3 Space Gray',
    specs: ['13.6-inch Liquid Retina', 'Apple M3 Chip', '8GB Unified Memory', '256GB SSD Storage'],
    stock: 8,
    rating: 4.9,
    description: 'Blazing-fast M3 chip performance inside an incredibly thin, light, and fanless aluminum enclosure.'
  },
  {
    id: 'prod-3',
    name: 'Galaxy S24 Ultra',
    category: 'SMARTPHONES',
    price: 1620000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-CKG0sXaXLqs8s4uiELYGLHrF5ViZzsn2Pk2UwOhGrTJli26wlM7KvbEiRjpVo79OCZqG9FF-XQEcJgvz7zK2LklI1MCErEAm-4_o00kb_2jB278tlucXO6RiH2KovUV0zw2Kvj_ImVNeDgPFVYAReJeZSuUsRz73DkNTpaP2acgLWF8ZeTLp1jRusN25YvkYMp-GUD7PxJ3XUBL00msWXsL4TRNCgTZCEXxmvS3M_kP4L_tkRuVSp88738zzeS5iosdlCvfZBkA_',
    imageAlt: 'Samsung Galaxy S24 Ultra',
    specs: ['Dynamic AMOLED 2X 120Hz', 'Snapdragon 8 Gen 3', '200MP Quad Camera', 'Built-in S Pen'],
    stock: 15,
    rating: 4.7,
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.'
  },
  {
    id: 'prod-4',
    name: 'Sony WH-1000XM5',
    category: 'AUDIO',
    price: 385000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSo-qg0LALUphRXdRe-bsRaIds-8jQj-MtVAuAPXIh2vKmm2KTOZc0kcUFMokT3itbLfn_H83Zm1DCAQeGC7sBhq2ulSwQpE4WASIP9cTfyH5JdtxXt-YdCpKNg4TAEOFtlf126jAss1dSqAEp-2ma23R5V8jFC7NdXih_aCKvg17lBr8q61sx33ZWe_-G_ZJ7GYhINBcaiSCDY8awcEq6WHjFdhugGI_uh7m8civA-YjBj-gl4aLmzyfwDmJ-gLjsKUffpFaM9Yo',
    imageAlt: 'Sony WH-1000XM5 Headphones',
    specs: ['Industry-Leading ANC', 'Auto NC Optimizer', 'Up to 30hr Battery', 'Crystal Clear Calls'],
    stock: 20,
    rating: 4.9,
    description: 'Industry-leading noise cancellation headset with dual processors and spectacular sound quality.'
  },
  {
    id: 'prod-5',
    name: 'iPad Pro 12.9"',
    category: 'LAPTOPS',
    price: 950000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wLJrTOOXpIbR85h_Vq3T4uhObAdOUoK4B0c4_JTsTD84DkpLOIMJGHcKfXw72n14XI0nnEu_UStQPjDrGuMBauLRgB7u3KoTKTZRnOGyI0Xw5NOuGbQF4iEHxzYWciHy_Pus60DzmUCPBf6Lfjdw2_RjVzjQcvX-chCsBGDH3bxZaEb6XPXAWVcLO0v89D_WWMPjvUtoNwU4iU844gtLIH22S8SPfhamB0N-eZO7zrlFTBJHDgGTPcXZVoR7e0wTIWURlJzYG8St',
    imageAlt: 'iPad Pro 12.9 Inch',
    specs: ['Liquid Retina XDR Display', 'Apple M2 Chip', 'Pro Camera System', 'Thunderbolt Port'],
    stock: 10,
    rating: 4.8,
    description: 'Ultimate iPad experience with spectacular high-contrast screen and advanced M2 system processing power.'
  },
  {
    id: 'prod-6',
    name: 'iPhone 15 Pro Max',
    category: 'SMARTPHONES',
    price: 1250000,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm1vI6517WYewxDTg2auSvpyj7xgsqzWKNP7LLb4Xc4Pr347NJwo8P7ug7_DRg1IM4EndhkYIkvgRdfD4sCi4VUvZ-3aGhvGuatRiNBiMTn6rIMTbiMDR0-v66QKZbOd8sxb0XBhkOch6UaDVGxl08Pih-4RdSc3WToKDilDoqQnJdpy4yDS6vKiIg7R5xcNRerBWHC5YEmVfJ3nG0TAov6D-uYJ7ev3YDwmkV2Yvaf-brC98U_bcLrtoyO_h9_TvVN70SEm50PPS',
    imageAlt: 'iPhone 15 Pro Max Titanium',
    specs: ['6.7-inch OLED Screen', '5x Telephoto Zoom', 'A17 Pro GPU', 'Titanium Chassis'],
    stock: 6,
    rating: 4.9,
    description: 'The largest and most advanced iPhone, offering superior 5x physical focal magnification and high titanium grade casing.'
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Tunde Adeyemi',
    email: 'tunde.ade@gmail.com',
    phone: '+234 803 123 4567',
    location: 'Lekki Phase 1',
    totalSpent: 1450000,
    orderCount: 1,
    joinDate: '2026-01-10',
    sentiment: 'Satisfied',
    lastActive: 'Today, 10:24 AM'
  },
  {
    id: 'cust-2',
    name: 'Amaka Okafor',
    email: 'amaka.okafor@outlook.com',
    phone: '+234 812 987 6543',
    location: 'Ikeja GRA',
    totalSpent: 385000,
    orderCount: 1,
    joinDate: '2026-02-15',
    sentiment: 'Neutral',
    lastActive: 'Today, 09:15 AM'
  },
  {
    id: 'cust-3',
    name: 'Chinedu Eze',
    email: 'chinedu.eze@eze-inc.com',
    phone: '+234 905 444 3322',
    location: 'Victoria Island',
    totalSpent: 950000,
    orderCount: 1,
    joinDate: '2025-11-04',
    sentiment: 'Satisfied',
    lastActive: 'Yesterday, 04:30 PM'
  },
  {
    id: 'cust-4',
    name: 'Folake Balogun',
    email: 'folake_b@yahoo.com',
    phone: '+234 708 222 1100',
    location: 'Abuja (Wuse II)',
    totalSpent: 1400000,
    orderCount: 2,
    joinDate: '2025-08-20',
    sentiment: 'Satisfied',
    lastActive: 'Yesterday, 11:20 AM'
  },
  {
    id: 'cust-5',
    name: 'Emeka Nnamdi',
    email: 'emeka.n@techdev.ng',
    phone: '+234 802 555 7788',
    location: 'Ikeja',
    totalSpent: 0,
    orderCount: 0,
    joinDate: '2026-03-01',
    sentiment: 'Neutral',
    lastActive: 'Today, 10:14 AM'
  },
  {
    id: 'cust-6',
    name: 'Bisi Adeleke',
    email: 'bisi_adeleke@gmail.com',
    phone: '+234 815 666 9900',
    location: 'Lagos Island',
    totalSpent: 0,
    orderCount: 0,
    joinDate: '2026-02-28',
    sentiment: 'At Risk',
    lastActive: 'Today, 08:30 AM'
  }
];
