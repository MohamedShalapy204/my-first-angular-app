import { Injectable, inject } from '@angular/core';
import { SettingsService, Lang } from './settings';

export type TranslationKey =
  | 'nav.shop'
  | 'nav.story'
  | 'nav.search'
  | 'footer.brand'
  | 'footer.collections'
  | 'footer.keyboards'
  | 'footer.hardware'
  | 'footer.audio'
  | 'footer.explore'
  | 'footer.story'
  | 'footer.journal'
  | 'footer.contact'
  | 'footer.support'
  | 'footer.shipping'
  | 'footer.returns'
  | 'footer.privacy'
  | 'footer.copyright'
  | 'footer.instagram'
  | 'footer.pinterest'
  | 'home.hero.title'
  | 'home.hero.cta'
  | 'home.philosophy'
  | 'home.story.quote'
  | 'home.story.highlight'
  | 'home.story.description'
  | 'home.collections'
  | 'home.viewAll'
  | 'home.category.keyboards'
  | 'home.category.keyboards.sub'
  | 'home.category.hardware'
  | 'home.category.hardware.sub'
  | 'home.category.audio'
  | 'home.category.audio.sub'
  | 'home.featured.badge'
  | 'home.featured.title'
  | 'home.featured.description'
  | 'home.featured.cta'
  | 'home.newsletter.title'
  | 'home.newsletter.description'
  | 'home.newsletter.cta'
  | 'gallery.title'
  | 'gallery.description'
  | 'bag.title'
  | 'bag.subtitle'
  | 'bag.checkout'
  | 'bag.promo'
  | 'bag.apply'
  | 'bag.subtotal'
  | 'bag.shipping'
  | 'bag.tax'
  | 'bag.total'
  | 'product.addToBag'
  | 'product.customize'
  | 'product.reviews'
  | 'product.collection'
  | 'product.foundation'
  | 'product.engineering'
  | 'product.voices'
  | 'profile.savedSetups'
  | 'profile.viewAll'
  | 'profile.viewSetup'
  | 'profile.orderHistory'
  | 'profile.account'
  | 'profile.concierge'
  | 'profile.contactAdvisor';

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    'nav.shop': 'Shop',
    'nav.story': 'Story',
    'nav.search': 'Search',
    'footer.brand': 'Curating premium developer environments and digital sanctuaries since 2024.',
    'footer.collections': 'Collections',
    'footer.keyboards': 'Keyboards',
    'footer.hardware': 'Hardware',
    'footer.audio': 'Audio',
    'footer.explore': 'Explore',
    'footer.story': 'Story',
    'footer.journal': 'Journal',
    'footer.contact': 'Contact',
    'footer.support': 'Support',
    'footer.shipping': 'Shipping',
    'footer.returns': 'Returns',
    'footer.privacy': 'Privacy',
    'footer.copyright': '© 2024 Studio Monograph. All Rights Reserved.',
    'footer.instagram': 'Instagram',
    'footer.pinterest': 'Pinterest',
    'home.hero.title': 'The Focused Workspace',
    'home.hero.cta': 'Shop Now',
    'home.philosophy': 'Our Philosophy',
    'home.story.quote': 'Meticulously crafted for the',
    'home.story.highlight': 'digital craftsman',
    'home.story.description': 'At Lumina Studio, we believe the workspace is a sanctuary of deep work. Every component in our collection is curated to bring ergonomic luxury and technical precision to your daily flow.',
    'home.collections': 'Collections',
    'home.viewAll': 'View All Categories',
    'home.category.keyboards': 'Keyboards',
    'home.category.keyboards.sub': 'Custom Mechanicals',
    'home.category.hardware': 'Hardware',
    'home.category.hardware.sub': 'Performance Components',
    'home.category.audio': 'Audio',
    'home.category.audio.sub': 'Studio Grade',
    'home.featured.badge': 'Limited Edition',
    'home.featured.title': 'The Studio Desk',
    'home.featured.description': 'The foundation of deep work. A minimalist surface designed for ergonomic perfection and cable-free clarity, hand-crafted from sustainably sourced solid oak.',
    'home.featured.cta': 'Add to Sanctuary',
    'home.newsletter.title': 'The Monograph',
    'home.newsletter.description': 'Subscribe to receive seasonal curations, design stories, and early access to new collections.',
    'home.newsletter.cta': 'Join',
    'gallery.title': 'The Developer Collection',
    'gallery.description': 'Intentional tools for digital craftsmen. A curated selection of high-performance hardware and studio furniture designed to elevate the creative process.',
    'bag.title': 'Shopping Bag',
    'bag.subtitle': 'Your intentional selection of crafted objects.',
    'bag.checkout': 'Proceed to Checkout',
    'bag.promo': 'Gift card or promo code',
    'bag.apply': 'Apply',
    'bag.subtotal': 'Subtotal',
    'bag.shipping': 'Shipping',
    'bag.tax': 'Tax',
    'bag.total': 'Total',
    'product.addToBag': 'Add to Bag',
    'product.customize': 'Customize Setup',
    'product.reviews': 'Based on 128 Reviews',
    'product.collection': 'Signature Collection',
    'product.foundation': 'The Foundation',
    'product.engineering': 'Precision Engineering',
    'product.voices': 'Voices of Creators',
    'profile.savedSetups': 'Saved Hardware Setups',
    'profile.viewAll': 'View All',
    'profile.viewSetup': 'View Setup',
    'profile.orderHistory': 'Order History',
    'profile.account': 'Account',
    'profile.concierge': 'Lumina Concierge',
    'profile.contactAdvisor': 'Contact Advisor',
  },
  ar: {
    'nav.shop': 'المتجر',
    'nav.story': 'القصة',
    'nav.search': 'بحث',
    'footer.brand': 'نقدم بيئات مطورة مميزة وملاذات رقمية منذ 2024.',
    'footer.collections': 'المجموعات',
    'footer.keyboards': 'لوحة المفاتيح',
    'footer.hardware': 'الأجهزة',
    'footer.audio': 'الصوتيات',
    'footer.explore': 'استكشف',
    'footer.story': 'القصة',
    'footer.journal': 'المجلة',
    'footer.contact': 'اتصل بنا',
    'footer.support': 'الدعم',
    'footer.shipping': 'الشحن',
    'footer.returns': 'الإرجاع',
    'footer.privacy': 'الخصوصية',
    'footer.copyright': '© 2024 Studio Monograph. جميع الحقوق محفوظة.',
    'footer.instagram': 'انستغرام',
    'footer.pinterest': 'بنترست',
    'home.hero.title': 'مساحة العمل التركيز',
    'home.hero.cta': 'تسوق الآن',
    'home.philosophy': 'فلسفتنا',
    'home.story.quote': 'مصنوع بعناية فائقة لـ',
    'home.story.highlight': 'الحرفي الرقمي',
    'home.story.description': 'في استوديو لومينا، نؤمن أن مساحة العمل ملاذ للعمل العميق. كل مكون في مجموعتنا مختار بعناية لتقديم رفاهية مريحة ودقة فنية في تدفقك اليومي.',
    'home.collections': 'المجموعات',
    'home.viewAll': 'عرض جميع الفئات',
    'home.category.keyboards': 'لوحة المفاتيح',
    'home.category.keyboards.sub': 'ميكانيكية مخصصة',
    'home.category.hardware': 'الأجهزة',
    'home.category.hardware.sub': 'مكونات عالية الأداء',
    'home.category.audio': 'الصوتيات',
    'home.category.audio.sub': 'درجة الاستوديو',
    'home.featured.badge': 'إصدار محدود',
    'home.featured.title': 'طاولة الاستوديو',
    'home.featured.description': 'أساس العمل العميق. سطح بسيط مصمم للكمال المريح ووضوح الكابلات، مصنوع يدويًا من خشب البلوط القوي المستدام.',
    'home.featured.cta': 'أضف إلى الملاذ',
    'home.newsletter.title': 'المونوغراف',
    'home.newsletter.description': 'اشترك لتلقي تنسيقات موسمية وقصص تصميم ووصول مبكر للمجموعات الجديدة.',
    'home.newsletter.cta': 'انضم',
    'gallery.title': 'مجموعة المطورين',
    'gallery.description': 'أدوات مقصودة للحرفيين الرقميين. مجموعة منتقاة من الأجهزة عالية الأداء وأثاث الاستوديو المصمم لرفع مستوى العملية الإبداعية.',
    'bag.title': 'حقيبة التسوق',
    'bag.subtitle': 'اختياراتك المقصودة من الأ工艺品.',
    'bag.checkout': 'المتابعة إلى الدفع',
    'bag.promo': 'بطاقة هدية أو رمز ترويجي',
    'bag.apply': 'تطبيق',
    'bag.subtotal': 'المجموع الفرعي',
    'bag.shipping': 'الشحن',
    'bag.tax': 'الضريبة',
    'bag.total': 'الإجمالي',
    'product.addToBag': 'أضف إلى الحقيبة',
    'product.customize': 'تخصيص الإعداد',
    'product.reviews': 'بناءً على 128 تقييم',
    'product.collection': 'المجموعة المميزة',
    'product.foundation': 'الأساس',
    'product.engineering': 'هندسة دقيقة',
    'product.voices': 'أصوات المبدعين',
    'profile.savedSetups': 'إعدادات الأجهزة المحفوظة',
    'profile.viewAll': 'عرض الكل',
    'profile.viewSetup': 'عرض الإعداد',
    'profile.orderHistory': 'سجل الطلبات',
    'profile.account': 'الحساب',
    'profile.concierge': 'خدمة كونسيرج لومينا',
    'profile.contactAdvisor': 'اتصل بالمستشار',
  },
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly settings = inject(SettingsService);

  readonly lang = this.settings.lang;

  t(key: TranslationKey): string {
    return translations[this.settings.lang()][key];
  }
}
