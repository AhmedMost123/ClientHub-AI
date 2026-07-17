import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const userRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    return prisma.user.create({
      data,
    });
  },

  async searchClients(query: string) {
    const search = query.trim();

    if (!search) return [];

    return prisma.user.findMany({
      where: {
        role: UserRole.CLIENT,
        OR: [
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },

      take: 10,

      orderBy: [
        {
          name: "asc",
        },
        {
          email: "asc",
        },
      ],
    });
  },
};

export const { findUserByEmail, createUser, searchClients } = userRepository;
