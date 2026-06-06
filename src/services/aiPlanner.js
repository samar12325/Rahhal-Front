export async function generatePlan(form, { t } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const translate = typeof t === 'function' ? t : (key, { fallback } = {}) => fallback ?? key
  const city = form.city || translate('aiTrips.plan.unknownCity', { fallback: 'وجهة غير محددة' })
  const days = Math.max(1, Number(form.days || 1))
  const minBudget = form.minBudget || 0
  const maxBudget = form.maxBudget || '∞'
  const isAllStyle = !form.style || form.style === 'all'
  const styleLabel = isAllStyle
    ? translate('aiTrips.styles.all', { fallback: 'الكل' })
    : translate(`aiTrips.styles.${form.style}`, { fallback: form.style })

  return {
    city,
    days,
    budgetLabel: `${minBudget} - ${maxBudget}`,
    daysPlan: Array.from({ length: days }).map((_, index) => ({
      day: index + 1,
      title: isAllStyle
        ? translate('aiTrips.plan.balancedTitle', { fallback: 'يوم متوازن' })
        : translate('aiTrips.plan.styleTitle', {
            fallback: `يوم ${styleLabel}`,
            params: { style: styleLabel },
          }),
      items: [
        {
          time: '09:00',
          name: translate('aiTrips.plan.items.breakfast.name', { fallback: 'فطور وتجهيز' }),
          estimatedCost: 60,
          note: translate('aiTrips.plan.items.breakfast.note', { fallback: 'اقتراح قريب من السكن' }),
        },
        {
          time: '11:00',
          name: translate('aiTrips.plan.items.attraction.name', { fallback: 'زيارة معلم/فعالية' }),
          estimatedCost: 120,
          note: translate('aiTrips.plan.items.attraction.note', { fallback: 'حسب تفضيلاتك' }),
        },
        {
          time: '15:00',
          name: translate('aiTrips.plan.items.lunch.name', { fallback: 'غداء' }),
          estimatedCost: 90,
          note: translate('aiTrips.plan.items.lunch.note', { fallback: 'مطعم مناسب للميزانية' }),
        },
        {
          time: '18:00',
          name: translate('aiTrips.plan.items.evening.name', { fallback: 'جولة مسائية' }),
          estimatedCost: 0,
          note: translate('aiTrips.plan.items.evening.note', { fallback: 'ممشى/كورنيش/سوق' }),
        },
      ],
    })),
  }
}
