import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

const supportedLocales = ["tr", "en", "de", "es", "fr"] as const;
type SupportLocale = (typeof supportedLocales)[number];
type SupportLocaleOrAll = SupportLocale | "all";

type SupportTranslationBlock = {
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  readTime?: string;
};

type SupportTranslations = Partial<
  Record<SupportLocale, SupportTranslationBlock>
>;

const defaultSupportLocale: SupportLocale = "tr";

const isSupportLocale = (value: string): value is SupportLocale =>
  (supportedLocales as readonly string[]).includes(value);

const getRequestedSupportLocale = (req: Request): SupportLocaleOrAll => {
  const queryLang =
    typeof req.query.lang === "string" ? req.query.lang : undefined;
  const headerLang =
    req.header("x-locale") || req.header("accept-language")?.split(",")[0];
  const raw = (queryLang || headerLang || defaultSupportLocale)
    .toLowerCase()
    .split("-")[0];

  if (raw === "all") {
    return "all";
  }

  return isSupportLocale(raw) ? raw : defaultSupportLocale;
};

const parseSupportTranslations = (value: unknown): SupportTranslations => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as SupportTranslations;
};

const resolveTranslation = (
  translations: SupportTranslations,
  locale: SupportLocale,
  fallback: SupportTranslationBlock,
): SupportTranslationBlock => ({
  title:
    translations[locale]?.title || translations.en?.title || fallback.title,
  description:
    translations[locale]?.description ||
    translations.en?.description ||
    fallback.description,
  excerpt:
    translations[locale]?.excerpt ||
    translations.en?.excerpt ||
    fallback.excerpt,
  content:
    translations[locale]?.content ||
    translations.en?.content ||
    fallback.content,
  readTime:
    translations[locale]?.readTime ||
    translations.en?.readTime ||
    fallback.readTime,
});

const resolveCategory = (category: any, locale: SupportLocaleOrAll) => {
  const translations = parseSupportTranslations(category.translations);

  if (locale === "all") {
    return {
      ...category,
      translations,
    };
  }

  const resolved = resolveTranslation(translations, locale, {
    title: category.title,
    description: category.description,
  });

  return {
    ...category,
    ...resolved,
  };
};

const resolveArticle = (article: any, locale: SupportLocaleOrAll) => {
  const translations = parseSupportTranslations(article.translations);

  if (locale === "all") {
    return {
      ...article,
      translations,
    };
  }

  const resolved = resolveTranslation(translations, locale, {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    readTime: article.readTime,
  });

  return {
    ...article,
    ...resolved,
  };
};

const resolveCategoryWithArticles = (
  category: any,
  locale: SupportLocaleOrAll,
) => ({
  ...resolveCategory(category, locale),
  articles: (category.articles || []).map((article: any) =>
    resolveArticle(article, locale),
  ),
});

const normalizeCategoryTranslations = (
  body: any,
  title: string,
  description: string,
): SupportTranslations => {
  const translations = parseSupportTranslations(body.translations);
  const defaultBlock = translations[defaultSupportLocale] || {};

  return {
    ...translations,
    [defaultSupportLocale]: {
      title: body.title ?? defaultBlock.title ?? title,
      description: body.description ?? defaultBlock.description ?? description,
      ...defaultBlock,
    },
  };
};

const normalizeArticleTranslations = (
  body: any,
  title: string,
  excerpt: string,
  content: string,
  readTime: string,
): SupportTranslations => {
  const translations = parseSupportTranslations(body.translations);
  const defaultBlock = translations[defaultSupportLocale] || {};

  return {
    ...translations,
    [defaultSupportLocale]: {
      title: body.title ?? defaultBlock.title ?? title,
      excerpt: body.excerpt ?? defaultBlock.excerpt ?? excerpt,
      content: body.content ?? defaultBlock.content ?? content,
      readTime: body.readTime ?? defaultBlock.readTime ?? readTime,
      ...defaultBlock,
    },
  };
};

// ==================== SUPPORT CATEGORIES ====================

// Get all support categories with articles (public)
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const locale = getRequestedSupportLocale(req);
    const categories = await prisma.supportCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        articles: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.json(
      categories.map((category) =>
        resolveCategoryWithArticles(category, locale),
      ),
    );
  } catch (error) {
    console.error("Get support categories error:", error);
    res.status(500).json({ error: "Failed to fetch support categories" });
  }
});

