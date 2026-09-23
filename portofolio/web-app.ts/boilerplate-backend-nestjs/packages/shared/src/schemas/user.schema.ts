import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email().describe("User email address"),
  full_name: z.string().min(2).describe("User full name"),
  password: z.string().min(8).describe("User password (min 8 characters)"),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  is_active: z.boolean().optional().describe("User active status"),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
