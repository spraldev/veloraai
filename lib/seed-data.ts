export const classes = [
  {
    id: "ap-bio",
    name: "AP Biology",
    teacher: "Dr. Martinez",
    color: "#37E08D",
    progress: 68,
  },
  {
    id: "ap-calc",
    name: "AP Calculus AB",
    teacher: "Mr. Thompson",
    color: "#FFC857",
    progress: 82,
  },
  {
    id: "english-lit",
    name: "English Lit",
    teacher: "Ms. Johnson",
    color: "#FF4D57",
    progress: 75,
  },
  {
    id: "us-history",
    name: "US History",
    teacher: "Mr. Davis",
    color: "#EB1F3A",
    progress: 91,
  },
]

export const upcomingAssignments = [
  {
    id: "1",
    title: "AP Bio Quiz — Cellular Respiration",
    classId: "ap-bio",
    className: "AP Biology",
    dueDate: "Tomorrow",
    weight: "High",
    isOverdue: false,
  },
  {
    id: "2",
    title: "AP Calc Quiz — Derivatives",
    classId: "ap-calc",
    className: "AP Calculus AB",
    dueDate: "Tomorrow",
    weight: "High",
    isOverdue: false,
  },
  {
    id: "3",
    title: "English Reading — Ch. 12",
    classId: "english-lit",
    className: "English Lit",
    dueDate: "Thu",
    weight: "Med",
    isOverdue: false,
  },
  {
    id: "4",
    title: "History Essay Draft",
    classId: "us-history",
    className: "US History",
    dueDate: "Fri",
    weight: "High",
    isOverdue: false,
  },
  {
    id: "5",
    title: "Bio Lab Report",
    classId: "ap-bio",
    className: "AP Biology",
    dueDate: "Mon",
    weight: "Med",
    isOverdue: false,
  },
]

export const recentNotes = [
  {
    id: "1",
    title: "Cellular Respiration Overview",
    classId: "ap-bio",
    className: "AP Biology",
    timestamp: "2 hours ago",
    preview: "Key stages: Glycolysis, Krebs Cycle, Electron Transport Chain...",
  },
  {
    id: "2",
    title: "Derivative Rules & Applications",
    classId: "ap-calc",
    className: "AP Calculus AB",
    timestamp: "Yesterday",
    preview: "Power rule, product rule, quotient rule, chain rule...",
  },
  {
    id: "3",
    title: "Symbolism in Chapter 11",
    classId: "english-lit",
    className: "English Lit",
    timestamp: "2 days ago",
    preview: "The recurring motif of water represents transformation...",
  },
]

export const studyBrief = {
  summary:
    "AP Bio & Calc quiz tomorrow → 60m Bio retrieval, 45m Calc mixed set; English reading scheduled for tomorrow",
  blocks: [
    {
      id: "1",
      subject: "AP Biology",
      duration: "60 min",
      method: "Retrieval",
      topic: "Cellular Respiration",
    },
    {
      id: "2",
      subject: "AP Calculus AB",
      duration: "45 min",
      method: "Mixed Practice",
      topic: "Derivatives",
    },
    {
      id: "3",
      subject: "English Lit",
      duration: "30 min",
      method: "Reading",
      topic: "Chapter 12",
    },
  ],
  totalTime: "2h 15m",
}
