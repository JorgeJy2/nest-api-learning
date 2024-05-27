import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsString()
    public name:String;
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @IsPositive()
    @Type(()=>Number)
    public price: String;

}
