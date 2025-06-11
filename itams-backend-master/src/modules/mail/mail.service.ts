import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AdminEntity from 'src/models/entities/admin.entity';
import Asset from 'src/models/entities/asset.entity';
import License from 'src/models/entities/license.entity';
import Service from 'src/models/entities/service.entity';
import UserEntity from 'src/models/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserAcceptRequest(user: UserEntity, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request accept',
      template: 'accept',
      context: {
        type: 'Asset',
        name: user.name,
        id: asset.id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendUserRejectRequest(user: UserEntity) {
    const url = `${this.configService.get('FRONTEND')}/request-asset`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request reject',
      template: 'reject',
      context: {
        type: 'Asset',
        name: user.name,
        url,
      },
    });
  }

  async sendUserCheckoutAsset(user: UserEntity, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Checkout asset',
      template: 'checkout',
      context: {
        name: user.name,
        asset_id: asset.id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendAdminRequestAsset(user: UserEntity, admin: AdminEntity) {
    const url = `${this.configService.get('ADMIN')}/request-assets`;

    await this.mailerService.sendMail({
      to: admin?.email,
      subject: 'Request accept',
      template: 'request',
      context: {
        user_name: user.name,
        user_id: user.id,
        url,
      },
    });
  }

  async sendUserAcceptRequestLicense(user: UserEntity, license: License) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request accept',
      template: 'accept',
      context: {
        type: 'License',
        name: user.name,
        id: license.id,
        asset_name: license.name,
        url,
      },
    });
  }

  async sendUserRejectRequestLicense(user: UserEntity) {
    const url = `${this.configService.get('FRONTEND')}/request-license`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request reject',
      template: 'reject',
      context: {
        type: 'License',
        name: user.name,
        url,
      },
    });
  }

  async sendAdminRequestLicense(user: UserEntity, admin: AdminEntity) {
    const url = `${this.configService.get('ADMIN')}/request-licenses`;

    await this.mailerService.sendMail({
      to: admin?.email,
      subject: 'Request accept',
      template: 'request',
      context: {
        type: 'License',
        user_name: user.name,
        user_id: user.id,
        url,
      },
    });
  }

  async sendUserAcceptRequestService(user: UserEntity, service: Service) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request accept',
      template: 'accept',
      context: {
        type: 'Service',
        name: user.name,
        id: service.id,
        asset_name: service.name,
        url,
      },
    });
  }

  async sendUserRejectRequestService(user: UserEntity) {
    const url = `${this.configService.get('FRONTEND')}/request-service`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request reject',
      template: 'reject',
      context: {
        type: 'Service',
        name: user.name,
        url,
      },
    });
  }

  async sendAdminRequestService(user: UserEntity, admin: AdminEntity) {
    const url = `${this.configService.get('ADMIN')}/request-services`;

    await this.mailerService.sendMail({
      to: admin?.email,
      subject: 'Request accept',
      template: 'request',
      context: {
        user_name: user.name,
        user_id: user.id,
        url,
      },
    });
  }

  async sendLicenseUpdate(
    user: UserEntity,
    license: License,
    outgoingDeps: Array<{ name: string; version: string }>,
    incomingDeps: Array<{ name: string; version: string }>,
  ) {
    const frontendUrl = this.configService.get('FRONTEND') || '';

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'License Update',
      template: 'license-update',
      context: {
        name: user.name,
        license_name: license.name,
        license_version: license.version,
        outgoingDeps,
        incomingDeps,
        frontendUrl,
      },
    });
  }

  async sendServiceUpdate(
    user: UserEntity,
    service: Service,
    outgoingDeps: Array<{ name: string; version: string }>,
    incomingDeps: Array<{ name: string; version: string }>,
  ) {
    const frontendUrl = this.configService.get('FRONTEND') || '';

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Service Update',
      template: 'service-update', 
      context: {
        name: user.name,
        service_name: service.name,
        service_version: service.version,
        outgoingDeps,
        incomingDeps,
      },
    });
  }
}
