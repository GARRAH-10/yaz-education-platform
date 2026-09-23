# YAZ Education V25.1 — Production Build Fixes

This patch is based on V25 and consolidates the production-build fixes found during local/Vercel build testing.

## Fixed

1. Supabase Admin insert/update payload typing
   - `app/api/admin/catalog/[entity]/route.ts`
   - `app/api/admin/catalog/[entity]/[id]/route.ts`

2. Admin dashboard callback typing
   - Typed University, Programme and Language Institute table callbacks.
   - Removed the implicit `any` build failure around `record`.
   - Added shared editor/table record types.

3. University catalogue readonly arrays
   - `UniversityCatalogItem.studyAreasEn`
   - `UniversityCatalogItem.studyAreasAr`
   are now `readonly string[]`, matching the static university data.

4. Frontend catalogue field naming kept consistent
   - `studyAreasEn`
   - `studyAreasAr`
   Database snake_case remains confined to Supabase/database mapping code.

5. Programme Directory JSX kept structurally valid
   - No extra closing `</div>` around the institution card area-tags/actions block.

6. Programme field aggregation kept valid
   - `ALL_INSTITUTIONS.flatMap((institution) => institution.studyAreasEn ?? [])`

7. Removed stale `tsconfig.tsbuildinfo`
   - Forces a clean TypeScript build on first run.

## Validation completed

- Parsed every `.ts` and `.tsx` source file with the TypeScript parser.
- Result: **0 syntax errors**.
- Applied all production-build fixes encountered during the V25 debugging sequence.

## Final verification on your PC

```powershell
npm install
npm run build
```

Only commit/push after the build completes successfully.
