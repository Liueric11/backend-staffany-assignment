import * as typeorm from "typeorm";
import * as weekRepository from "../weekRepository";
import Week from "../../entity/week";

jest.mock("typeorm", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("typeorm") as typeof typeorm),
  };
});

describe("weekRepository => findOne", () => {
  it("should return the correct week => passed", async () => {
    const options = { where: { 
      startDate: "2024-01-01",
      endDate: "2024-01-07"
    }};

    const expectedWeek = new Week("2024-01-01", "2024-01-07");

    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(expectedWeek),
    };

    const getRepositorySpy = jest.spyOn(typeorm, "getRepository").mockReturnValue(mockRepository as any);

    const result = await weekRepository.findOne(options);

    expect(getRepositorySpy).toHaveBeenCalledWith(Week);
    expect(mockRepository.findOne).toHaveBeenCalledWith(options);
    expect(result).toEqual(expectedWeek);
  });

  it("should return null if no week => passed", async () => {
    const options = { where: { 
      startDate: "2024-01-01",
      endDate: "2024-01-07"
    }};

    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(null), 
    };

    const getRepositorySpy = jest.spyOn(typeorm, "getRepository").mockReturnValue(mockRepository as any);

    const result = await weekRepository.findOne(options);

    expect(getRepositorySpy).toHaveBeenCalledWith(Week);
    expect(mockRepository.findOne).toHaveBeenCalledWith(options);
    expect(result).toBeNull();
  });
});

describe("weekRepository => create", () => {
  it("create => passed", async () => {
    const payload = new Week("2024-01-01", "2024-01-07");
    payload.id = "0000-0000-000-000";

    const expectedWeek = new Week("2024-01-01", "2024-01-07");
    expectedWeek.id = "0000-0000-000-000";

    const mockRepository = {
      save: jest.fn().mockResolvedValue(expectedWeek),
    };

    const getRepositorySpy = jest.spyOn(typeorm, "getRepository").mockReturnValue(mockRepository as any);

    const result = await weekRepository.create(payload);

    expect(getRepositorySpy).toHaveBeenCalledWith(Week);
    expect(mockRepository.save).toHaveBeenCalledWith(payload);
    expect(result).toEqual(expectedWeek);
  });
});

describe("weekRepository => updateById", () => {
  it("updated success => passed", async () => {
    const date = new Date();

    const week = new Week("2024-01-01", "2024-01-07");
    week.id = "0000-0000-000-000";
    week.isPublished = true;
    week.publishedAt  = date

    const payload = { isPublished: true, publishedAt: date };

    const updatedWeek = new Week("2024-01-01", "2024-01-07");
    updatedWeek.id = "0000-0000-000-000";
    updatedWeek.isPublished = true;
    updatedWeek.publishedAt  = date

    const mockRepository = {
      update: jest.fn().mockResolvedValue(undefined),
    };

    const getRepositorySpy = jest.spyOn(typeorm, "getRepository").mockReturnValue(mockRepository as any);

    const result = await weekRepository.updateById(week, payload);

    console.log(result, "result");
    console.log(updatedWeek, "updated");

    expect(getRepositorySpy).toHaveBeenCalledWith(Week);
    expect(mockRepository.update).toHaveBeenCalledWith(week.id, payload);
    expect(result).toEqual(updatedWeek);
  });

  it("updated failed => passed", async () => {
    const week = new Week("2024-01-01", "2024-01-07");
    week.id = "0000-0000-000-000";

    const date = new Date();
    const payload = { isPublished: true, publishedAt: date };

    const mockRepository = {
      update: jest.fn().mockRejectedValue(new Error("Update failed")),
    };

    const getRepositorySpy = jest.spyOn(typeorm, "getRepository").mockReturnValue(mockRepository as any);

    try {
      await weekRepository.updateById(week, payload);
    } catch (error) {
      expect(getRepositorySpy).toHaveBeenCalledWith(Week);
      expect(mockRepository.update).toHaveBeenCalledWith(week.id, payload);
      expect(error).toEqual(new Error("Update failed"));
    }
  });
});


