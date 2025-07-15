mkdir -p src/app/auth/register src/app/auth/login src/app/work/new src/app/work/[id]/edit src/app/legal/terms-of-service src/app/legal/privacy-policy src/app/legal/contact
touch src/app/layout.tsx src/app/page.tsx \
      src/app/auth/register/page.tsx src/app/auth/login/page.tsx \
      src/app/work/layout.tsx src/app/work/page.tsx src/app/work/new/page.tsx src/app/work/[id]/page.tsx src/app/work/[id]/edit/page.tsx \
      src/app/legal/terms-of-service/page.tsx src/app/legal/privacy-policy/page.tsx src/app/legal/contact/page.tsx

mkdir -p src/components/ui src/lib src/pages
touch src/pages/Home.tsx src/pages/About.tsx
touch src/App.tsx
