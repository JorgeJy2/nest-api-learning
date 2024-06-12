import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Data base connected!');
  }


  create(createProductDto: CreateProductDto) {
    // return 'This action adds a new product';
    // return createProductDto;
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalRows = await this.product.count( {where: {available: true}});
    const lastPage = Math.ceil(totalRows / limit);



    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {available: true}
      }),
      meta: {
        page,
        total: totalRows,
        lastPage
      }
    };

    // return `This action returns all products`;
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found.`);
    }
    return product;


    // return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    return this.product.update(
      {
        where: {
          id
        },
        data: updateProductDto
      }
    )
    // return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    
    await this.findOne(id);

    //HARD DELETE

    // return this.product.delete({
    //   where: {
    //     id
    //   }
    // });


    
    const product = await this.product.update({
      where:{
        id
      }, 
      data: {
        available: false
      }
    });

    return product;

    // return `This action removes a #${id} product`;



  }
}
