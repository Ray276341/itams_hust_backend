import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { NotificationService } from './notification.service';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllNotifications() {
    return await this.notificationService.getAllNotifications();
  }
}
