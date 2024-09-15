import { TripsService } from '@libs/data-access-trips';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripTasksService {
  constructor(private readonly tripsService: TripsService) {}

  private readonly logger = new Logger(TripTasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async markFinishedTrips() {
    this.logger.log(`Mark trips as finished cron job called`);
    const { count } = await this.tripsService.updateMany(
      {
        scheduledDateTime: {
          lt: new Date(),
        },
      },
      { tripStatus: TripStatus.Finished },
    );
    this.logger.log(`${count} trips marked as finished`);
  }
}
