# إعداد V21 — Supabase + لوحة إدارة YAZ

هذه النسخة تربط صفحات **الجامعات، البرامج، ومعاهد اللغة** بقاعدة Supabase عندما تكون إعدادات Supabase موجودة. إذا لم تكن Supabase مفعلة، يبقى الموقع يعمل بالبيانات المحلية الحالية كـ fallback.

## 1) إنشاء مشروع Supabase

أنشئ مشروعاً في Supabase ثم افتح **SQL Editor** وشغّل بالترتيب:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

الـ seed يضيف بيانات البداية الموجودة حالياً في الموقع.

## 2) المتغيرات المطلوبة

في `.env.local` للتطوير أو في Vercel → Project → Environment Variables للإنتاج:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

ADMIN_DASHBOARD_EMAIL=admin@yazeducation.com
ADMIN_DASHBOARD_PASSWORD=USE_A_LONG_UNIQUE_PASSWORD
ADMIN_SESSION_SECRET=USE_A_LONG_RANDOM_SECRET
```

### مهم جداً

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` مفتاح عام مصمم للاستخدام مع RLS.
- `SUPABASE_SERVICE_ROLE_KEY` **سري جداً** ويجب أن يبقى داخل Vercel/server فقط.
- لا تضع service-role key أو كلمة مرور لوحة الإدارة في GitHub أو كود المتصفح.
- استخدم كلمة مرور طويلة وفريدة.

## 3) لوحة الإدارة

بعد إضافة المتغيرات وإعادة النشر:

```text
https://YOUR-DOMAIN/admin/login
```

من لوحة الإدارة تستطيع حالياً:

- إضافة/تعديل/حذف الجامعات.
- إضافة/تعديل/حذف البرامج.
- إضافة/تعديل/حذف معاهد اللغة.
- مشاهدة آخر طلبات الاستشارة.
- تغيير حالة العميل المحتمل: New / Contacted / Qualified / Closed.

## 4) كيف تعمل البيانات العامة

الترتيب الحالي:

```text
Public page
   ↓
Supabase verified records
   ↓
إذا تعذر الاتصال أو لم توجد بيانات
   ↓
Local verified fallback data
```

هذا يمنع تعطل الموقع أثناء الانتقال إلى قاعدة البيانات.

## 5) قاعدة مهمة للنشر

لا تجعل `verified = true` لجامعة أو معهد، ولا تضف `verified_at` لبرنامج، إلا بعد مراجعة المصدر الرسمي.

## 6) قبل الإنتاج النهائي

للعميل الحقيقي يفضّل أن تكون ملكية Supabase والفوترة والحساب النهائي باسم العميل أو ضمن حساب/Team متفق عليه، بينما يمكن استخدام بيئة تطوير منفصلة أثناء التطوير.

## تحديث V22 لبيانات البرامج

إذا كنت قد شغّلت ملف `001_initial_schema.sql` سابقاً، لا تعِد إنشاء المشروع. فقط افتح Supabase SQL Editor وشغّل:

`supabase/migrations/002_programme_details.sql`

بعد نجاح التنفيذ، أعد تشغيل الموقع ثم افتح لوحة الإدارة > Programmes. ستظهر حقول إضافية للرسوم، متطلبات القبول، اللغة الإنجليزية، المستندات، الاعتماد، المنح وملاحظات التقديم.
