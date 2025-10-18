// Small shared helpers for jobs page
export const normalizeValue = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

export const escapeRegExp = (s) => String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function parseExpRange(expStr) {
  if (!expStr) return { min: 0, max: 0 };
  const s = String(expStr).trim();
  const plus = s.match(/(\d)+\+/);
  if (plus) return { min: Number(plus[1]), max: Infinity };
  const range = s.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };
  const num = s.match(/(\d+)/);
  if (num) return { min: Number(num[1]), max: Number(num[1]) };
  return { min: 0, max: 0 };
}

const US_STATE_CODES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WI","WV","WY",
]);

export function isUSCountry(country) {
  if (!country) return false;
  const m = String(country).toUpperCase().match(/([A-Z]{2})$/);
  return !!(m && US_STATE_CODES.has(m[1]));
}

export function extractExperienceFromString(str) {
  if (!str) return null;
  const plus = String(str).match(/(\d+)\+/);
  if (plus) return Number(plus[1]);
  const years = String(str).match(/(\d+)\s*years?/i);
  if (years) return Number(years[1]);
  const num = String(str).match(/^(\d+)$/);
  if (num) return Number(num[1]);
  return null;
}

export function extractLocationFromString(str, carts = []) {
  if (!str) return null;
  const s = String(str).toLowerCase();
  for (const it of carts) {
    if (!it.country) continue;
    const c = String(it.country).toLowerCase();
    if (s.includes(c) || c.includes(s)) return it.country;
  }
  if (/(united|usa|us|america)/i.test(str)) return "United State";
  return null;
}

export function detectLocation(query, carts = []) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return null;
  for (const it of carts) {
    if (!it.country) continue;
    if (normalizeValue(it.country).includes(q) || q.includes(normalizeValue(it.country))) return it.country;
  }
  if (/(united|usa|us|america)/i.test(q)) return "United State";
  return null;
}

export function detectExperience(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return null;
  const plus = q.match(/(\d+)\+/);
  if (plus) return Number(plus[1]);
  const years = q.match(/(\d+)\s*years?/);
  if (years) return Number(years[1]);
  const num = q.match(/^(\d+)$/);
  if (num) return Number(num[1]);
  return null;
}

export function getImmediatePills(query, carts = [], pinnedLocation = null, pinnedExperience = null) {
  const q = (query || "").trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const pills = [];
  for (const t of tokens) {
    if (t.length < 3 && !/^(\d+)(\+)?$/i.test(t)) continue;
    const exp = extractExperienceFromString(t);
    if (exp) {
      pills.push({ type: "experience", key: `exp:${exp}`, token: t, label: `${exp}+ years`, value: exp });
      continue;
    }
    const loc = extractLocationFromString(t, carts);
    if (loc) {
      pills.push({ type: "location", key: `loc:${loc}`, token: t, label: loc, value: loc });
      continue;
    }
    pills.push({ type: "other", key: `tok:${t}`, token: t, label: t, value: t });
  }
  const seen = new Set();
  return pills.filter((p) => (seen.has(p.key) ? false : seen.add(p.key)));
}

export function getNonDetectedTokens(query, pinnedLocation, detectedLocation, pinnedExperience, detectedExperience) {
  const q = (query || "").trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.filter((t) => {
    if (/^\d+\+?$/.test(t) || /years?/i.test(t)) return false;
    const low = t.toLowerCase();
    const locs = [pinnedLocation, detectedLocation].filter(Boolean).map((x) => String(x).toLowerCase());
    for (const l of locs) if (l && (l.includes(low) || low.includes(l))) return false;
    return true;
  });
}

export function getExtraTokens(nonDetectedTokens) {
  if (!nonDetectedTokens.length) return [];
  const out = [];
  if (nonDetectedTokens[1]) out.push(nonDetectedTokens[1]);
  if (nonDetectedTokens[2]) out.push(nonDetectedTokens[2]);
  return out;
}

export function getMatchedValues(query, carts = []) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const results = [];
  const seenToken = new Set();
  const seenValue = new Set();
  for (const token of tokens) {
    if (token.length < 3 && !/^(\d+)(\+)?$/i.test(token)) continue;
    const low = token.toLowerCase();
    if (seenToken.has(low)) continue;
    seenToken.add(low);
    let found = null;
    const numMatch = low.match(/^(\d+)$/);
    if (numMatch) {
      const tnum = Number(numMatch[1]);
      for (const item of carts) {
        if (!item.experience) continue;
        const s = String(item.experience).toLowerCase();
        const plus = s.match(/(\d+)\+/);
        const range = s.match(/(\d+)\s*-\s*(\d+)/);
        const single = s.match(/^(\d+)\b/);
        let min = 0, max = 0;
        if (plus) {
          min = Number(plus[1]);
          max = Infinity;
        } else if (range) {
          min = Number(range[1]);
          max = Number(range[2]);
        } else if (single) {
          min = Number(single[1]);
          max = Number(single[1]);
        }
        if (tnum >= min && tnum <= max) {
          const key = `exp:${min}-${max === Infinity ? 'inf' : max}`;
          found = { type: 'experience', value: item.experience, token, key };
          break;
        }
      }
      if (found) {
        if (!seenValue.has(found.key)) {
          seenValue.add(found.key);
          results.push(found);
        }
        continue;
      }
    }
    for (const item of carts) {
      if (item.country && normalizeValue(item.country).includes(low)) {
        found = { type: 'location', value: item.country, token, key: `country:${item.country}` };
        break;
      }
    }
    if (found) {
      const norm = normalizeValue(found.value);
      if (!seenValue.has(norm)) {
        seenValue.add(norm);
        results.push(found);
      }
      continue;
    }
    for (const item of carts) {
      if (item.experience && normalizeValue(item.experience).includes(low)) {
        found = { type: 'experience', value: item.experience, token, key: `exp:${normalizeValue(item.experience)}` };
        break;
      }
    }
    if (found) {
      const key = found.key;
      if (!seenValue.has(key)) {
        seenValue.add(key);
        results.push(found);
      }
    }
  }
  return results;
}
