import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as weekRepository from "../database/default/repository/weekRepository";
import { FindManyOptions, FindOneOptions, In } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift } from "../shared/interfaces";
import { HttpError } from "../shared/classes/HttpError";
import { getStartAndEndOfWeek } from "../shared/functions";
import Week from "../database/default/entity/week";
import { isTimeAfter } from "../shared/functions/isTimeAfter";

export const find = async (opts: FindManyOptions<Shift>): Promise<Shift[]> => {
  return shiftRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<Shift> => {
  if (!isTimeAfter(payload.startTime, payload.endTime)) {
    throw new HttpError(400, 'End time must be after start time.');
  }

  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  const isOverLap = await shiftRepository.checkForOverlapShift(payload.date, payload.startTime, payload.endTime);

  if (isOverLap) {
    throw new HttpError(409, 'The new shift clashing with an existing shift.');
  }

  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(payload.date)

  const week = await weekRepository.findOne({
    where: { startDate: startOfWeek, endDate: endOfWeek },
  })

  if(week){
    if(week.isPublished){
      throw new HttpError(400, 'Cannot create shift in published week');
    }

    shift.week = week;

    return shiftRepository.create(shift);
  }else{
    return shiftRepository.createShiftAndWeek(shift, startOfWeek, endOfWeek);
  }
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {

  const shift = await shiftRepository.findById(id);
  
  if(!shift){
    throw new HttpError(400, 'Shift not found');
  }

  if(shift.week && shift.week.isPublished){
    throw new HttpError(400, 'Unable to update published shifts');
  }

  if(payload.startTime){
    shift.startTime = payload.startTime
  }

  if(payload.endTime){
    shift.endTime = payload.endTime
  }

  if (!isTimeAfter(shift.startTime, shift.endTime)) {
    throw new HttpError(400, 'End time must be after start time.');
  }

  if(payload.date){
    shift.date = payload.date

    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(payload.date)

    let week = await weekRepository.findOne({
      where: { startDate: startOfWeek, endDate: endOfWeek },
    })

    if(week){
      if(week.isPublished){
        throw new HttpError(400, 'Cannot update shift to published week');
      }
  
      payload.week = week;
    }else{
      week = await weekRepository.create(new Week(startOfWeek, endOfWeek))
      payload.week = week;
    }
  }

  const isOverLap = await shiftRepository.checkForOverlapShift(shift.date, shift.startTime, shift.endTime, shift.id);

  if (isOverLap) {
    throw new HttpError(409, 'The shift clashing with an existing shift.');
  }

  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string) => {
  const shift = await shiftRepository.findById(id);

  if(!shift){
    throw new HttpError(400, 'Shift not found');
  }

  if(shift.week && shift.week.isPublished){
    throw new HttpError(400, 'Unable delete published shift');
  }
  return shiftRepository.deleteById(id);
};
