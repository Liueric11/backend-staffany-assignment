import { Request, ResponseToolkit } from "@hapi/hapi";
import * as weekUsecase from "../../../usecases/weekUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ISuccessResponse,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("weekController");

export const publishWeek = async (req: Request, h: ResponseToolkit) => {
  logger.info("publish week");
  try {
    const startDate = req.params.startDate;

    const data = await weekUsecase.publishWeek(startDate);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Publish week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const getByStartDate = async (req: Request, h: ResponseToolkit) => {
  logger.info("get shifts by start date");
  try {
    const startDate = req.params.startDate;

    const data = await weekUsecase.getAllShift(startDate);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};
