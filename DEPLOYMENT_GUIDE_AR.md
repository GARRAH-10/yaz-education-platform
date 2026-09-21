# دليل إطلاق YAZ Education — V20

هذه النسخة مجهزة لمرحلة **Production → GitHub → Vercel → Domain → Google Search Console**.

## 1. فحص Production على جهازك

داخل مجلد المشروع:

```powershell
npm install
npm run typecheck
npm run build
```

يجب إصلاح أي خطأ قبل النشر. بعد نجاح البناء يمكنك تجربة نسخة Production محلياً:

```powershell
npm start
```

## 2. ملف البيئة المحلي

انسخ `.env.example` إلى `.env.local`. لا ترفع `.env.local` إلى GitHub.

أهم قيمة وقت النشر:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.com
```

مفاتيح OpenAI وSupabase تبقى أسراراً Server-side ولا توضع في GitHub.

## 3. إنشاء GitHub Repository

اقتراح الاسم:

```text
yaz-education-platform
```

ثم من داخل المشروع:

```powershell
git init
git add .
git commit -m "Prepare YAZ Education for production launch"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

المشروع يحتوي GitHub Action يقوم تلقائياً بـ TypeScript check وProduction build لكل Push/PR إلى `main`.

## 4. ربط GitHub مع Vercel

في Vercel:

1. Add New → Project
2. Import `yaz-education-platform` من GitHub
3. Framework يجب أن يتعرف تلقائياً على Next.js
4. أضف Environment Variables
5. Deploy

### Environment Variables المهمة في Vercel

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.com
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
```

يمكن ترك Supabase/OpenAI فارغين مؤقتاً إذا لم نفعلهما Production بعد، بشرط أن تبقى الواجهات التي تعتمد عليهما متحملة لغيابهما.

## 5. ربط الدومين

بعد شراء الدومين، أضفه في Vercel: Settings → Domains.

يفضل اختيار نسخة canonical واحدة فقط، مثل:

```text
https://yazeducation.com
```

أو:

```text
https://www.yazeducation.com
```

ثم اجعل النسخة الأخرى Redirect إليها.

بعد ربط الدومين عدّل `NEXT_PUBLIC_SITE_URL` في Vercel إلى الدومين النهائي وأعد Deploy.

## 6. افحص ملفات SEO بعد النشر

يجب أن تعمل هذه الروابط على الدومين الحقيقي:

```text
/robots.txt
/sitemap.xml
/manifest.webmanifest
/en
/ar
/en/universities
/ar/universities
/en/programmes
/ar/programmes
/en/language-institutes
/ar/language-institutes
```

## 7. Google Search Console

1. أضف Domain Property أو URL-prefix Property.
2. أكمل Verification.
3. ضع قيمة HTML-tag verification في `GOOGLE_SITE_VERIFICATION` إذا استخدمت هذا الأسلوب.
4. أرسل:

```text
https://YOUR-DOMAIN.com/sitemap.xml
```

5. استخدم URL Inspection للصفحات المهمة واطلب Indexing.

ابدأ بهذه الصفحات:

- `/en`
- `/ar`
- `/en/universities`
- `/ar/universities`
- صفحات الجامعات الأقوى
- صفحات البرامج المكتملة
- صفحات معاهد اللغة

## 8. فحص ما قبل الإعلان

- تأكد من أن روابط WhatsApp صحيحة.
- تأكد من البريد الرسمي.
- تأكد من عدم وجود رسوم/متطلبات قديمة.
- افحص العربية RTL والموبايل.
- افحص كل Official Website link.
- لا تستخدم claims مثل Official Partner إلا إذا كان لديك إثبات رسمي.
- لا تنشر أي API key.

## 9. بعد الإطلاق

المرحلة التالية تكون:

1. Analytics + conversion events
2. Google Business Profile
3. Content SEO / Guides
4. Supabase data migration
5. Admin Dashboard
6. Real YAZ AI grounded on verified data
