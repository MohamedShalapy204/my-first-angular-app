import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { TranslationService } from '../../services/translation';
import { SidebarFilter } from './sidebar-filter';
import { ProductGrid } from './product-grid';
import type { Iproduct } from '../../models/iproduct';
import type { Icategory } from '../../models/icategory';

@Component({
  selector: 'app-products-gallery',
  templateUrl: './products-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarFilter, ProductGrid],
  host: { class: 'block w-full' },
})
export class ProductsGallery {
  private readonly t = inject(TranslationService);

  readonly categories: Icategory[] = [
    { id: 1, name: 'Peripherals', created_at: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Components', created_at: '2024-01-01T00:00:00Z' },
    { id: 3, name: 'Displays', created_at: '2024-01-01T00:00:00Z' },
    { id: 4, name: 'Audio', created_at: '2024-01-01T00:00:00Z' },
    { id: 5, name: 'Accessories', created_at: '2024-01-01T00:00:00Z' },
    { id: 6, name: 'Furniture', created_at: '2024-01-01T00:00:00Z' },
  ];

  readonly allProducts: Iproduct[] = [
    // Peripherals (category_id: 1)
    {
      id: 1,
      name: 'Walnut Artisan Keyboard',
      category_id: 1,
      description: 'Solid American walnut chassis with tactile mechanical switches.',
      price: 420,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      stock: 10,
      rating: 4.5,
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      name: 'Ergonomic Vertical Mouse',
      category_id: 1,
      description: 'Wireless vertical mouse with adjustable DPI and silent clicks.',
      price: 89,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      stock: 25,
      rating: 4.2,
      is_active: true,
      created_at: '2024-01-16T14:20:00Z',
    },
    {
      id: 3,
      name: 'Artisan Leather Wrist Rest',
      category_id: 1,
      description: 'Full-grain leather wrist rest with memory foam core.',
      price: 65,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      stock: 18,
      rating: 4.8,
      is_active: true,
      created_at: '2024-01-17T09:15:00Z',
    },
    {
      id: 4,
      name: 'Macro Pad Pro',
      category_id: 1,
      description: 'Programmable 9-key macro pad with rotary encoder and OLED display.',
      price: 149,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      stock: 12,
      rating: 4.6,
      is_active: true,
      created_at: '2024-01-18T16:45:00Z',
    },

    // Components (category_id: 2)
    {
      id: 5,
      name: 'RTX Studio Core',
      category_id: 2,
      description: 'Industrial-grade processing for rendering and deep learning.',
      price: 1299,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      stock: 5,
      rating: 4.9,
      is_active: true,
      created_at: '2024-01-19T11:00:00Z',
    },
    {
      id: 6,
      name: 'NVMe Gen5 SSD 2TB',
      category_id: 2,
      description: 'Blazing fast storage with 12,000MB/s read speeds.',
      price: 249,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      stock: 30,
      rating: 4.7,
      is_active: true,
      created_at: '2024-01-20T08:30:00Z',
    },
    {
      id: 7,
      name: 'DDR5 RAM Kit 64GB',
      category_id: 2,
      description: 'High-performance memory running at 6000MHz CL30.',
      price: 189,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      stock: 40,
      rating: 4.4,
      is_active: true,
      created_at: '2024-01-21T13:15:00Z',
    },

    // Displays (category_id: 3)
    {
      id: 8,
      name: 'Horizon Display 38"',
      category_id: 3,
      description: 'Ultrawide curved panel with 99.9% sRGB color accuracy.',
      price: 1150,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      stock: 3,
      rating: 4.8,
      is_active: true,
      created_at: '2024-01-22T10:00:00Z',
    },
    {
      id: 9,
      name: 'Studio Monitor 27" 4K',
      category_id: 3,
      description: 'IPS panel with factory-calibrated Delta E < 1 color accuracy.',
      price: 699,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      stock: 8,
      rating: 4.6,
      is_active: true,
      created_at: '2024-01-23T15:30:00Z',
    },
    {
      id: 10,
      name: 'Portable USB-C Monitor 15"',
      category_id: 3,
      description: 'Slim travel monitor with 100% DCI-P3 coverage.',
      price: 329,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      stock: 15,
      rating: 4.3,
      is_active: true,
      created_at: '2024-01-24T12:45:00Z',
    },

    // Audio (category_id: 4)
    {
      id: 11,
      name: 'Vocalist Pro Mic',
      category_id: 4,
      description: 'Broadcast-quality dynamic cardioid for professional audio.',
      price: 399,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      stock: 8,
      rating: 4.7,
      is_active: true,
      created_at: '2024-01-25T09:00:00Z',
    },
    {
      id: 12,
      name: 'Studio Reference Headphones',
      category_id: 4,
      description: 'Open-back planar magnetic headphones with 20-40kHz response.',
      price: 549,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      stock: 6,
      rating: 4.9,
      is_active: true,
      created_at: '2024-01-26T14:30:00Z',
    },
    {
      id: 13,
      name: 'Desktop DAC/Amp Combo',
      category_id: 4,
      description: 'ESS Sabre DAC with balanced XLR output and preamp functionality.',
      price: 299,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      stock: 12,
      rating: 4.5,
      is_active: true,
      created_at: '2024-01-27T11:15:00Z',
    },

    // Accessories (category_id: 5)
    {
      id: 14,
      name: 'Sage Studio Vessel',
      category_id: 5,
      description: 'Hand-thrown stoneware for studio essentials or flora.',
      price: 85,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      stock: 15,
      rating: 4.4,
      is_active: true,
      created_at: '2024-01-28T16:00:00Z',
    },
    {
      id: 15,
      name: 'Copper Cable Organizer',
      category_id: 5,
      description: 'Weighted cable management system with magnetic cable clips.',
      price: 45,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      stock: 50,
      rating: 4.2,
      is_active: true,
      created_at: '2024-01-29T08:45:00Z',
    },
    {
      id: 16,
      name: 'Desk Mat XL Wool Felt',
      category_id: 5,
      description: 'Premium wool felt desk mat in charcoal grey, 900x400mm.',
      price: 79,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      stock: 22,
      rating: 4.6,
      is_active: true,
      created_at: '2024-01-30T13:30:00Z',
    },

    // Furniture (category_id: 6)
    {
      id: 17,
      name: 'Craftsman Oak Desk',
      category_id: 6,
      description: 'Solid white oak with integrated cable management and concealed drawers.',
      price: 2450,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      stock: 2,
      rating: 4.9,
      is_active: true,
      created_at: '2024-01-31T10:00:00Z',
    },
    {
      id: 18,
      name: 'Ergonomic Standing Desk',
      category_id: 6,
      description: 'Dual-motor height adjustable desk with programmable presets.',
      price: 899,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      stock: 7,
      rating: 4.5,
      is_active: true,
      created_at: '2024-02-01T14:15:00Z',
    },
    {
      id: 19,
      name: 'Studio Task Chair',
      category_id: 6,
      description: 'Mesh back office chair with lumbar support and adjustable armrests.',
      price: 649,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      stock: 4,
      rating: 4.7,
      is_active: true,
      created_at: '2024-02-02T09:30:00Z',
    },
    {
      id: 20,
      name: 'Monitor Arm Mount',
      category_id: 6,
      description: 'Full motion aluminum monitor arm with cable routing, supports up to 32".',
      price: 179,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      stock: 10,
      rating: 4.3,
      is_active: true,
      created_at: '2024-02-03T11:45:00Z',
    },
  ];

  readonly activeCategoryId = signal<number | null>(null);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly searchTerm = signal('');
  readonly sortTerm = signal('newest');

  readonly filteredProducts = computed(() => {
    let result = [...this.allProducts];

    const categoryId = this.activeCategoryId();
    if (categoryId !== null) {
      result = result.filter((p) => p.category_id === categoryId);
    }

    const min = this.minPrice();
    if (min !== null) {
      result = result.filter((p) => p.price >= min);
    }

    const max = this.maxPrice();
    if (max !== null) {
      result = result.filter((p) => p.price <= max);
    }

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search),
      );
    }

    const sort = this.sortTerm();
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  });

  onCategoryChange(categoryId: number | null) {
    this.activeCategoryId.set(categoryId);
  }

  onPriceChange(price: { min: number | null; max: number | null }) {
    this.minPrice.set(price.min);
    this.maxPrice.set(price.max);
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  onSortChange(sort: string) {
    this.sortTerm.set(sort);
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }
}
