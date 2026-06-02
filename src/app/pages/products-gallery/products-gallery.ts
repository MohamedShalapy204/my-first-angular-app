import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { TranslationService } from '../../services/translation';
import { SidebarFilter } from './sidebar-filter';
import { ProductGrid } from './product-grid';
import { Iproduct } from '../../models/iproduct';
import { Icategory } from '../../models/icategory';

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
    { id: 1, name: 'Peripherals' },
    { id: 2, name: 'Components' },
    { id: 3, name: 'Displays' },
    { id: 4, name: 'Audio' },
    { id: 5, name: 'Accessories' },
    { id: 6, name: 'Furniture' },
  ];

  readonly allProducts: Iproduct[] = [
    // Peripherals (categoryId: 1)
    {
      id: 1,
      name: 'Walnut Artisan Keyboard',
      categoryId: 1,
      description: 'Solid American walnut chassis with tactile mechanical switches.',
      price: 420,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      count: 10,
    },
    {
      id: 2,
      name: 'Ergonomic Vertical Mouse',
      categoryId: 1,
      description: 'Wireless vertical mouse with adjustable DPI and silent clicks.',
      price: 89,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      count: 25,
    },
    {
      id: 3,
      name: 'Artisan Leather Wrist Rest',
      categoryId: 1,
      description: 'Full-grain leather wrist rest with memory foam core.',
      price: 65,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      count: 18,
    },
    {
      id: 4,
      name: 'Macro Pad Pro',
      categoryId: 1,
      description: 'Programmable 9-key macro pad with rotary encoder and OLED display.',
      price: 149,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1I8Efbm6uRKfWRIdzbdxd7wymdQSUtLKKbqyss0t2c60uFtvlvK37ztKSI25YkKutGcjd5vcGYYVJiax5kCbLfARjoS8YAj7rq1FDQ_pGl8OrNaU_AL238LBFCixdRXpwe7S0DxiTMhUFynYWTuqQvL9L16KNne95o-NvMCiJr1N50vvlQTXEB8jv49OgKbQDX3KEmp5BRN3Imc7FrP_Xw2MbN-iuQOTTQY-Yi2AKsAg93bfDB74s15kts2WDkRz6Tg4ImRHYTpv',
      count: 12,
    },

    // Components (categoryId: 2)
    {
      id: 5,
      name: 'RTX Studio Core',
      categoryId: 2,
      description: 'Industrial-grade processing for rendering and deep learning.',
      price: 1299,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      count: 5,
    },
    {
      id: 6,
      name: 'NVMe Gen5 SSD 2TB',
      categoryId: 2,
      description: 'Blazing fast storage with 12,000MB/s read speeds.',
      price: 249,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      count: 30,
    },
    {
      id: 7,
      name: 'DDR5 RAM Kit 64GB',
      categoryId: 2,
      description: 'High-performance memory running at 6000MHz CL30.',
      price: 189,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIh5MLDKddOu_DP9LS3dFfVGJCh1DKo2YliVCZCnftGaY7qR1yP1N4QIiJA-sZTF9XvcjkvNDJUHfJgAgJoNPs8PehEsi1umyDP3-ixhbKLb7iWqdtihskKaHoUMpooln7ZizfPMfyQzyjyWUCVerX9-jtDWuWhBzqqDSSts-kNTrRQ4yM_NbVwSxWpijTkVowUgamhoP5lqVbBGHX6fvyv3OvPdnLtyxme4QkzkdewR8xmENCC05V79iLcL15ov5F72Uii0t-pEu',
      count: 40,
    },

    // Displays (categoryId: 3)
    {
      id: 8,
      name: 'Horizon Display 38"',
      categoryId: 3,
      description: 'Ultrawide curved panel with 99.9% sRGB color accuracy.',
      price: 1150,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      count: 3,
    },
    {
      id: 9,
      name: 'Studio Monitor 27" 4K',
      categoryId: 3,
      description: 'IPS panel with factory-calibrated Delta E < 1 color accuracy.',
      price: 699,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      count: 8,
    },
    {
      id: 10,
      name: 'Portable USB-C Monitor 15"',
      categoryId: 3,
      description: 'Slim travel monitor with 100% DCI-P3 coverage.',
      price: 329,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro4RmJJIFoOKtBdc3c9VuFuU65HFD-7oMqUfzNeaWajlwR3DIWsKNj-uFrHkHuwxl9GBeJbcu5NBTFqhuJSYRmnRF7tcVzc9ihcqH4jXs-E0GeQHo5zM8lpZ_qNYT4evm71m8yZK8LrgLoDVqKgshMT9GB5EKzIQFRIYlO3vG3KuuzMiv_bs9BnM7ZmBlJtbLqMbNHklYgYgNgUP3RV3Z_zVsBoPJ4nWuM4mU0FiWG0hXF52i03CrVPOYr6T7CxkbQuxAcW91hv3M',
      count: 15,
    },

    // Audio (categoryId: 4)
    {
      id: 11,
      name: 'Vocalist Pro Mic',
      categoryId: 4,
      description: 'Broadcast-quality dynamic cardioid for professional audio.',
      price: 399,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      count: 8,
    },
    {
      id: 12,
      name: 'Studio Reference Headphones',
      categoryId: 4,
      description: 'Open-back planar magnetic headphones with 20-40kHz response.',
      price: 549,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      count: 6,
    },
    {
      id: 13,
      name: 'Desktop DAC/Amp Combo',
      categoryId: 4,
      description: 'ESS Sabre DAC with balanced XLR output and preamp functionality.',
      price: 299,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbhAAsz4D18JDoOo6yh_eE6iqRGKSOIYIZGeCyz6eM8V69aMa5cj6uj3ZgbLzhKByOELXS4VRRi48HSEmmK8Cylec0CdDq9PvQ_qZTflBjZNHEzxmHGnkw35ITGqcS7nCTxoHhL5td2D30QbmCXT8dhldIiTd1gsUgxU54Rls36t4zo3TyQcyVe93zbi4OpHw92Z7GWbVJ2-rsU-05Qh_MDiDGvj9KjR15siNiz21MtP3nMoj1oItcWcedW1OG6Zwhusx9G8C6OObG',
      count: 12,
    },

    // Accessories (categoryId: 5)
    {
      id: 14,
      name: 'Sage Studio Vessel',
      categoryId: 5,
      description: 'Hand-thrown stoneware for studio essentials or flora.',
      price: 85,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      count: 15,
    },
    {
      id: 15,
      name: 'Copper Cable Organizer',
      categoryId: 5,
      description: 'Weighted cable management system with magnetic cable clips.',
      price: 45,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      count: 50,
    },
    {
      id: 16,
      name: 'Desk Mat XL Wool Felt',
      categoryId: 5,
      description: 'Premium wool felt desk mat in charcoal grey, 900x400mm.',
      price: 79,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Q--CuTrA-vp_sIh1RWkvluE_P2THQU45COYxEN2CwAXVPH57K7sZAbKejG3dpxHsoT9674LyZ5n3I2UCAQXNfLDBJ1AGUJJdiQc_FiezBMy1K5RzTp0pojwGgkJt23T6ZPcwh6bDq8WMPg4qGsLCP9mZBovmvnjyH8ktx-J1qxMm0Q7tpLqQrRjiooVehmVzz2aLwATezD2lZnVQ0A6lTkyxv3yBjlIxOmmjufS_Z8IfSg1f9gGV88h1dW7WeWmJU7VEF2q_F6Q',
      count: 22,
    },

    // Furniture (categoryId: 6)
    {
      id: 17,
      name: 'Craftsman Oak Desk',
      categoryId: 6,
      description: 'Solid white oak with integrated cable management and concealed drawers.',
      price: 2450,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      count: 2,
    },
    {
      id: 18,
      name: 'Ergonomic Standing Desk',
      categoryId: 6,
      description: 'Dual-motor height adjustable desk with programmable presets.',
      price: 899,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      count: 7,
    },
    {
      id: 19,
      name: 'Studio Task Chair',
      categoryId: 6,
      description: 'Mesh back office chair with lumbar support and adjustable armrests.',
      price: 649,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      count: 4,
    },
    {
      id: 20,
      name: 'Monitor Arm Mount',
      categoryId: 6,
      description: 'Full motion aluminum monitor arm with cable routing, supports up to 32".',
      price: 179,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOl7xNqBsjsz7c_UahSN1sLJCvbV70OUzQoRZaw1dx9jcWsq40iYjWbnWXmu0DD9A3OKKcfI2fcc-EWKwmwRJJO8H7FLOBgA2E3gh1D-vYGy-boyX94yUGmtX5yQLhZlr2WsTFE1VGnNL9d44JqsItPmzc6Chv3xTRCqwfJlV3s3bseTV1EHF6qyt2zyd6o3FMGoFKftgLsmRqoV5TX4Y-7N8jOFwpiIsKojDiy7ncEXGY1MH6ijbS_B43hF93941BFxNf0Zbp3DK',
      count: 10,
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
      result = result.filter(p => p.categoryId === categoryId);
    }

    const min = this.minPrice();
    if (min !== null) {
      result = result.filter(p => p.price >= min);
    }

    const max = this.maxPrice();
    if (max !== null) {
      result = result.filter(p => p.price <= max);
    }

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
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
