import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({
    optimisticConcurrency: true,
})
export class Reward {
 

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({ required: true })
    quantity: number;
  
}

export const RewardSchema = SchemaFactory.createForClass(Reward);