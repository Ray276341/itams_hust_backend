import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAllAuthGuard extends AuthGuard(['jwt', 'jwt-admin']) {}
