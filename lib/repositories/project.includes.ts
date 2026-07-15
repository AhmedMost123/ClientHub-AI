import { Prisma } from "@prisma/client";

export const projectCardInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },

  linkedClient: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },

  _count: {
    select: {
      tasks: true,
    },
  },
} satisfies Prisma.ProjectInclude;
