import { beforeEach, describe, expect, it } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should return health check message", () => {
      expect(appController.getHello()).toBe(
        "Boilerplate Backend API is running!",
      );
    });
  });
});
