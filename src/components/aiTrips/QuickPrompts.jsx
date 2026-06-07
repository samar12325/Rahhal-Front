const DEFAULT_PROMPTS = [
  'خلّها أرخص',
  'زود نشاطات طبيعة',
  'أبغى مطاعم أكثر',
  'خلّ اليوم الثاني خفيف',
  'ضيف وقت للتسوق',
  'بدّلها لرحلة عائلية',
]

function QuickPrompts({ prompts = DEFAULT_PROMPTS, onPick }) {
  return (
    <div className="chipRow quickPromptRow">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="tag quickPromptButton"
          onClick={() => onPick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

export default QuickPrompts
