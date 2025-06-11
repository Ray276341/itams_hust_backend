import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { RelationshipDto } from './dtos/relationship.dto';
import { RelationshipService } from './relationship.service';

@ApiTags('relationship')
@Controller('relationship')
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllRelationships() {
    return await this.relationshipService.getAllRelationships();
  }

  @Get('get-relationship-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async geRelationshipById(@Param('id', ParseIntPipe) id: number) {
    return await this.relationshipService.getRelationshipById(id);
  }

  @Post('create-relationship')
  @UseGuards(JwtAdminAuthGuard)
  async createRelationship(@Body() relationshipDto: RelationshipDto) {
    return await this.relationshipService.createNewRelationship(relationshipDto);
  }

  @Put('update-relationship')
  @UseGuards(JwtAdminAuthGuard)
  async updateRelationship(
    @Body() relationshipDto: RelationshipDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.relationshipService.updateRelationship(id, relationshipDto);
  }

  @Delete('delete-relationship')
  @UseGuards(JwtAdminAuthGuard)
  async deleteRelationship(@Body('id', ParseIntPipe) id: number) {
    return await this.relationshipService.deleteRelationship(id);
  }
}
