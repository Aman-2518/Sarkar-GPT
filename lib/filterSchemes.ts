import { Scheme, UserProfile } from "./types";

/** Pure local filter — runs in the browser, zero API cost. */
export function filterSchemes(schemes: Scheme[], profile: UserProfile): Scheme[] {
  return schemes.filter((s) => {
    const e = s.eligibility;

    if (e.minAge && profile.age < e.minAge) return false;
    if (e.maxAge && profile.age > e.maxAge) return false;
    if (e.gender && e.gender !== "any" && e.gender !== profile.gender) return false;
    if (e.maxIncome && profile.income > e.maxIncome) return false;

    if (e.occupation && e.occupation.length > 0) {
      const flags: Record<string, boolean> = {
        farmer: profile.isFarmer,
        student: profile.isStudent,
        startup: profile.isStartupFounder,
        msme: profile.isMsmeOwner,
        unemployed: profile.occupation === "unemployed",
      };
      const matches = e.occupation.some((tag) => flags[tag]);
      if (!matches) return false;
    }

    if (e.states && e.states.length > 0 && !e.states.includes(profile.state)) return false;

    return true;
  });
}
