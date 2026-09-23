import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponses } from "@repo/shared/docs/responses/user.response";
import { ResponseHelper } from "@repo/shared/http/response";
import { CreateUserDto, UpdateUserDto } from "@repo/shared/schemas/user.schema";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "Success",
    schema: { type: "object", example: UserResponses.UserList },
  })
  async findAll() {
    const data = await this.userService.findAll();
    return ResponseHelper.success(data, "Users retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({
    status: 200,
    description: "Success",
    schema: { type: "object", example: UserResponses.SingleUser },
  })
  async findOne(@Param("id") id: string) {
    const data = await this.userService.findOne(id);
    return ResponseHelper.success(data, "User retrieved successfully");
  }

  @Post()
  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({
    status: 201,
    description: "Created successfully",
    schema: { type: "object", example: UserResponses.SingleUser },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return ResponseHelper.success(data, "User created successfully", 201);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({
    status: 200,
    description: "Updated successfully",
    schema: { type: "object", example: UserResponses.SingleUser },
  })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);
    return ResponseHelper.success(data, "User updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({
    status: 200,
    description: "Deleted successfully",
    schema: {
      type: "object",
      example: {
        status: "success",
        message: "User deleted successfully",
        data: null,
      },
    },
  })
  async remove(@Param("id") id: string) {
    await this.userService.remove(id);
    return ResponseHelper.success(null, "User deleted successfully");
  }
}
