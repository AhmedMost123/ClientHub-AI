import { PrismaClient, Theme } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // STEP 5: Reset Database Before Seeding
  // The order here is critical due to Foreign Key relations!
  await prisma.notification.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIChat.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.message.deleteMany();
  await prisma.file.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleared.");

  // --- Next Steps: Insert your fresh data here ---
  // e.g., const user = await prisma.user.create({ data: { ... } })

  const user = await prisma.user.create({
    data: {
      name: "Ahmed Mostafa",
      email: "ahmed@example.com",
      password: "hashed_password",

      settings: {
        create: {
          theme: Theme.SYSTEM,
          language: "en",
          emailAlerts: true,
        },
      },
    },
    include: {
      settings: true,
    },
  });

  console.log("✅ User created");

  await prisma.client.createMany({
    data: [
      {
        company: "TechNova",
        phone: "+1 555 111",
        status: "ACTIVE",
        userId: user.id,
      },
      {
        company: "Green Restaurant",
        phone: "+1 555 222",
        status: "ACTIVE",
        userId: user.id,
      },
      {
        company: "Alpha Fitness",
        status: "LEAD",
        userId: user.id,
      },
      {
        company: "Creative Studio",
        status: "ACTIVE",
        userId: user.id,
      },
      {
        company: "Vision Agency",
        status: "INACTIVE",
        userId: user.id,
      },
    ],
  });

  console.log("✅ Clients created");
  const clients = await prisma.client.findMany({
    where: {
      userId: user.id,
    },
  });

  const project1 = await prisma.project.create({
    data: {
      title: "Company Website",
      description: "Modern responsive website",
      budget: 2500,
      status: "IN_PROGRESS",
      dueDate: new Date("2026-08-15"),
      customerName: "TechNova",
      ownerId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "E-Commerce Store",
      description: "Online shopping platform",
      budget: 4200,
      status: "PLANNING",
      dueDate: new Date("2026-09-01"),
      customerName: "Green Restaurant",
      ownerId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Admin Dashboard",
      description: "Internal dashboard",
      budget: 1800,
      status: "IN_PROGRESS",
      dueDate: new Date("2026-08-30"),
      customerName: "Alpha Fitness",
      ownerId: user.id,
    },
  });

  console.log("✅ Projects created");

  await prisma.task.createMany({
    data: [
      // Company Website
      {
        title: "Design Homepage",
        status: "DONE",
        priority: "HIGH",
        estimatedHours: 6,
        projectId: project1.id,
      },
      {
        title: "Create About Page",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        estimatedHours: 4,
        projectId: project1.id,
      },
      {
        title: "Deploy Website",
        status: "TODO",
        priority: "HIGH",
        estimatedHours: 2,
        projectId: project1.id,
      },

      // E-Commerce Store
      {
        title: "Database Design",
        status: "DONE",
        priority: "URGENT",
        estimatedHours: 8,
        projectId: project2.id,
      },
      {
        title: "Shopping Cart",
        status: "IN_PROGRESS",
        priority: "HIGH",
        estimatedHours: 12,
        projectId: project2.id,
      },
      {
        title: "Payment Integration",
        status: "TODO",
        priority: "URGENT",
        estimatedHours: 10,
        projectId: project2.id,
      },

      // Dashboard
      {
        title: "Sidebar",
        status: "DONE",
        priority: "LOW",
        estimatedHours: 2,
        projectId: project3.id,
      },
      {
        title: "Charts",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        estimatedHours: 5,
        projectId: project3.id,
      },
      {
        title: "Dark Mode",
        status: "TODO",
        priority: "LOW",
        estimatedHours: 2,
        projectId: project3.id,
      },
    ],
  });

  console.log("✅ Tasks created");

  console.log("ℹ️ Skipping file and message seeding (schema refactored)");

  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: "INV-2026-0001",
        amount: 2500,
        currency: "USD",
        status: "PAID",
        paidAt: new Date(),
        projectId: project1.id,
      },
      {
        invoiceNumber: "INV-2026-0002",
        amount: 4200,
        currency: "USD",
        status: "SENT",
        dueDate: new Date("2026-08-20"),
        projectId: project2.id,
      },
      {
        invoiceNumber: "INV-2026-0003",
        amount: 1800,
        currency: "USD",
        status: "DRAFT",
        projectId: project3.id,
      },
    ],
  });

  console.log("✅ Invoices created");
  console.log("✅ Invoices created");

  const aiChat = await prisma.aIChat.create({
    data: {
      title: "Landing Page Improvements",
      userId: user.id,
    },
  });

  console.log("✅ AI Chat created");
  await prisma.aIMessage.createMany({
    data: [
      {
        role: "USER",
        content: "How can I improve my landing page?",
        chatId: aiChat.id,
      },
      {
        role: "AI",
        content:
          "Use a stronger hero section, better spacing, and a clear call-to-action.",
        chatId: aiChat.id,
      },
      {
        role: "USER",
        content: "Can you rewrite my hero text?",
        chatId: aiChat.id,
      },
      {
        role: "AI",
        content:
          "Absolutely! Here's a cleaner, more conversion-focused version...",
        chatId: aiChat.id,
      },
    ],
  });

  console.log("✅ AI Messages created");
  await prisma.notification.createMany({
    data: [
      {
        title: "Project Completed",
        message: "Company Website has been completed.",
        type: "SUCCESS",
        event: "PROJECT_COMPLETED",
        userId: user.id,
      },
      {
        title: "Invoice Paid",
        message: "Invoice INV-2026-0001 has been paid.",
        type: "SUCCESS",
        event: "INVOICE_PAID",
        userId: user.id,
      },
      {
        title: "New Client",
        message: "Creative Studio has been added.",
        type: "INFO",
        event: "TASK_ASSIGNED",
        userId: user.id,
      },
      {
        title: "Task Due Soon",
        message: "Shopping Cart is due tomorrow.",
        type: "WARNING",
        event: "TASK_ASSIGNED",
        userId: user.id,
      },
    ],
  });

  console.log("✅ Notifications created");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
