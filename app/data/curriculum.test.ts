import { describe, expect, it } from "vitest";
import { getAllLessons } from "@/app/data/curriculum";
import { getRegisteredAlgorithmIds } from "@/app/lib/engineBootstrap";

const lessons = getAllLessons();

describe("curriculum", () => {
  it("has unique lesson ids", () => {
    const seen = new Set<string>();
    const duplicates = lessons.filter((lesson) => {
      if (seen.has(lesson.id)) return true;
      seen.add(lesson.id);
      return false;
    });
    expect(duplicates.map((lesson) => lesson.id)).toEqual([]);
  });

  it("points every lesson at a registered algorithm", () => {
    const registered = new Set(getRegisteredAlgorithmIds());
    const missing = lessons.filter((lesson) => !registered.has(lesson.algorithmId));
    expect(missing.map((lesson) => `${lesson.id} -> ${lesson.algorithmId}`)).toEqual([]);
  });
});
