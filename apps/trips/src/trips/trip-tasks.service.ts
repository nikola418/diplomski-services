import { TripService } from '@libs/data-access-trips';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripTasksService {
  constructor(private readonly tripService: TripService) {}

  private readonly logger = new Logger(TripTasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS) //! CHANGE THIS - FOR DEMO ONLY
  public async markFinishedTrips() {
    this.logger.log(`Mark trips as finished cron job called`);
    const { count } = await this.tripService.updateMany(
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
