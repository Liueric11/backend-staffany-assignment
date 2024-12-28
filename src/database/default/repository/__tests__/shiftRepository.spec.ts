import * as typeorm from "typeorm";
import * as shiftRepository from "../shiftRepository";
import Shift from "../../entity/shift";
import Week from "../../entity/week";

jest.mock("typeorm", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("typeorm") as typeof typeorm),
  };
});

describe("shiftRepository => find", () => {
  it("find => passed", async () => {
    const expectedData = new Shift();
    expectedData.name = "Test Shift";
    expectedData.date = "2020-11-15";
    expectedData.startTime = "00:00:00";
    expectedData.endTime = "04:00:00";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue([expectedData]),
      } as any);

    const result = await shiftRepository.find();

    expect(result).toEqual([expectedData]);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, Shift);
    expect(typeorm.getRepository(Shift).find).toHaveBeenCalledTimes(1);
  });
});

describe("shiftRepository => findById", () => {
  it("findById => passed", async () => {
    const id = "0000-0000-000-000";

    const expectedData = new Shift();
    expectedData.id = id;
    expectedData.name = "Test Shift";
    expectedData.date = "2020-11-15";
    expectedData.startTime = "00:00:00";
    expectedData.endTime = "04:00:00";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedData),
      } as any);

    const result = await shiftRepository.findById(id);

    expect(result).toEqual(expectedData);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, Shift);
    expect(typeorm.getRepository(Shift).findOne).toHaveBeenNthCalledWith(
      1,
      id,
      expect.objectContaining({ relations: ["week"] }) 
    );
  });
});

describe("shiftRepository => findOne", () => {
  it("findOne => passed", async () => {
    const id = "0000-0000-000-000";

    const expectedData = new Shift();
    expectedData.id = id;
    expectedData.name = "Test Shift";
    expectedData.date = "2020-11-15";
    expectedData.startTime = "00:00:00";
    expectedData.endTime = "04:00:00";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedData),
      } as any);

    const result = await shiftRepository.findOne({
      id: id,
    });

    expect(result).toEqual(expectedData);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, Shift);
    expect(typeorm.getRepository(Shift).findOne).toHaveBeenNthCalledWith(
      1,
      { id },
      undefined
    );
  });
});

describe("shiftRepository => create", () => {
  it("create => passed", async () => {
    const payload = new Shift();
    payload.name = "Test Shift";
    payload.date = "2020-11-15";
    payload.startTime = "00:00:00";
    payload.endTime = "04:00:00";

    const expectedResult = {
      id: "0000-0000-0000-0000",
      name: "Test Shift",
      date: "2020-11-15",
      startTime: "00:00:00",
      endTime: "04:00:00",
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        save: jest.fn().mockResolvedValue(expectedResult),
      } as any);

    const result = await shiftRepository.create(payload);

    expect(result).toEqual(expectedResult);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, Shift);
    expect(typeorm.getRepository(Shift).save).toHaveBeenNthCalledWith(
      1,
      payload
    );
  });
});

describe("shiftRepository => updateById", () => {
  it("updateById => passed", async () => {
    const id = "0000-0000-000-000";
    
    const payload = {
      name: "Updated Shift",
      date: "2024-01-01",
      startTime: "01:00:00",
      endTime: "05:00:00",
    };

    const updatedShift = new Shift();
    updatedShift.id = id;
    updatedShift.name = payload.name;
    updatedShift.date = payload.date;
    updatedShift.startTime = payload.startTime;
    updatedShift.endTime = payload.endTime;

    const mockRepository = {
      update: jest.fn().mockResolvedValue(undefined),
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue(mockRepository as any);

    const findByIdSpy = jest
      .spyOn(shiftRepository, "findById")
      .mockResolvedValue(updatedShift);

    const result = await shiftRepository.updateById(id, payload);

    expect(getRepositorySpy).toHaveBeenCalledWith(Shift);
    expect(mockRepository.update).toHaveBeenCalledWith(id, payload);

    expect(findByIdSpy).toHaveBeenCalledWith(id);

    expect(result).toEqual(updatedShift);
  });
});

describe("shiftRepository => deleteById", () => {
  it("deleteById => passed", async () => {
    const id = "0000-0000-000-000";

    const deleteResult = { affected: 1 };

    const mockRepository = {
      delete: jest.fn().mockResolvedValue(deleteResult),
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue(mockRepository as any);

    const result = await shiftRepository.deleteById(id);

    expect(getRepositorySpy).toHaveBeenCalledWith(Shift);
    expect(mockRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(deleteResult);
  });
});

describe("shiftRepository => checkForOverlapShift", () => {
  it("true if clashing => passed", async () => {
    const date = "2024-01-01";
    const startTime = "09:00:00";
    const endTime = "17:00:00";
    const excludeId = "0000-0000-000-000";

    const getCountMock = jest.fn().mockResolvedValue(1);

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: getCountMock,
    };

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue(mockRepository as any);

    const result = await shiftRepository.checkForOverlapShift(date, startTime, endTime, excludeId);

    expect(getRepositorySpy).toHaveBeenCalledWith(Shift);
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("shift");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith("shift.date = :date", { date });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "((shift.startTime < :endTime AND shift.endTime > :startTime))",
      { startTime, endTime }
    );
    if (excludeId) {
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("shift.id != :excludeId", { excludeId });
    }
    expect(getCountMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("false if not clashing => passed", async () => {
    const date = "2024-01-01";
    const startTime = "09:00:00";
    const endTime = "17:00:00";

    const getCountMock = jest.fn().mockResolvedValue(0);

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: getCountMock,
    };

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue(mockRepository as any);

    const result = await shiftRepository.checkForOverlapShift(date, startTime, endTime);

    expect(getRepositorySpy).toHaveBeenCalledWith(Shift);
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("shift");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith("shift.date = :date", { date });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "((shift.startTime < :endTime AND shift.endTime > :startTime))",
      { startTime, endTime }
    );
    expect(getCountMock).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});

describe("shiftRepository => createShiftAndWeek", () => {
  it("createShiftAndWeek => passed", async () => {
    const payload = new Shift();
    payload.id = "0000-0000-000-000";
    payload.name = "Test Shift";
    payload.date = "2024-01-01";
    payload.startTime = "09:00:00";
    payload.endTime = "17:00:00";

    const startOfWeek = "2024-01-01";
    const endOfWeek = "2024-01-07";

    const week = new Week(startOfWeek, endOfWeek);

    const saveMock = jest.fn().mockResolvedValue(payload);

    const mockManager = {
      transaction: jest.fn().mockImplementation(async (callback) => {
        const transactionalEntityManager = {
          save: saveMock,
        };
        return callback(transactionalEntityManager);
      }),
    };

    const getManagerSpy = jest.spyOn(typeorm, "getManager").mockReturnValue(mockManager as any);

    const result = await shiftRepository.createShiftAndWeek(payload, startOfWeek, endOfWeek);

    expect(getManagerSpy).toHaveBeenCalled();
    expect(mockManager.transaction).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalledWith(week);
    expect(saveMock).toHaveBeenCalledWith(payload);
    expect(result).toEqual(payload);
  });
});





