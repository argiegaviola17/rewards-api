/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Reward, RewardDocument } from 'src/schemas/reward.schema';
import { REWARD_DEFAULT_DATA } from './reward.default.data';

@Injectable()
export class RewardService {
  
    
    constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  
    async findAll(): Promise<Reward[]> {
      return this.rewardModel.find().exec();
    }

    async initData() {
         
        const data = await this.findAll();
 
        if(data.length === 0){
            for(const data of REWARD_DEFAULT_DATA){
                const createdReward = new this.rewardModel(data);
                await createdReward.save();
            }
        }
    } 

    findItem(id: any): Promise<Reward> {
        return this.rewardModel.findById(id).exec();
    }

    async redeem(id: any, versionNo: any) {
        
        let item = null;
        try{
            item = await this.rewardModel.findById(id).exec();
        }catch(err){}

        if(!item){
            throw new HttpException("Reward item not found!",HttpStatus.BAD_REQUEST);
        }
        if(item.quantity > 0){
            item.quantity --;
        } else {
            throw new HttpException("No more item to redeem",HttpStatus.BAD_REQUEST);
        }
        item.__v = versionNo;
        try{
            await item.save();
            return item;
        }catch(error){
            if(error.toString().includes("VersionError")){
                throw new HttpException("Version Number Mistmatch , please refresh the page",HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
        
    }

}
