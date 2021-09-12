import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module, NestModule, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from 'src/schemas/reward.schema';
import { MiddlewareBuilder } from '@nestjs/core';

@Module({
    imports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }])],
    controllers: [
        RewardController,],
    providers: [
        RewardService,],
    exports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }])],
})
export class RewardModule   implements NestModule, OnModuleInit {
    constructor(
        private readonly rewardService: RewardService,
      ){}
      
    
    async onModuleInit() {
        await this.rewardService.initData();
    }
    
    public configure(consumer: MiddlewareBuilder) {
        //
    }
}
