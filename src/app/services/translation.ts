import { Injectable, inject } from '@angular/core';
import { SettingsService, type Lang } from './settings';

export type TranslationKey =
  | 'nav.shop'
  | 'nav.story'
  | 'nav.search'
  | 'nav.cart'
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
  | 'profile.contactAdvisor'
  | 'notFound.title'
  | 'notFound.description'
  | 'notFound.backHome'
  | 'notFound.browseProducts'
  | 'about.hero.label'
  | 'about.hero.title'
  | 'about.hero.description'
  | 'about.mission.title'
  | 'about.mission.description1'
  | 'about.mission.description2'
  | 'about.values.title'
  | 'about.values.craft.title'
  | 'about.values.craft.description'
  | 'about.values.sustainability.title'
  | 'about.values.sustainability.description'
  | 'about.values.community.title'
  | 'about.values.community.description'
  | 'about.stats.founded'
  | 'about.stats.craftsmen'
  | 'about.stats.products'
  | 'about.stats.satisfaction'
  | 'about.cta.title'
  | 'about.cta.description'
  | 'about.cta.button'
  | 'unauthorized.title'
  | 'unauthorized.description'
  | 'unauthorized.backHome'
  | 'unauthorized.signIn';

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    'nav.shop': 'Shop',
    'nav.story': 'Story',
    'nav.search': 'Search',
    'nav.cart': 'Cart',
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
    'home.story.description':
      'At Lumina Studio, we believe the workspace is a sanctuary of deep work. Every component in our collection is curated to bring ergonomic luxury and technical precision to your daily flow.',
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
    'home.featured.description':
      'The foundation of deep work. A minimalist surface designed for ergonomic perfection and cable-free clarity, hand-crafted from sustainably sourced solid oak.',
    'home.featured.cta': 'Add to Sanctuary',
    'home.newsletter.title': 'The Monograph',
    'home.newsletter.description':
      'Subscribe to receive seasonal curations, design stories, and early access to new collections.',
    'home.newsletter.cta': 'Join',
    'gallery.title': 'The Developer Collection',
    'gallery.description':
      'Intentional tools for digital craftsmen. A curated selection of high-performance hardware and studio furniture designed to elevate the creative process.',
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
    'notFound.title': 'Lost in the Workshop',
    'notFound.description':
      'The page you seek has been misplaced. Perhaps it was never crafted, or has been retired to the archive.',
    'notFound.backHome': 'Return Home',
    'notFound.browseProducts': 'Browse Products',
    'about.hero.label': 'Our Story',
    'about.hero.title': 'Crafting Digital Sanctuaries',
    'about.hero.description':
      'Lumina Studio was born from a simple belief: the workspace should be a sanctuary of deep work. We curate premium tools for digital craftsmen who demand both aesthetic harmony and technical precision.',
    'about.mission.title': 'Our Mission',
    'about.mission.description1':
      'We exist to elevate the everyday workspace into something extraordinary. Every product in our collection is handpicked for its ergonomic excellence, sustainable sourcing, and timeless design.',
    'about.mission.description2':
      'From custom mechanical keyboards to precision-engineered hardware, we believe the tools of creation deserve the same reverence as the work they enable.',
    'about.values.title': 'Our Values',
    'about.values.craft.title': 'Craftsmanship',
    'about.values.craft.description':
      'Every product we curate meets exacting standards of build quality and material integrity.',
    'about.values.sustainability.title': 'Sustainability',
    'about.values.sustainability.description':
      'We prioritize responsibly sourced materials and partners who share our commitment to the environment.',
    'about.values.community.title': 'Community',
    'about.values.community.description':
      'We nurture a community of creators who share our passion for intentional, beautiful workspaces.',
    'about.stats.founded': 'Founded',
    'about.stats.craftsmen': 'Craftsmen Served',
    'about.stats.products': 'Curated Products',
    'about.stats.satisfaction': 'Satisfaction Rate',
    'about.cta.title': 'Begin Your Journey',
    'about.cta.description':
      'Discover our curated collection of tools designed for the discerning digital craftsman.',
    'about.cta.button': 'Explore Collection',
    'unauthorized.title': 'Access Restricted',
    'unauthorized.description':
      'You do not have permission to access this area. This sanctuary is reserved for verified members.',
    'unauthorized.backHome': 'Return Home',
    'unauthorized.signIn': 'Sign In',
  },
  ar: {
    'nav.shop': 'المتجر',
    'nav.story': 'القصة',
    'nav.search': 'بحث',
    'nav.cart': 'السلة',
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
    'home.story.description':
      'في استوديو لومينا، نؤمن أن مساحة العمل ملاذ للعمل العميق. كل مكون في مجموعتنا مختار بعناية لتقديم رفاهية مريحة ودقة فنية في تدفقك اليومي.',
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
    'home.featured.description':
      'أساس العمل العميق. سطح بسيط مصمم للكمال المريح ووضوح الكابلات، مصنوع يدويًا من خشب البلوط القوي المستدام.',
    'home.featured.cta': 'أضف إلى الملاذ',
    'home.newsletter.title': 'المونوغراف',
    'home.newsletter.description':
      'اشترك لتلقي تنسيقات موسمية وقصص تصميم ووصول مبكر للمجموعات الجديدة.',
    'home.newsletter.cta': 'انضم',
    'gallery.title': 'مجموعة المطورين',
    'gallery.description':
      'أدوات مقصودة للحرفيين الرقميين. مجموعة منتقاة من الأجهزة عالية الأداء وأثاث الاستوديو المصمم لرفع مستوى العملية الإبداعية.',
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
    'notFound.title': 'ضائع في المشغل',
    'notFound.description':
      'الصفحة التي تبحث عنها ضاعت. ربما لم يتم صنعها قط، أو تم تصنيفها في الأرشيف.',
    'notFound.backHome': 'العودة للرئيسية',
    'notFound.browseProducts': 'تصفح المنتجات',
    'about.hero.label': 'قصتنا',
    'about.hero.title': 'صنع ملاذات رقمية',
    'about.hero.description':
      'وُلدت استوديو لومينا من إيمان بسيط: يجب أن تكون مساحة العمل ملاذًا للعمل العميق. نقدم أدوات مميزة للحرفيين الرقميين الذين يطلبون التناغم الجمالي والدقة الفنية.',
    'about.mission.title': 'مهمتنا',
    'about.mission.description1':
      'نوجد لرفع مساحة العمل اليومية إلى شيء استثنائي. كل منتج في مجموعتنا مختار يدويًا ل鲼مياته المريحة والمواد المستدامة والتصميم الخالد.',
    'about.mission.description2':
      'من لوحات المفاتيح الميكانيكية المخصصة إلى الأجهزة الهندسية الدقيقة، نؤمن أن أدوات الإبداع تستحق نفس الاحترام كالعمل الذي تمكّنه.',
    'about.values.title': 'قيمنا',
    'about.values.craft.title': 'الحرفة',
    'about.values.craft.description': 'كل منتج نقدمه يلبي معايير صارمة لجودة البناء وسلامة المواد.',
    'about.values.sustainability.title': 'الاستدامة',
    'about.values.sustainability.description':
      'نعطي الأولوية للمواد المسؤولة والشركاء الذين يشاركوننا التزامنا بالبيئة.',
    'about.values.community.title': 'المجتمع',
    'about.values.community.description':
      'نربي مجتمعًا من المبدعين الذين يشاركوننا شغفنا بمساحات العمل المقصودة والجميلة.',
    'about.stats.founded': 'التأسيس',
    'about.stats.craftsmen': 'حرفي تم خدمتهم',
    'about.stats.products': 'منتج مختار',
    'about.stats.satisfaction': 'معدل الرضا',
    'about.cta.title': 'ابدأ رحلتك',
    'about.cta.description': 'اكتشف مجموعتنا المختارة من الأدوات المصممة للحرفي الرقمي المميز.',
    'about.cta.button': 'استكشف المجموعة',
    'unauthorized.title': 'الوصول مقيد',
    'unauthorized.description':
      'ليس لديك صلاحية للوصول إلى هذه المنطقة. هذا الملاذ محجوز للأعضاء المعتمدين.',
    'unauthorized.backHome': 'العودة للرئيسية',
    'unauthorized.signIn': 'تسجيل الدخول',
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
