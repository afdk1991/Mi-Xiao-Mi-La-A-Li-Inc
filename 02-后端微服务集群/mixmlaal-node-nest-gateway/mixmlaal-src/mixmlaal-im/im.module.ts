import { Module } from '@nestjs/common';
import { ImGateway } from './im.gateway';

@Module({
  providers: [ImGateway],
})
export class ImModule {}
