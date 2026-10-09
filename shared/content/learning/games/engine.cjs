function normalizeAnswer(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,;:!?()\[\]{}"“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function answerMatches(answer, accepted = []) {
  const normalized = normalizeAnswer(answer);
  return accepted.some((candidate) => normalizeAnswer(candidate) === normalized);
}

function evaluateGameItem(game, item, submittedAnswer) {
  if (game.game_type === 'multiple_choice') {
    const selected = Number(submittedAnswer);
    return Array.isArray(item.correct) ? item.correct.includes(selected) : selected === Number(item.correct);
  }
  if (game.game_type === 'true_false') return Boolean(submittedAnswer) === Boolean(item.correct);
  if (game.game_type === 'fill_blank') return answerMatches(submittedAnswer, item.accepted_answers || [item.answer]);
  if (game.game_type === 'scripture_linking') return Object.entries(item.links || {}).every(([key, value]) => normalizeAnswer(submittedAnswer?.[key]) === normalizeAnswer(value));
  if (game.game_type === 'matching' || game.game_type === 'symbolism') return (item.pairs || []).every((pair) => normalizeAnswer(submittedAnswer?.[pair.prompt]) === normalizeAnswer(pair.answer));
  return false;
}

module.exports = { normalizeAnswer, evaluateGameItem };
