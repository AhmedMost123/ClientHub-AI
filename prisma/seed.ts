import { PrismaClient, Theme } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // STEP 5: Reset Database Before Seeding
  // The order here is critical due to Foreign Key relations!
  await prisma.notification.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIChat.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.projectMessage.deleteMany();
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
        name: "TechNova",
        email: "contact@technova.com",
        company: "TechNova",
        phone: "+1 555 111",

        status: "ACTIVE",

        userId: user.id,
      },

      {
        name: "Green Restaurant",
        email: "owner@green.com",
        company: "Green Restaurant",
        phone: "+1 555 222",

        status: "ACTIVE",

        userId: user.id,
      },

      {
        name: "Alpha Fitness",

        email: "contact@alpha.com",

        company: "Alpha Fitness",

        status: "LEAD",

        userId: user.id,
      },

      {
        name: "Creative Studio",

        email: "studio@creative.com",

        company: "Creative Studio",

        status: "ACTIVE",

        userId: user.id,
      },

      {
        name: "Vision Agency",

        email: "hello@vision.com",

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
      currency: "USD",
      status: "IN_PROGRESS",
      progress: 35,
      dueDate: new Date("2026-08-15"),
      clientId: clients[0].id,
      userId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "E-Commerce Store",
      description: "Online shopping platform",
      budget: 4200,
      currency: "USD",
      status: "PLANNING",
      progress: 10,
      dueDate: new Date("2026-09-01"),
      clientId: clients[1].id,
      userId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Admin Dashboard",
      description: "Internal dashboard",
      budget: 1800,
      currency: "USD",
      status: "IN_PROGRESS",
      progress: 60,
      dueDate: new Date("2026-08-30"),
      clientId: clients[2].id,
      userId: user.id,
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

  await prisma.file.createMany({
    data: [
      {
        fileName: "contract.pdf",
        fileUrl: "/uploads/contract.pdf",
        fileSize: 120450,
        mimeType: "application/pdf",
        uploadedBy: "Ahmed",
        projectId: project1.id,
      },
      {
        fileName: "wireframe.png",
        fileUrl: "/uploads/wireframe.png",
        fileSize: 502320,
        mimeType: "image/png",
        uploadedBy: "Ahmed",
        projectId: project1.id,
      },
      {
        fileName: "logo.svg",
        fileUrl: "/uploads/logo.svg",
        fileSize: 15420,
        mimeType: "image/svg+xml",
        uploadedBy: "Ahmed",
        projectId: project2.id,
      },
    ],
  });

  console.log("✅ Files created");
  await prisma.projectMessage.createMany({
    data: [
      {
        sender: "CLIENT",
        content: "Can we launch before Friday?",
        projectId: project1.id,
      },
      {
        sender: "USER",
        content: "Yes, I'm finishing the final pages today.",
        projectId: project1.id,
      },
      {
        sender: "CLIENT",
        content: "The homepage looks great!",
        projectId: project1.id,
      },
      {
        sender: "CLIENT",
        content: "Please update the pricing section.",
        projectId: project2.id,
      },
      {
        sender: "USER",
        content: "I'll push the update tonight.",
        projectId: project2.id,
      },
    ],
  });

  console.log("✅ Project messages created");

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
        userId: user.id,
      },
      {
        title: "Invoice Paid",
        message: "Invoice INV-2026-0001 has been paid.",
        type: "SUCCESS",
        userId: user.id,
      },
      {
        title: "New Client",
        message: "Creative Studio has been added.",
        type: "INFO",
        userId: user.id,
      },
      {
        title: "Task Due Soon",
        message: "Shopping Cart is due tomorrow.",
        type: "WARNING",
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
