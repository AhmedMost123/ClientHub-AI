export const clientProjects = [
  {
    id: "1",
    name: "Company Website Redesign",
    company: "TechNova Solutions",
    freelancer: {
      name: "Ahmed Mostafa",
      avatar: null,
      online: true,
    },
    client: {
      name: "TechNova Solutions",
      avatar: null,
    },
    status: "IN_PROGRESS" as const,
    progress: 65,
    deadline: "2026-08-15",
    startDate: "2026-06-01",
    description: "Modern responsive website with e-commerce integration",
    category: "Web Development",
    budget: 5000,
    currency: "USD",
    priority: "HIGH" as const,
    currentPhase: "Development",
    estimatedCompletion: "2026-08-20",
  },
  {
    id: "2",
    name: "Mobile App Development",
    company: "Green Restaurant",
    freelancer: {
      name: "Ahmed Mostafa",
      avatar: null,
      online: true,
    },
    client: {
      name: "Green Restaurant",
      avatar: null,
    },
    status: "PLANNING" as const,
    progress: 15,
    deadline: "2026-09-01",
    startDate: "2026-07-01",
    description: "iOS and Android app for food ordering",
    category: "Mobile Development",
    budget: 8000,
    currency: "USD",
    priority: "MEDIUM" as const,
    currentPhase: "Planning",
    estimatedCompletion: "2026-09-15",
  },
  {
    id: "3",
    name: "Brand Identity Package",
    company: "Alpha Fitness",
    freelancer: {
      name: "Ahmed Mostafa",
      avatar: null,
      online: false,
    },
    client: {
      name: "Alpha Fitness",
      avatar: null,
    },
    status: "IN_PROGRESS" as const,
    progress: 80,
    deadline: "2026-07-30",
    startDate: "2026-06-15",
    description: "Logo, branding guidelines, and marketing materials",
    category: "Branding",
    budget: 2500,
    currency: "USD",
    priority: "HIGH" as const,
    currentPhase: "Final Review",
    estimatedCompletion: "2026-08-01",
  },
];

export const projectFiles = {
  "1": [
    {
      id: "1",
      fileName: "website-mockup-v2.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadDate: "2026-07-10",
      uploadedBy: "freelancer",
      projectId: "1",
    },
    {
      id: "2",
      fileName: "homepage-design.fig",
      fileType: "Figma",
      fileSize: "8.5 MB",
      uploadDate: "2026-07-12",
      uploadedBy: "freelancer",
      projectId: "1",
    },
    {
      id: "3",
      fileName: "requirements.pdf",
      fileType: "PDF",
      fileSize: "1.1 MB",
      uploadDate: "2026-06-05",
      uploadedBy: "client",
      projectId: "1",
    },
  ],
  "2": [
    {
      id: "4",
      fileName: "project-timeline.xlsx",
      fileType: "XLSX",
      fileSize: "856 KB",
      uploadDate: "2026-07-12",
      uploadedBy: "freelancer",
      projectId: "2",
    },
    {
      id: "5",
      fileName: "app-wireframes.pdf",
      fileType: "PDF",
      fileSize: "3.2 MB",
      uploadDate: "2026-07-08",
      uploadedBy: "freelancer",
      projectId: "2",
    },
  ],
  "3": [
    {
      id: "6",
      fileName: "logo-variations.png",
      fileType: "PNG",
      fileSize: "1.2 MB",
      uploadDate: "2026-07-08",
      uploadedBy: "freelancer",
      projectId: "3",
    },
    {
      id: "7",
      fileName: "brand-guidelines.pdf",
      fileType: "PDF",
      fileSize: "4.1 MB",
      uploadDate: "2026-07-05",
      uploadedBy: "freelancer",
      projectId: "3",
    },
    {
      id: "8",
      fileName: "logo-upload.ai",
      fileType: "AI",
      fileSize: "5.6 MB",
      uploadDate: "2026-06-20",
      uploadedBy: "client",
      projectId: "3",
    },
  ],
};

export const projectInvoices = {
  "1": [
    {
      id: "INV-2026-002",
      projectId: "1",
      projectName: "Company Website Redesign",
      amount: 2500,
      currency: "USD",
      status: "PENDING" as const,
      dueDate: "2026-08-20",
      paidDate: null,
    },
  ],
  "2": [
    {
      id: "INV-2026-003",
      projectId: "2",
      projectName: "Mobile App Development",
      amount: 4200,
      currency: "USD",
      status: "OVERDUE" as const,
      dueDate: "2026-07-10",
      paidDate: null,
    },
  ],
  "3": [
    {
      id: "INV-2026-001",
      projectId: "3",
      projectName: "Brand Identity Package",
      amount: 1800,
      currency: "USD",
      status: "PAID" as const,
      dueDate: "2026-07-01",
      paidDate: "2026-07-01",
    },
  ],
};

