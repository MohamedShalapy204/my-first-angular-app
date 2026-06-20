import { Component, type ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestChild } from '../test-child/test-child';
import { ApiProducts } from '../../services/api-products';
import type { Iproduct } from '../../models/iproduct';
import { ProductGrid } from '../../pages/products-gallery/product-grid';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { decrement, increment } from '../../store/counter/counter.action';

@Component({
  selector: 'app-test',
  imports: [TestChild, ProductGrid, FormsModule, CommonModule],
  templateUrl: './test.html',
})
export class Test {
  private apiProductsService = inject(ApiProducts);
  products: Iproduct[] = [] as Iproduct[];
  totalOrderPrice = signal<number>(0);
  myInp = viewChild<ElementRef>('userNameInp');
  testChild = viewChild<TestChild>('testChild');

  newProduct: Iproduct = {} as Iproduct;

  successMessage = '';
  errorMessage = '';

  constructor() {
    console.log('constructor: ', this.myInp());
  }
  ngAfterViewInit() {
    this.myInp()!.nativeElement.value = 'hi';
    this.myInp()!.nativeElement.focus();
    console.log('ngAfterViewInit: ', this.myInp()?.nativeElement);
    console.log('ngAfterViewInit: ', this.testChild());
  }

  subscripTotalOrderPrice(totalOrderPrice: number) {
    this.totalOrderPrice.set(totalOrderPrice);
  }
  ngOnInit() {
    this.apiProductsService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
        console.log('new products ----', response);
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.apiProductsService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        this.successMessage = 'Product added successfully!';
        this.products = [...this.products, response];
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product: ' + (err.message || 'Unknown error');
        console.error(err);
      },
    });
  }

  resetForm() {
    this.newProduct = {} as Iproduct;
  }
  ////////////test store///////////////////
  private store = inject(Store<{ counter: number }>);
  counter$: Observable<number> = this.store.select('counter');
  increaseCounter(){
    this.store.dispatch({type: '[Counter] Increment'});
  }
  decreaseCounter(){
    this.store.dispatch({type: '[Counter] Decrement'});
  }
  resetCounter(){
    this.store.dispatch({ type: '[Counter] Reset' });
  }
}
