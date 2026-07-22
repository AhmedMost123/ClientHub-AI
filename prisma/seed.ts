import {
  PrismaClient,
  UserRole,
  ProjectStatus,
  TaskStatus,
  Priority,
  InvoiceStatus,
  NotificationType,
  NotificationEvent,
  ActivityType,
  Theme,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Stable IDs so sessions remain valid after re-seeding
const FREELANCER_USER_ID = "cl-demo-freelancer-user-id";
const CLIENT_USER_ID = "cl-demo-client-user-id";

async function main() {
  console.log("🌱 Seeding ClientHub AI demo database with stable user IDs...");

  // 1. Reset Database in correct Foreign Key order
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIChat.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.file.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectInvitation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.verificationCode.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Previous database records cleared.");

  // Hash password for demo accounts
  const passwordHash = await bcrypt.hash("Demo123!", 12);

  // 2. Create Freelancer Account with Stable ID
  const freelancerUser = await prisma.user.create({
    data: {
      id: FREELANCER_USER_ID,
      name: "Ahmed Mostafa",
      email: "freelancer.demo@clienthub.ai",
      password: passwordHash,
      role: UserRole.FREELANCER,
      isVerified: true,
      isDisabled: false,
      settings: {
        create: {
          theme: Theme.DARK,
          language: "en",
          emailAlerts: true,
        },
      },
    },
  });

  console.log(`✅ Created Freelancer: ${freelancerUser.name} (${freelancerUser.email}) [ID: ${freelancerUser.id}]`);

  // 3. Create Client Account with Stable ID
  const clientUser = await prisma.user.create({
    data: {
      id: CLIENT_USER_ID,
      name: "Acme Corporation",
      email: "client.demo@clienthub.ai",
      password: passwordHash,
      role: UserRole.CLIENT,
      isVerified: true,
      isDisabled: false,
      clientProfile: {
        create: {
          id: "cl-demo-client-profile-id",
          company: "Acme Corporation",
          phone: "+1 (555) 019-2834",
          notes: "Key enterprise client for SaaS platform & analytics development.",
          status: "ACTIVE",
        },
      },
      settings: {
        create: {
          theme: Theme.DARK,
          language: "en",
          emailAlerts: true,
        },
      },
    },
  });

  console.log(`✅ Created Client: ${clientUser.name} (${clientUser.email}) [ID: ${clientUser.id}]`);

  // Define Date Helpers for Historical Data
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  const daysAhead = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  const monthsAgoDate = (m: number, day = 15) => new Date(now.getFullYear(), now.getMonth() - m, day, 14, 0, 0);

  // 4. Create Multi-Month Projects with Stable IDs

  // THIS MONTH (0 Months Ago)
  const project1 = await prisma.project.create({
    data: {
      id: "cl-demo-project-1",
      title: "Build Acme SaaS Platform",
      description: "Development of a complete SaaS platform including authentication, dashboards, AI assistant, and client collaboration.",
      status: ProjectStatus.IN_PROGRESS,
      budget: 3500,
      dueDate: daysAhead(9),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: daysAgo(14),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      id: "cl-demo-project-2",
      title: "E-commerce Analytics Dashboard",
      description: "Custom analytics dashboard for tracking e-commerce metrics, conversion rates, and revenue breakdown.",
      status: ProjectStatus.IN_PROGRESS,
      budget: 5000,
      dueDate: daysAhead(30),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: daysAgo(7),
    },
  });

  const project3 = await prisma.project.create({
    data: {
      id: "cl-demo-project-3",
      title: "AI Chatbot Integration",
      description: "Integrating LLM-powered customer support chatbot into client dashboard.",
      status: ProjectStatus.IN_PROGRESS,
      budget: 2800,
      dueDate: daysAhead(21),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: daysAgo(3),
    },
  });

  // 1 MONTH AGO
  const project4 = await prisma.project.create({
    data: {
      id: "cl-demo-project-4",
      title: "Corporate Website Redesign",
      description: "Complete visual redesign and Next.js performance optimization for corporate homepage.",
      status: ProjectStatus.COMPLETED,
      budget: 4200,
      dueDate: daysAgo(15),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(1, 1),
    },
  });

  const project5 = await prisma.project.create({
    data: {
      id: "cl-demo-project-5",
      title: "Mobile App UI Kit",
      description: "Figma design system and React Native component library.",
      status: ProjectStatus.COMPLETED,
      budget: 2500,
      dueDate: daysAgo(20),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(1, 5),
    },
  });

  // 2 MONTHS AGO
  const project6 = await prisma.project.create({
    data: {
      id: "cl-demo-project-6",
      title: "Brand Identity & Design System",
      description: "Logo redesign, brand guidelines, and UI component design system.",
      status: ProjectStatus.COMPLETED,
      budget: 3800,
      dueDate: monthsAgoDate(2, 25),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(2, 1),
    },
  });

  // 3 MONTHS AGO
  const project7 = await prisma.project.create({
    data: {
      id: "cl-demo-project-7",
      title: "Fintech API Integration",
      description: "Secure Stripe & Supabase payment integration with automated webhooks.",
      status: ProjectStatus.COMPLETED,
      budget: 4500,
      dueDate: monthsAgoDate(3, 20),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(3, 2),
    },
  });

  // 4 MONTHS AGO
  const project8 = await prisma.project.create({
    data: {
      id: "cl-demo-project-8",
      title: "CRM Dashboard Development",
      description: "Custom internal CRM tool for managing client pipelines and contract billing.",
      status: ProjectStatus.COMPLETED,
      budget: 3200,
      dueDate: monthsAgoDate(4, 25),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(4, 1),
    },
  });

  // 5 MONTHS AGO
  const project9 = await prisma.project.create({
    data: {
      id: "cl-demo-project-9",
      title: "SEO Optimization & Web Performance",
      description: "PageSpeed 100/100 performance audit, schema markup, and metadata optimization.",
      status: ProjectStatus.COMPLETED,
      budget: 2000,
      dueDate: monthsAgoDate(5, 20),
      customerName: "Acme Corporation",
      ownerId: FREELANCER_USER_ID,
      linkedClientId: CLIENT_USER_ID,
      isArchived: false,
      createdAt: monthsAgoDate(5, 1),
    },
  });

  console.log("✅ Created 9 Multi-Month Projects");

  // 5. Create Tasks across Projects
  await prisma.task.createMany({
    data: [
      // Project 1 Tasks
      {
        title: "Design dashboard interface",
        description: "Create high-fidelity responsive wireframes and layout tokens.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 12,
        completedAt: daysAgo(6),
        projectId: project1.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Implement authentication system",
        description: "NextAuth credentials provider, email OTP verification, and JWT session handling.",
        status: TaskStatus.DONE,
        priority: Priority.URGENT,
        estimatedHours: 16,
        completedAt: daysAgo(3),
        projectId: project1.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Build analytics dashboard",
        description: "Connect revenue breakdown charts, project stats, and recent activity widgets.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        estimatedHours: 20,
        projectId: project1.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Connect client collaboration",
        description: "Implement real-time messaging, file sharing, and project invitation flow.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        estimatedHours: 15,
        projectId: project1.id,
        createdById: FREELANCER_USER_ID,
      },

      // Project 2 Tasks
      {
        title: "Create analytics components",
        description: "Build custom Recharts charts for daily and monthly sales metrics.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        estimatedHours: 15,
        projectId: project2.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Connect API",
        description: "Integrate e-commerce platform REST and webhook endpoints.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        estimatedHours: 10,
        projectId: project2.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Build revenue charts",
        description: "Design monthly comparison charts and exportable PDF summaries.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        estimatedHours: 12,
        projectId: project2.id,
        createdById: FREELANCER_USER_ID,
      },

      // Project 3 Tasks
      {
        title: "Setup Groq AI SDK",
        description: "Initialize server actions and prompt templates.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 8,
        completedAt: daysAgo(1),
        projectId: project3.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Build chat UI widget",
        description: "Create floating chat drawer with streaming message history.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        estimatedHours: 14,
        projectId: project3.id,
        createdById: FREELANCER_USER_ID,
      },

      // Historical Completed Tasks
      {
        title: "Finalize homepage layout & copy",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 10,
        completedAt: daysAgo(18),
        projectId: project4.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Export UI kit assets",
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        estimatedHours: 8,
        completedAt: daysAgo(22),
        projectId: project5.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Design brand vector logos",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 14,
        completedAt: monthsAgoDate(2, 20),
        projectId: project6.id,
        createdById: FREELANCER_USER_ID,
      },
      {
        title: "Stripe webhook error handlers",
        status: TaskStatus.DONE,
        priority: Priority.URGENT,
        estimatedHours: 12,
        completedAt: monthsAgoDate(3, 15),
        projectId: project7.id,
        createdById: FREELANCER_USER_ID,
      },
    ],
  });

  console.log("✅ Created Tasks");

  // 6. Create Conversations & Messages
  const conversation1 = await prisma.conversation.create({
    data: {
      id: "cl-demo-conversation-1",
      projectId: project1.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation1.id,
        senderId: FREELANCER_USER_ID,
        content: "Hello, the first dashboard version is ready. Please review the progress.",
        createdAt: daysAgo(2),
      },
      {
        conversationId: conversation1.id,
        senderId: CLIENT_USER_ID,
        content: "Great work. The design looks professional. Continue with analytics.",
        createdAt: daysAgo(1),
      },
      {
        conversationId: conversation1.id,
        senderId: FREELANCER_USER_ID,
        content: "I will finish the analytics section and prepare the next milestone.",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    ],
  });

  console.log("✅ Created Conversation & Messages");

  // 7. Create Historical Paid & Pending Invoices for Revenue Chart Curve
  await prisma.invoice.createMany({
    data: [
      // THIS MONTH (July) - $3,500 Paid, $5,000 Sent
      {
        invoiceNumber: "INV-2026-0001",
        amount: 3500,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: daysAgo(3),
        issueDate: daysAgo(10),
        projectId: project1.id,
        description: "Initial milestone payment for SaaS Platform Development.",
      },
      {
        invoiceNumber: "INV-2026-0002",
        amount: 5000,
        currency: "USD",
        status: InvoiceStatus.SENT,
        dueDate: daysAhead(20),
        issueDate: daysAgo(2),
        projectId: project2.id,
        description: "Upfront project invoice for E-commerce Analytics Dashboard.",
      },

      // 1 MONTH AGO (June) - $4,200 + $2,500 = $6,700
      {
        invoiceNumber: "INV-2026-0003",
        amount: 4200,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(1, 15),
        issueDate: monthsAgoDate(1, 1),
        projectId: project4.id,
        description: "Final payment for Corporate Website Redesign.",
      },
      {
        invoiceNumber: "INV-2026-0004",
        amount: 2500,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(1, 28),
        issueDate: monthsAgoDate(1, 5),
        projectId: project5.id,
        description: "Full payment for Mobile App UI Kit.",
      },

      // 2 MONTHS AGO (May) - $3,800
      {
        invoiceNumber: "INV-2026-0005",
        amount: 3800,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(2, 20),
        issueDate: monthsAgoDate(2, 2),
        projectId: project6.id,
        description: "Brand Identity & Design System delivery.",
      },

      // 3 MONTHS AGO (April) - $4,500
      {
        invoiceNumber: "INV-2026-0006",
        amount: 4500,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(3, 10),
        issueDate: monthsAgoDate(3, 1),
        projectId: project7.id,
        description: "Fintech API & Payment Gateway Integration.",
      },

      // 4 MONTHS AGO (March) - $3,200
      {
        invoiceNumber: "INV-2026-0007",
        amount: 3200,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(4, 22),
        issueDate: monthsAgoDate(4, 2),
        projectId: project8.id,
        description: "CRM Dashboard implementation milestone.",
      },

      // 5 MONTHS AGO (February) - $2,000
      {
        invoiceNumber: "INV-2026-0008",
        amount: 2000,
        currency: "USD",
        status: InvoiceStatus.PAID,
        paidAt: monthsAgoDate(5, 14),
        issueDate: monthsAgoDate(5, 1),
        projectId: project9.id,
        description: "SEO Performance & Optimization audit.",
      },
    ],
  });

  console.log("✅ Created Invoices with Historical Revenue Curve");

  // 8. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        action: ActivityType.PROJECT_CREATED,
        projectId: project1.id,
        userId: FREELANCER_USER_ID,
        createdAt: daysAgo(14),
      },
      {
        action: ActivityType.TASK_COMPLETED,
        projectId: project1.id,
        userId: FREELANCER_USER_ID,
        createdAt: daysAgo(3),
      },
      {
        action: ActivityType.INVOICE_PAID,
        projectId: project1.id,
        userId: FREELANCER_USER_ID,
        createdAt: daysAgo(3),
      },
      {
        action: ActivityType.MESSAGE_SENT,
        projectId: project1.id,
        userId: FREELANCER_USER_ID,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        action: ActivityType.PROJECT_COMPLETED,
        projectId: project4.id,
        userId: FREELANCER_USER_ID,
        createdAt: daysAgo(15),
      },
    ],
  });

  console.log("✅ Created Activity Logs");

  // 9. Create Rich Notifications for FREELANCER and CLIENT (Today, Yesterday, & Earlier)
  await prisma.notification.createMany({
    data: [
      // ── FREELANCER NOTIFICATIONS ──────────────────────────────
      {
        userId: FREELANCER_USER_ID,
        title: "Project Deadline Approaching",
        message: "'Build Acme SaaS Platform' is due in 9 days.",
        type: NotificationType.WARNING,
        event: NotificationEvent.TASK_ASSIGNED,
        isRead: false,
        projectId: project1.id,
        createdAt: new Date(now.getTime() - 10 * 60 * 1000), // Today (10 mins ago)
      },
      {
        userId: FREELANCER_USER_ID,
        title: "New Client Message",
        message: "Acme Corporation: 'Great work. The design looks professional. Continue with analytics.'",
        type: NotificationType.INFO,
        event: NotificationEvent.NEW_MESSAGE,
        isRead: false,
        projectId: project1.id,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Today (2 hours ago)
      },
      {
        userId: FREELANCER_USER_ID,
        title: "Invoice Paid",
        message: "Invoice INV-2026-0001 ($3,500.00) has been paid by Acme Corporation.",
        type: NotificationType.SUCCESS,
        event: NotificationEvent.INVOICE_PAID,
        isRead: true,
        projectId: project1.id,
        createdAt: daysAgo(1), // Yesterday
      },
      {
        userId: FREELANCER_USER_ID,
        title: "Invitation Accepted",
        message: "Acme Corporation accepted the project invitation for 'E-commerce Analytics Dashboard'.",
        type: NotificationType.SUCCESS,
        event: NotificationEvent.PROJECT_INVITATION_ACCEPTED,
        isRead: true,
        projectId: project2.id,
        createdAt: daysAgo(3), // Earlier
      },
      {
        userId: FREELANCER_USER_ID,
        title: "Project Completed",
        message: "'Corporate Website Redesign' project was marked as completed.",
        type: NotificationType.SUCCESS,
        event: NotificationEvent.PROJECT_COMPLETED,
        isRead: true,
        projectId: project4.id,
        createdAt: daysAgo(15), // Earlier
      },

      // ── CLIENT NOTIFICATIONS ─────────────────────────────────
      {
        userId: CLIENT_USER_ID,
        title: "New Message Received",
        message: "Ahmed Mostafa: 'I will finish the analytics section and prepare the next milestone.'",
        type: NotificationType.INFO,
        event: NotificationEvent.NEW_MESSAGE,
        isRead: false,
        projectId: project1.id,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Today (2 hours ago)
      },
      {
        userId: CLIENT_USER_ID,
        title: "Milestone Completed",
        message: "Task 'Implement authentication system' was completed by Ahmed Mostafa.",
        type: NotificationType.SUCCESS,
        event: NotificationEvent.TASK_ASSIGNED,
        isRead: false,
        projectId: project1.id,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // Today (5 hours ago)
      },
      {
        userId: CLIENT_USER_ID,
        title: "Invoice Received",
        message: "New invoice INV-2026-0002 ($5,000.00) issued for E-commerce Analytics Dashboard.",
        type: NotificationType.INFO,
        event: NotificationEvent.INVOICE_CREATED,
        isRead: false,
        projectId: project2.id,
        createdAt: daysAgo(1), // Yesterday
      },
      {
        userId: CLIENT_USER_ID,
        title: "Project Updated",
        message: "'Build Acme SaaS Platform' progress reached 50%.",
        type: NotificationType.INFO,
        event: NotificationEvent.TASK_ASSIGNED,
        isRead: true,
        projectId: project1.id,
        createdAt: daysAgo(2), // Earlier
      },
      {
        userId: CLIENT_USER_ID,
        title: "Project Invitation",
        message: "Ahmed Mostafa invited you to collaborate on 'AI Chatbot Integration'.",
        type: NotificationType.INFO,
        event: NotificationEvent.PROJECT_INVITATION,
        isRead: true,
        projectId: project3.id,
        createdAt: daysAgo(3), // Earlier
      },
    ],
  });

  console.log("✅ Created Notifications for Today, Yesterday, & Earlier");

  // 10. Create AI Chat Demo
  const aiChat = await prisma.aIChat.create({
    data: {
      id: "cl-demo-ai-chat-id",
      title: "SaaS Marketing & Onboarding Strategy",
      userId: FREELANCER_USER_ID,
    },
  });

  await prisma.aIMessage.createMany({
    data: [
      {
        role: "USER",
        content: "What are the best strategies for onboarding new SaaS client portals?",
        chatId: aiChat.id,
      },
      {
        role: "AI",
        content: "1. Provide a clean project dashboard.\n2. Enable real-time updates & notifications.\n3. Keep contract and invoice management transparent.",
        chatId: aiChat.id,
      },
    ],
  });

  console.log("✅ Created AI Assistant Chat");
  console.log("🎉 Database seeded successfully!");
  console.log("\n==============================================");
  console.log("DEMO ACCOUNTS READY FOR MANUAL TESTING:");
  console.log("1. Freelancer Account:");
  console.log("   Email:    freelancer.demo@clienthub.ai");
  console.log("   Password: Demo123!");
  console.log("2. Client Account:");
  console.log("   Email:    client.demo@clienthub.ai");
  console.log("   Password: Demo123!");
  console.log("==============================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
