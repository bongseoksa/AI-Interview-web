import type { CategoryType } from "@/types/database";

export interface CategoryMeta {
  key: CategoryType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "html",
    label: "HTML",
    description: "시맨틱 마크업, 접근성, 웹 컴포넌트",
    icon: "🌐",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    key: "css",
    label: "CSS",
    description: "레이아웃, 반응형, 애니메이션, 모던 CSS",
    icon: "🎨",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    key: "javascript",
    label: "JavaScript",
    description: "코어 JS, 비동기, 타입스크립트, ES6+",
    icon: "⚡",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    key: "react",
    label: "React",
    description: "훅, 상태 관리, 렌더링 최적화, 패턴",
    icon: "⚛️",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
  {
    key: "nextjs",
    label: "Next.js",
    description: "App Router, SSR/SSG, 캐싱, 미들웨어",
    icon: "▲",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    key: "infra_security_network",
    label: "인프라/보안/네트워크",
    description: "HTTP, CORS, OAuth, 보안 헤더, WebSocket",
    icon: "🔒",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    key: "version_control",
    label: "형상관리 (Git/CI-CD)",
    description: "브랜치 전략, CI/CD, Docker, 배포",
    icon: "🔀",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  {
    key: "performance_seo",
    label: "성능/SEO",
    description: "Core Web Vitals, 번들 최적화, 메타 태그",
    icon: "🚀",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryType, CategoryMeta>;

export const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  junior: { label: "주니어", color: "bg-green-100 text-green-700" },
  mid: { label: "미드", color: "bg-yellow-100 text-yellow-700" },
  senior: { label: "시니어", color: "bg-red-100 text-red-700" },
};
