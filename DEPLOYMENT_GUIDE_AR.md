# دليل نشر YAZ Education V25 على Vercel

V25 مخصص لتثبيت بيئة الإنتاج: **Vercel + Supabase + Admin Dashboard + Environment Variables**. مشكلة استجابة الـAI نعود لها بعد أن نتأكد أن البنية الإنتاجية مستقرة.

## 1. فحص المشروع محلياً

من داخل المجلد الذي يحتوي `package.json`:

```powershell
npm install
npm run typecheck
npm run build
```

إذا نجح البناء، شغّل نسخة Production محلياً:

```powershell
npm start
```

## 2. لا ترفع `.env.local`

الملف موجود في `.gitignore`. القيم السرية توضع يدوياً في Vercel.

## 3. متغيرات Vercel المطلوبة

Vercel → Project → Settings → Environment Variables.

أضف للـProduction:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-PRODUCTION-DOMAIN
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_DASHBOARD_EMAIL=...
ADMIN_DASHBOARD_PASSWORD=...
ADMIN_SESSION_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-3.5-flash
YAZ_AI_WEB_SEARCH=false
GOOGLE_SITE_VERIFICATION=
```

لا ترسل أو ترفع هذه القيم: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_DASHBOARD_PASSWORD`, `ADMIN_SESSION_SECRET`, `GEMINI_API_KEY`.

## 4. Deploy / Redeploy

بعد تحديث GitHub والمتغيرات، اعمل Redeploy لآخر commit على `main`.

## 5. افحص حالة النظام

افتح:

```text
https://YOUR-DOMAIN/api/health
```

نريد أن نرى تقريباً:

```json
{
  "ok": true,
  "supabaseConfigured": true,
  "supabaseConnected": true,
  "adminConfigured": true,
  "aiConfigured": true
}
```

ثم:

```text
https://YOUR-DOMAIN/api/health/ai
```

هذا يفحص إعداد Gemini فقط ولا يستهلك request مدفوع/محدود.

## 6. افحص Admin في Production

افتح:

```text
https://YOUR-DOMAIN/admin/login
```

سجّل الدخول بالقيم الموجودة في Vercel. في Production يستخدم V25 cookie أكثر صرامة يبدأ بـ `__Host-` ويعمل مع HTTPS فقط.

## 7. اختبار end-to-end

1. أرسل Consultation تجريبية من الموقع.
2. افتح Admin وتأكد أن lead ظهرت.
3. أضف سجل TEST غير verified.
4. عدّله.
5. احذفه.

إذا نجحت هذه الخطوات، فـVercel ↔ Next.js ↔ Supabase ↔ Admin تعمل إنتاجياً.

## 8. الدومين وSEO

بعد ربط الدومين النهائي، حدّث:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-FINAL-DOMAIN
```

ثم Redeploy وتحقق من:

```text
/robots.txt
/sitemap.xml
/en
/ar
```

## 9. بعد V25

بعد نجاح Production infrastructure نعود إلى مشكلة YAZ AI ونصلح routing/context بشكل منفصل بدون خلطها مع مشاكل النشر.
