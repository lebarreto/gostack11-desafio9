import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
  name?: string;
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
    const checkIfCustomerExists = await this.customersRepository.findById(
      customer_id,
    );

    if (!checkIfCustomerExists) {
      throw new AppError('This customer does not exists.', 400);
    }

    const requestedProductIds = products.map(requestedProduct => ({
      id: requestedProduct.id,
    }));

    const checkIfProductExists = await this.productsRepository.findAllById(
      requestedProductIds,
    );

    if (!checkIfProductExists) {
      throw new AppError('This product does not exists.', 400);
    }

    const checkProductAvailability =
      products.length === checkIfProductExists.length;

    if (!checkProductAvailability) {
      throw new AppError('This product is not available.');
    }

    const productUpdated: IProduct[] = [];

    const order = checkIfProductExists.map(product => {
      const i = products.findIndex(index => index.id === product.id);
      const cart = products[i];

      if (cart.quantity > product.quantity) {
        throw new AppError('This product is not in the stock');
      }

      productUpdated.push({
        id: product.id,
        quantity: product.quantity - cart.quantity,
      });

      return {
        product_id: product.id,
        price: product.price,
        quantity: cart.quantity,
      };
    });

    await this.productsRepository.updateQuantity(productUpdated);

    const product = await this.ordersRepository.create({
      customer: checkIfCustomerExists,
      products: order,
    });

    return product;
  }
}

export default CreateProductService;
