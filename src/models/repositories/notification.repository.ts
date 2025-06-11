import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

export class NotificationRepository extends Repository<Notification> {}
