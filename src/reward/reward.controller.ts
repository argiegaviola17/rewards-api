/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { query } from 'express';
import { RewardService } from './reward.service';
export interface ReqQuery {
    pageNumber: number; 
    count: number;
}
@Controller("reward")
export class RewardController { 
    constructor(
        private readonly rewardService: RewardService,
    ) {}

    @Get("all")
    getAllRewards(@Query() body: ReqQuery) {
        console.log("query: ",body);
        return this.rewardService.findAll(body)
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
