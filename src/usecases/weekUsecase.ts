import * as weekRepository from "../database/default/repository/weekRepository";
import * as shiftRepository from "../database/default/repository/shiftRepository";
import Week from "../database/default/entity/week";
import { HttpError } from "../shared/classes/HttpError";
import Shift from "../database/default/entity/shift";

export const publishWeek = async (startDate: string): Promise<Week> => {
  const week = await weekRepository.findOne({
    where: { startDate: startDate },
  });

  if (week) {
    if (week.isPublished) {
      throw new HttpError(400, "This week it has been published");
    }

    week.isPublished = true;
    week.publishedAt = new Date();

    return weekRepository.updateById(week, {
      isPublished: week.isPublished,
      publishedAt: week.publishedAt,
    });
  } else {
    throw new HttpError(400, "There are no shifts this week");
  }
};

export const getAllShift = async (startDate: string): Promise<Shift[]> => {
  const week = await weekRepository.findOne({
    where: { startDate: startDate },
  });

  if(!week){
    return [];
  }

  return shiftRepository.find({
    order: { date: "DESC", startTime: "ASC" },
    where: {
      week: week.id,
    },
  });
};
