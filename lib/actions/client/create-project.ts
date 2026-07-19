"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/actions/action-result";
import { CreateClientProjectSchema } from "@/lib/validations/project";

export async function createClientProject(data: unknown) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "CLIENT") {
    return failure("Unauthorized");
  }

  const validated = CreateClientProjectSchema.safeParse(data);

  if (!validated.success) {
    return failure("Invalid project data.");
  }

  const { title, description, budget, dueDate, freelancerEmail, notes } = validated.data;
  
  // Create description from description + notes if provided
  let fullDescription = description || "";
  if (notes) {
    fullDescription += fullDescription ? `\n\nClient Notes:\n${notes}` : `Client Notes:\n${notes}`;
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Find freelancer if email is provided
      let freelancerId = null;
      if (freelancerEmail) {
        const freelancer = await tx.user.findUnique({
          where: { email: freelancerEmail },
          select: { id: true, role: true },
        });

        if (freelancer && freelancer.role === "FREELANCER") {
          freelancerId = freelancer.id;
        }
      }

      // 2. Create the project
      // ownerId is null initially because the freelancer hasn't accepted yet
      const project = await tx.project.create({
        data: {
          title,
          customerName: session.user.name || "Client",
          description: fullDescription || null,
          budget,
          dueDate,
          status: "PENDING",
          linkedClientId: session.user.id,
          // ownerId is left as null; will be set when freelancer accepts
        },
      });

      // 3. Create conversation automatically
      await tx.conversation.create({
        data: {
          projectId: project.id,
        },
      });

      // 4. Create invitation and notification if freelancer found
      if (freelancerId) {
        await tx.projectInvitation.create({
          data: {
            projectId: project.id,
            freelancerId,
            clientId: session.user.id,
            status: "PENDING",
          },
        });

        await tx.notification.create({
          data: {
            userId: freelancerId,
            title: "New Project Invitation",
            message: `${session.user.name} has invited you to collaborate on "${project.title}".`,
            type: "INFO",
            event: "PROJECT_INVITATION",
            projectId: project.id,
            link: `/projects/${project.id}`,
          },
        });
        
        // Log the invitation activity
        await tx.activityLog.create({
          data: {
            action: "PROJECT_CREATED",
            projectId: project.id,
            userId: session.user.id,
          },
        });
      } else {
        // Just log the creation
        await tx.activityLog.create({
          data: {
            action: "PROJECT_CREATED",
            projectId: project.id,
            userId: session.user.id,
          },
        });
      }

      return success(project);
    });
  } catch (error: unknown) {
    console.error("Failed to create client project:", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to create project");
  }
}
