import { Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "@repo/shared/schemas/user.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.users.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.client.users.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.client.users.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        password_hash: dto.password, // TODO: Harus di-hash menggunakan bcrypt/argon2
        is_active: true,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const dataToUpdate: any = { ...dto };
    if (dto.password) {
      dataToUpdate.password_hash = dto.password; // TODO: Harus di-hash
      delete dataToUpdate.password;
    }

    return this.prisma.client.users.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.client.users.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { success: true, id };
  }
}
