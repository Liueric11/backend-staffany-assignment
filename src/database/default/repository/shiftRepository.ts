import {
  getRepository,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
  DeleteResult,
  getManager,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import Shift from "../entity/shift";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Week from "../entity/week";

const logger = moduleLogger("shiftRepository");

export const find = async (opts?: FindManyOptions<Shift>): Promise<Shift[]> => {
  logger.info("Find", opts);
  const repository = getRepository(Shift);
  const data = await repository.find({
    ...opts,
    relations: ["week"]
  });
  return data;
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find by id");
  const repository = getRepository(Shift);
  const data = await repository.findOne(id, {
    ...opts,
    relations: ["week"],
  });
  return data;
};

export const findOne = async (
  where?: FindConditions<Shift>,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find one");
  const repository = getRepository(Shift);
  const data = await repository.findOne(where, opts);
  return data;
};

export const create = async (payload: Shift): Promise<Shift> => {
  logger.info("Create");
  const repository = getRepository(Shift);
  const newdata = await repository.save(payload);
  return newdata;
};

export const updateById = async (
  id: string,
  payload: QueryDeepPartialEntity<Shift>
): Promise<Shift> => {
  logger.info("Update by id");
  const repository = getRepository(Shift);
  await repository.update(id, payload);
  return findById(id);
};

export const deleteById = async (
  id: string | string[]
): Promise<DeleteResult> => {
  logger.info("Delete by id");
  const repository = getRepository(Shift);
  return await repository.delete(id);
};

export const checkForOverlapShift = async (
  date: String, 
  startTime: String,
  endTime: String,
  excludeId?: string
): Promise<boolean> => {

  const repository = getRepository(Shift);

  const query = repository
    .createQueryBuilder("shift")
    .where("shift.date = :date", { date })
    .andWhere(
      "((shift.startTime < :endTime AND shift.endTime > :startTime))",
      {
        startTime,
        endTime,
      }
    );

  if (excludeId) {
    query.andWhere("shift.id != :excludeId", { excludeId });
  }

  const overlapExists = await query.getCount();

  return overlapExists > 0;
};

export const createShiftAndWeek = async (payload: Shift, startOfWeek: string, endOfWeek: string): Promise<Shift> => {
  logger.info("Create shift and week");
  const manager = getManager();

  return manager.transaction(async (transactionalEntityManager) => {
    const week = new Week(startOfWeek, endOfWeek);
    await transactionalEntityManager.save(week);
    
    payload.week = week;
    await transactionalEntityManager.save(payload);
    return payload;
  });
};

