import {
  getRepository,
  FindOneOptions,
} from "typeorm";
import Week from "../entity/week";
import moduleLogger from "../../../shared/functions/logger";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const logger = moduleLogger("weekRepository");

export const findOne = async (opts?: FindOneOptions<Week>): Promise<Week> => {
  const repository = getRepository(Week);
  const data = await repository.findOne(opts);
  return data;
};

export const create = async (payload: Week): Promise<Week> => {
  logger.info("Create");
  const repository = getRepository(Week);
  const newdata = await repository.save(payload);
  return newdata;
};

export const updateById = async (
  week: Week,
  payload: QueryDeepPartialEntity<Week>
): Promise<Week> => {
  logger.info("Update by id");
  const repository = getRepository(Week);
  await repository.update(week.id, payload);
  return week;
};