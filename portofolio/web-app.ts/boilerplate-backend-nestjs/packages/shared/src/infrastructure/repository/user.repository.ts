import type { PrismaClient, Users } from "#generated/client";

export interface CreateUserInput {
  email: string;
  full_name: string;
  password_hash: string;
}

export interface UpdateUserInput {
  email?: string;
  full_name?: string;
  password_hash?: string;
  is_active?: boolean;
}

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  async findById(id: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany({
      where: { deleted_at: null },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