// Get single category with articles (public)
router.get("/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const locale = getRequestedSupportLocale(req);

    const category = await prisma.supportCategory.findUnique({
      where: { id },
      include: {
        articles: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(resolveCategoryWithArticles(category, locale));
  } catch (error) {
    console.error("Get support category error:", error);
    res.status(500).json({ error: "Failed to fetch support category" });
  }
});

// ==================== SUPPORT ARTICLES ====================

// Get single article and increment views (public)
router.get(
  "/categories/:categoryId/articles/:articleId",
  async (req: Request, res: Response) => {
    try {
      const { categoryId, articleId } = req.params as {
        categoryId: string;
        articleId: string;
      };
      const locale = getRequestedSupportLocale(req);

      // Increment views
      const article = await prisma.supportArticle.update({
        where: { id: parseInt(articleId) },
        data: { views: { increment: 1 } },
        include: {
          category: true,
        },
      });

      if (!article || article.categoryId !== categoryId) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json(resolveArticle(article, locale));
    } catch (error) {
      console.error("Get support article error:", error);
      res.status(500).json({ error: "Failed to fetch support article" });
    }
  },
);

// Get popular articles (public)
router.get("/articles/popular", async (req: Request, res: Response) => {
  try {
    const locale = getRequestedSupportLocale(req);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

    const articles = await prisma.supportArticle.findMany({
      orderBy: { views: "desc" },
      take: limit,
      include: {
        category: true,
      },
    });

    res.json(articles.map((article) => resolveArticle(article, locale)));
  } catch (error) {
    console.error("Get popular articles error:", error);
    res.status(500).json({ error: "Failed to fetch popular articles" });
  }
});

// ==================== ADMIN ROUTES ====================

// Create category (admin only)
router.post(
  "/categories",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id, icon, title, description, color, order } = req.body;
      const translations = normalizeCategoryTranslations(
        req.body,
        title,
        description,
      );

      const category = await prisma.supportCategory.create({
        data: {
          id,
          icon,
          title,
          description,
          translations,
          color,
          order: order || 0,
        },
      });

      res.json(category);
    } catch (error) {
      console.error("Create support category error:", error);
      res.status(500).json({ error: "Failed to create support category" });
    }
  },
);

// Update category (admin only)
router.put(
  "/categories/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const { icon, title, description, color, order } = req.body;
      const translations = normalizeCategoryTranslations(
        req.body,
        title,
        description,
      );

      const category = await prisma.supportCategory.update({
        where: { id },
        data: { icon, title, description, translations, color, order },
        include: { articles: { orderBy: { order: "asc" } } },
      });

      res.json(category);
    } catch (error) {
      console.error("Update support category error:", error);
      res.status(500).json({ error: "Failed to update support category" });
    }
  },
);

// Delete category (admin only)
router.delete(
  "/categories/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      await prisma.supportCategory.delete({ where: { id } });
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete support category error:", error);
      res.status(500).json({ error: "Failed to delete support category" });
    }
  },
);

// Create article (admin only)
router.post(
  "/categories/:categoryId/articles",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { categoryId } = req.params as { categoryId: string };
      const { title, excerpt, content, readTime, helpful, order } = req.body;
      const translations = normalizeArticleTranslations(
        req.body,
        title,
        excerpt,
        content,
        readTime,
      );

      const article = await prisma.supportArticle.create({
        data: {
          categoryId,
          title,
          excerpt,
          content,
          readTime,
          translations,
          helpful: helpful || 0,
          order: order || 0,
        },
      });

      res.json(article);
    } catch (error) {
      console.error("Create support article error:", error);
      res.status(500).json({ error: "Failed to create support article" });
    }
  },
);

// Update article (admin only)
router.put(
  "/articles/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const { title, excerpt, content, readTime, helpful, order } = req.body;
      const translations = normalizeArticleTranslations(
        req.body,
        title,
        excerpt,
        content,
        readTime,
      );

      const article = await prisma.supportArticle.update({
        where: { id: parseInt(id) },
        data: {
          title,
          excerpt,
          content,
          readTime,
          translations,
          helpful,
          order,
        },
      });

      res.json(article);
    } catch (error) {
      console.error("Update support article error:", error);
      res.status(500).json({ error: "Failed to update support article" });
    }
  },
);

// Delete article (admin only)
router.delete(
  "/articles/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };

      await prisma.supportArticle.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Delete support article error:", error);
      res.status(500).json({ error: "Failed to delete support article" });
    }
  },
);

export default router;
