import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProductCard } from './product-card';
import { Pagination } from './pagination';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  span?: 'full' | 'wide';
}

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, Pagination],
  host: { class: 'block w-full' },
})
export class ProductGrid {
  readonly products: Product[] = [
    {
      id: 1,
      name: 'Walnut Artisan Keyboard',
      description: 'Solid American walnut chassis with tactile mechanical switches.',
      price: '$420.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
    },
    {
      id: 2,
      name: 'RTX Studio Core',
      description: 'Industrial-grade processing for rendering and deep learning.',
      price: '$1,299.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
    },
    {
      id: 3,
      name: 'Horizon Display 38"',
      description: 'Ultrawide curved panel with 99.9% sRGB color accuracy.',
      price: '$1,150.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
    },
    {
      id: 4,
      name: 'Vocalist Pro Mic',
      description: 'Broadcast-quality dynamic cardioid for professional audio.',
      price: '$399.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
    },
    {
      id: 5,
      name: 'Sage Studio Vessel',
      description: 'Hand-thrown stoneware for studio essentials or flora.',
      price: '$85.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
    },
    {
      id: 6,
      name: 'Craftsman Oak Desk',
      description: 'Solid white oak with integrated cable management and concealed drawers.',
      price: '$2,450.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      span: 'wide',
    },
  ];
}