export const projectMessages = {
  "1": [
    {
      id: "1",
      senderName: "Ahmed Mostafa",
      senderRole: "freelancer" as const,
      senderAvatar: null,
      content:
        "I've uploaded the latest mockups for your review. Let me know your thoughts on the homepage design.",
      timestamp: "2026-07-13T10:30:00Z",
      projectId: "1",
      deliveryState: "read" as const,
      type: "text" as const,
    },
    {
      id: "2",
      senderName: "TechNova Solutions",
      senderRole: "client" as const,
      senderAvatar: null,
      content:
        "Looks great! Can we change the hero section to be more dynamic? Maybe add some animation.",
      timestamp: "2026-07-13T11:15:00Z",
      projectId: "1",
      deliveryState: "read" as const,
      type: "text" as const,
    },
    {
      id: "3",
      senderName: "Ahmed Mostafa",
      senderRole: "freelancer" as const,
      senderAvatar: null,
      content: "Uploaded Homepage.fig",
      timestamp: "2026-07-13T11:30:00Z",
      projectId: "1",
      deliveryState: "read" as const,
      type: "attachment" as const,
      attachment: {
        fileName: "homepage-design.fig",
        fileSize: "8.5 MB",
      },
    },
    {
      id: "4",
      senderRole: "system" as const,
      content: "Project milestone completed: Homepage Design",
      timestamp: "2026-07-13T12:00:00Z",
      projectId: "1",
      type: "system" as const,
    },
  ],
  "2": [
    {
      id: "5",
      senderName: "Ahmed Mostafa",
      senderRole: "freelancer" as const,
      senderAvatar: null,
      content:
        "Great! I'll start working on the mobile app wireframes this week.",
      timestamp: "2026-07-10T14:00:00Z",
      projectId: "2",
      deliveryState: "read" as const,
      type: "text" as const,
    },
  ],
  "3": [
    {
      id: "6",
      senderName: "Ahmed Mostafa",
      senderRole: "freelancer" as const,
      senderAvatar: null,
      content:
        "The logo variations are ready. I've included 5 different options for you to choose from.",
      timestamp: "2026-07-12T09:00:00Z",
      projectId: "3",
      deliveryState: "read" as const,
      type: "text" as const,
    },
    {
      id: "7",
      senderName: "Alpha Fitness",
      senderRole: "client" as const,
      senderAvatar: null,
      content: "Option 3 is perfect! Let's proceed with that one.",
      timestamp: "2026-07-12T10:30:00Z",
      projectId: "3",
      deliveryState: "read" as const,
      type: "text" as const,
    },
  ],
};

export const projectTimeline = {
  "1": [
    {
      id: "1",
      event: "Project created",
      timestamp: "2026-06-01T09:00:00Z",
      actor: "client",
      projectId: "1",
    },
    {
      id: "2",
      event: "Client uploaded logo",
      timestamp: "2026-06-05T14:30:00Z",
      actor: "client",
      projectId: "1",
    },
    {
      id: "3",
      event: "Freelancer uploaded mockup",
      timestamp: "2026-07-10T16:00:00Z",
      actor: "freelancer",
      projectId: "1",
    },
    {
      id: "4",
      event: "Invoice generated",
      timestamp: "2026-07-12T10:00:00Z",
      actor: "system",
      projectId: "1",
    },
    {
      id: "5",
      event: "Project marked 65% complete",
      timestamp: "2026-07-13T12:00:00Z",
      actor: "freelancer",
      projectId: "1",
    },
  ],
  "2": [
    {
      id: "6",
      event: "Project created",
      timestamp: "2026-07-01T09:00:00Z",
      actor: "client",
      projectId: "2",
    },
    {
      id: "7",
      event: "Freelancer uploaded wireframes",
      timestamp: "2026-07-08T15:00:00Z",
      actor: "freelancer",
      projectId: "2",
    },
  ],
  "3": [
    {
      id: "8",
      event: "Project created",
      timestamp: "2026-06-15T09:00:00Z",
      actor: "client",
      projectId: "3",
    },
    {
      id: "9",
      event: "Client uploaded logo",
      timestamp: "2026-06-20T11:00:00Z",
      actor: "client",
      projectId: "3",
    },
    {
      id: "10",
      event: "Freelancer uploaded variations",
      timestamp: "2026-07-08T14:00:00Z",
      actor: "freelancer",
      projectId: "3",
    },
    {
      id: "11",
      event: "Invoice paid",
      timestamp: "2026-07-01T10:00:00Z",
      actor: "system",
      projectId: "3",
    },
  ],
};

export const clientStats = {
  assignedProjects: 3,
  overallProgress: 53,
  pendingInvoice: 6700,
  unreadMessages: 4,
};
export const clientMessages = Object.values(projectMessages).flat();

// Helper function to get project data by ID
export function getProjectById(projectId: string) {
  return clientProjects.find((p) => p.id === projectId);
}

export function getProjectFiles(projectId: string) {
  return projectFiles[projectId as keyof typeof projectFiles] || [];
}

export function getProjectInvoices(projectId: string) {
  return projectInvoices[projectId as keyof typeof projectInvoices] || [];
}

export const clientInvoices = Object.values(projectInvoices).flat();

export function getProjectMessages(projectId: string) {
  return projectMessages[projectId as keyof typeof projectMessages] || [];
}

export function getProjectTimeline(projectId: string) {
  return projectTimeline[projectId as keyof typeof projectTimeline] || [];
}
