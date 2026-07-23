const {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
} = require("drizzle-orm");
const { db } = require("../database/client");
const { businesses } = require("../database/schema");

const create = async (data) => {
  const [business] = await db
    .insert(businesses)
    .values(data)
    .returning();

  return business;
};

const findBySlug = async (slug) => {
  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1);

  return business || null;
};

const findById = async (id) => {
  const [business] = await db
    .select()
    .from(businesses)
    .where(
      and(eq(businesses.id, id), eq(businesses.isActive, true)),
    )
    .limit(1);

  return business || null;
};

const findAll = async ({ page, limit, search }) => {
  const filters = [eq(businesses.isActive, true)];

  if (search) {
    const pattern = `%${search}%`;

    filters.push(
      or(
        ilike(businesses.name, pattern),
        ilike(businesses.slug, pattern),
        ilike(businesses.email, pattern),
      ),
    );
  }

  const where = and(...filters);
  const offset = (page - 1) * limit;

  const [records, [{ total }]] = await Promise.all([
    db
      .select()
      .from(businesses)
      .where(where)
      .orderBy(desc(businesses.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(businesses).where(where),
  ]);

  return {
    records,
    total,
  };
};

const updateById = async (id, data) => {
  const [business] = await db
    .update(businesses)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(eq(businesses.id, id), eq(businesses.isActive, true)),
    )
    .returning();

  return business || null;
};

const softDeleteById = async (id) => {
  const [business] = await db
    .update(businesses)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(eq(businesses.id, id), eq(businesses.isActive, true)),
    )
    .returning();

  return business || null;
};

module.exports = {
  create,
  findBySlug,
  findById,
  findAll,
  updateById,
  softDeleteById,
};
