import sequelize from "../config/db.js";
import { QueryTypes } from "sequelize";

const MAX_COMMENTS_PER_VET = 3;

const toNumberOrNull = (value) => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getVetRatingsSummaryByVetIds = async (vetIds = []) => {
  if (!Array.isArray(vetIds) || vetIds.length === 0) {
    return new Map();
  }

  const aggregateRows = await sequelize.query(
    `
      SELECT
        vr.vet_id,
        AVG(vr.rating_value) AS average_rating,
        COUNT(*) AS review_count
      FROM vet_ratings vr
      WHERE vr.vet_id IN (:vetIds)
      GROUP BY vr.vet_id
    `,
    {
      replacements: { vetIds },
      type: QueryTypes.SELECT
    }
  );

  const commentRows = await sequelize.query(
    `
      SELECT
        vr.vet_id,
        vr.comment,
        vr.rating_value,
        vr.created_at,
        u.name AS farmer_name
      FROM vet_ratings vr
      LEFT JOIN users u ON u.id = vr.farmer_id
      WHERE vr.vet_id IN (:vetIds)
        AND vr.comment IS NOT NULL
        AND TRIM(vr.comment) <> ''
      ORDER BY vr.vet_id ASC, vr.created_at DESC
    `,
    {
      replacements: { vetIds },
      type: QueryTypes.SELECT
    }
  );

  const commentsByVetId = commentRows.reduce((acc, row) => {
    const vetId = Number(row.vet_id);
    if (!acc.has(vetId)) {
      acc.set(vetId, []);
    }
    if (acc.get(vetId).length < MAX_COMMENTS_PER_VET) {
      acc.get(vetId).push({
        comments: row.comment,
        rating: toNumberOrNull(row.rating_value),
        farmer_name: row.farmer_name || null,
        created_at: row.created_at || null
      });
    }
    return acc;
  }, new Map());

  const summaryMap = new Map();

  aggregateRows.forEach((row) => {
    const vetId = Number(row.vet_id);
    const averageRating = toNumberOrNull(row.average_rating);
    const reviewCount = toNumberOrNull(row.review_count) || 0;

    summaryMap.set(vetId, {
      average_rating: averageRating === null ? null : Number(averageRating.toFixed(2)),
      review_count: reviewCount,
      comments: commentsByVetId.get(vetId) || []
    });
  });

  // Ensure all requested vet IDs get a predictable response shape.
  vetIds.forEach((vetIdRaw) => {
    const vetId = Number(vetIdRaw);
    if (!summaryMap.has(vetId)) {
      summaryMap.set(vetId, {
        average_rating: null,
        review_count: 0,
        comments: []
      });
    }
  });

  return summaryMap;
};

export const getVetReviewsByVetId = async (vetId) => {
  const numericVetId = Number(vetId);
  if (!Number.isFinite(numericVetId)) {
    return [];
  }

  const reviewRows = await sequelize.query(
    `
      SELECT
        vr.id,
        vr.vet_id,
        vr.farmer_id,
        vr.rating_value,
        vr.comment,
        vr.created_at,
        u.name AS farmer_name
      FROM vet_ratings vr
      LEFT JOIN users u ON u.id = vr.farmer_id
      WHERE vr.vet_id = :vetId
      ORDER BY vr.created_at DESC
    `,
    {
      replacements: { vetId: numericVetId },
      type: QueryTypes.SELECT
    }
  );

  return reviewRows.map((row) => ({
    id: Number(row.id),
    vet_id: Number(row.vet_id),
    farmer_id: Number(row.farmer_id),
    farmer_name: row.farmer_name || null,
    rating: toNumberOrNull(row.rating_value),
    comment: row.comment || "",
    created_at: row.created_at || null
  }));
};

export const getSubmittedVetReviewsByActorId = async (actorId) => {
  const numericActorId = Number(actorId);
  if (!Number.isFinite(numericActorId)) {
    return [];
  }

  const reviewRows = await sequelize.query(
    `
      SELECT
        vr.id,
        vr.vet_id,
        vr.farmer_id,
        vr.rating_value,
        vr.comment,
        vr.created_at,
        u.name AS vet_name
      FROM vet_ratings vr
      LEFT JOIN vets v ON v.id = vr.vet_id
      LEFT JOIN users u ON u.id = v.user_id
      WHERE vr.farmer_id = :actorId
      ORDER BY vr.created_at DESC
    `,
    {
      replacements: { actorId: numericActorId },
      type: QueryTypes.SELECT
    }
  );

  return reviewRows.map((row) => ({
    id: Number(row.id),
    vet_id: Number(row.vet_id),
    farmer_id: Number(row.farmer_id),
    vet_name: row.vet_name || "Unknown Vet",
    rating: toNumberOrNull(row.rating_value),
    comment: row.comment || "",
    created_at: row.created_at || null
  }));
};
