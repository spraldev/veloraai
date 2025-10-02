export const classMaterials = [
  {
    id: "1",
    type: "audio",
    title: "Lecture: Cellular Respiration Overview",
    source: "Class Recording",
    date: "2 hours ago",
    duration: "45 min",
  },
  {
    id: "2",
    type: "photo",
    title: "Whiteboard Notes - Krebs Cycle",
    source: "Photo Scan",
    date: "Yesterday",
  },
  {
    id: "3",
    type: "link",
    title: "Khan Academy: Glycolysis",
    source: "YouTube",
    date: "2 days ago",
    duration: "12 min",
  },
  {
    id: "4",
    type: "file",
    title: "Chapter 9 Study Guide.pdf",
    source: "Upload",
    date: "3 days ago",
  },
]

export const classNotes = {
  title: "Cellular Respiration Overview",
  timestamp: "Generated 2 hours ago",
  outline: [
    {
      id: "1",
      title: "Overview",
      content: "Cellular respiration is the process by which cells convert glucose into ATP (energy).",
      timestamp: "0:00",
    },
    {
      id: "2",
      title: "Three Main Stages",
      content: "Glycolysis, Krebs Cycle (Citric Acid Cycle), and Electron Transport Chain.",
      timestamp: "2:15",
      keyTerms: ["Glycolysis", "Krebs Cycle", "Electron Transport Chain"],
    },
    {
      id: "3",
      title: "Glycolysis",
      content: "Occurs in cytoplasm. Breaks down glucose (6C) into 2 pyruvate molecules (3C). Net gain: 2 ATP, 2 NADH.",
      timestamp: "5:30",
      formula: "Glucose + 2 NAD+ + 2 ADP + 2 Pi → 2 Pyruvate + 2 NADH + 2 ATP + 2 H2O",
    },
    {
      id: "4",
      title: "Krebs Cycle",
      content:
        "Occurs in mitochondrial matrix. Pyruvate is converted to Acetyl-CoA, which enters the cycle. Produces CO2, NADH, FADH2, and ATP.",
      timestamp: "12:45",
      keyTerms: ["Acetyl-CoA", "NADH", "FADH2"],
    },
    {
      id: "5",
      title: "Electron Transport Chain",
      content:
        "Occurs in inner mitochondrial membrane. NADH and FADH2 donate electrons. Creates proton gradient that drives ATP synthesis. Produces ~34 ATP.",
      timestamp: "18:20",
      keyTerms: ["Proton gradient", "ATP synthase", "Oxidative phosphorylation"],
    },
  ],
}

export const practiceQuizzes = [
  {
    id: "1",
    title: "Cellular Respiration - Mixed Practice",
    difficulty: "Adaptive",
    questions: 20,
    timeEstimate: "15 min",
    progress: 0,
    lastAttempt: null,
  },
  {
    id: "2",
    title: "Glycolysis Deep Dive",
    difficulty: "Hard",
    questions: 10,
    timeEstimate: "8 min",
    progress: 60,
    lastAttempt: "Yesterday",
  },
  {
    id: "3",
    title: "Quick Retrieval - Key Terms",
    difficulty: "Easy",
    questions: 15,
    timeEstimate: "5 min",
    progress: 100,
    lastAttempt: "2 days ago",
  },
]
