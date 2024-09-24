import { Injectable } from '@nestjs/common';
import { Prisma, TripAttendance } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}
  private static readonly include: Prisma.TripAttendanceInclude = {
    user: true,
  };

  public upsert(
    tripId: string,
    userId: string,
    include: Prisma.TripAttendanceInclude = AttendanceService.include,
  ): Promise<TripAttendance> {
    return this.prisma.tripAttendance.upsert({
      where: { tripId_userId: { tripId, userId } },
      create: { tripId, userId },
      update: {},
      include,
    });
  }

  public findAll(
    tripId: string,
    include: Prisma.TripAttendanceInclude = AttendanceService.include,
  ): Promise<TripAttendance[]> {
    return this.prisma.tripAttendance.findMany({ where: { tripId }, include });
  }

  public findOne(tripId: string, userId: string): Promise<TripAttendance> {
    return this.prisma.tripAttendance.findUniqueOrThrow({
      where: { tripId_userId: { tripId, userId } },
    });
  }

  public remove(tripId: string, userId: string): Promise<TripAttendance> {
    return this.prisma.tripAttendance.delete({
      where: { tripId_userId: { tripId, userId } },
    });
  }
}
