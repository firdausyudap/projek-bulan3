import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "@repo/shared/schemas/user.schema";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";

jest.mock("@repo/shared/infrastructure/database/client", () => ({
  getPrisma: jest.fn(),
}));

describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;

  // Mock data
  const mockUser = {
    id: "1",
    full_name: "Test User",
    email: "test@example.com",
    password_hash: "hashedpassword",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  // Mock implementation untuk Prisma Client
  const mockPrismaClient = {
    client: {
      users: {
        findMany: jest.fn().mockResolvedValue([mockUser]),
        findUnique: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockResolvedValue(mockUser),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockUser, full_name: "Updated User" }),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaClient, // Inject mock ini sebagai ganti database asli
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(prisma.client.users.findMany).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single user by ID", async () => {
      const result = await service.findOne("1");
      expect(result).toEqual(mockUser);
      expect(prisma.client.users.findUnique).toHaveBeenCalledWith({
        where: { id: "1", deleted_at: null },
        select: expect.any(Object),
      });
    });

    it("should throw an error if user not found", async () => {
      // Ubah mock secara spesifik untuk tes ini agar mengembalikan null
      jest.spyOn(prisma.client.users, "findUnique").mockResolvedValueOnce(null);

      await expect(service.findOne("999")).rejects.toThrow("User not found");
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const dto: CreateUserDto = {
        email: "test@example.com",
        full_name: "Test User",
        password: "password123",
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockUser);
      expect(prisma.client.users.create).toHaveBeenCalled();
    });
  });
});
