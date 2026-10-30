export type StyleAnswers = {
  audience: "" | "men" | "kids"
  occasion: "" | "everyday" | "smart" | "layers"
  palette: "" | "earth" | "mono" | "light"
}

export const emptyStyleAnswers: StyleAnswers = {
  audience: "",
  occasion: "",
  palette: "",
}

export const styleLabels = {
  audience: { men: "عالم الرجال", kids: "عالم الأطفال" },
  occasion: {
    everyday: "يوم براحتك",
    smart: "خروجة مرتّبة",
    layers: "وقت للطبقات",
  },
  palette: { earth: "درجات دافية", mono: "تباين هادئ", light: "درجات فاتحة" },
}

// Editorial rankings only: no inferred sizes, new variants, or live-stock claims.
const occasionEdits = {
  men: {
    everyday: [128, 118, 86, 141, 93, 98],
    smart: [98, 93, 118, 141, 128, 86],
    layers: [141, 86, 93, 128, 118, 98],
  },
  kids: {
    everyday: [105, 123, 111, 134],
    smart: [134, 123, 111, 105],
    layers: [111, 134, 123, 105],
  },
}
const paletteEdits = {
  men: { earth: [141, 86], mono: [93, 98, 128], light: [86, 118] },
  kids: { earth: [134, 111], mono: [111, 105], light: [123, 105] },
}

export function recommendStyle(answers: StyleAnswers) {
  if (!answers.audience || !answers.occasion || !answers.palette) return []
  const order = occasionEdits[answers.audience][answers.occasion]
  const palette: number[] = paletteEdits[answers.audience][answers.palette]
  return order
    .map((id, index) => ({
      id,
      score: order.length - index + (palette.includes(id) ? 3 : 0),
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((item) => item.id)
}
