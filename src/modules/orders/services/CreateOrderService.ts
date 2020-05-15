import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
  name: string;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // const checkIfCustomerExists = await this.customersRepository.findById(
    //   customer_id,
    // );
    // if (!checkIfCustomerExists) {
    //   throw new AppError('This customer does not exists.', 400);
    // }
    // const checkIfProductExists = await this.productsRepository.findByName(
    //   products[0].name,
    // );
    // if (!checkIfProductExists) {
    //   throw new AppError('This product does not exists.', 400);
    // }
    // const product = await this.ordersRepository.create({
    // });
    // return product;
  }
}

export default CreateProductService;
