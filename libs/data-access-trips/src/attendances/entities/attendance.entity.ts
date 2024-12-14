import { TripEntity } from '@libs/data-access-trips/trips';
import { UserEntity } from '@libs/data-access-users';
import { TripAttendance } from '@prisma/client';

export class AttendanceEntity implements TripAttendance {
  constructor(partial: Partial<AttendanceEntity>) {
    Object.assign(this, partial);
  }

  tripId: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;

  user?: UserEntity;
  trip?: TripEntity;
}
