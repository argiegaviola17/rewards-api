/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import BigNumber from 'bignumber.js';
import { ClientSession, Model } from 'mongoose';
import { Reward, RewardDocument } from 'src/schemas/reward.schema';
import { ReqQuery } from './reward.controller';
import { REWARD_DEFAULT_DATA } from './reward.default.data';

@Injectable()
export class RewardService {
  
    
    constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

    parseAndGet(body: ReqQuery){
        let pageNumber = 0;
        try{
            pageNumber = new BigNumber( body.pageNumber).toNumber();
        }catch(err){}

        let nPerPage = 3;
        try {
            nPerPage = new BigNumber(body.count).toNumber();
        } catch(err){}
        return { pageNumber, nPerPage };
    }
  
    async findAll(body: ReqQuery) {
        let { pageNumber, nPerPage } = this.parseAndGet(body)
        pageNumber = pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0
        nPerPage = nPerPage + 1;
        console.log(pageNumber);
        console.log(nPerPage);
        const items = await this.rewardModel.find().sort( { createdOn: 1 } )
             .skip( pageNumber )
             .limit( nPerPage   ).exec()
        let hasNext = "N";
        if(items.length > body.count ){
            hasNext = "Y";
            items.pop();
        }
        return { items,  hasNext };
    }

    async initData() {
         
        const data = await this.rewardModel.count();
 
        if(data === 0){
            for(const data of REWARD_DEFAULT_DATA){
                const createdReward = new this.rewardModel(data);
                createdReward.createdOn = (new Date()).getTime();
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
