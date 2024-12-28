import { Server } from '@hapi/hapi';
import * as shiftController from './weekController';
import { startDateDto } from '../../../shared/dtos';

export default function (server: Server, basePath: string) {
  server.route({
    method: "PATCH",
    path: basePath + "/{startDate}",
    handler: shiftController.publishWeek,
    options: {
      description: 'Publish shift week',
      notes: 'Publish shift week from start of week (monday)',
      tags: ['api', 'week'],
      validate: {
        params: startDateDto,
      },
    }
  });

  server.route({
    method: "GET",
    path: basePath + "/{startDate}",
    handler: shiftController.getByStartDate,
    options: {
      description: 'Publish shift week',
      notes: 'Publish shift week from start of week (monday)',
      tags: ['api', 'week'],
      validate: {
        params: startDateDto,
      },
    }
  });
}