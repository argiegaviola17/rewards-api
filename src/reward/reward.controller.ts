/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller("reward")
export class RewardController { 
    constructor(
        private readonly rewardService: RewardService,
    ) {}

    @Get("all")
    getAllRewards() {
        return this.rewardService.findAll();
    }

    @Get(":id")
    getReward(@Param("id") id) {
        return this.rewardService.findItem(id);
    }

    @Post("redeem")
    redeem(@Body() body: any){
        return this.rewardService.redeem(body.id, body.versionNo);
    }
}
