export async function chatAndPatchPlan({ message, plan, t }) {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const translate = typeof t === 'function' ? t : (key, { fallback } = {}) => fallback ?? key
  const msg = (message || '').toLowerCase()
  const patched = structuredClone(plan)

  const scaleCosts = (factor) => {
    patched.daysPlan = patched.daysPlan.map((day) => ({
      ...day,
      items: day.items.map((item) => ({
        ...item,
        estimatedCost: Math.max(0, Math.round((item.estimatedCost || 0) * factor)),
        note: item.note,
      })),
    }))
  }

  const addItemToEachDay = (item) => {
    patched.daysPlan = patched.daysPlan.map((day) => ({
      ...day,
      items: [...day.items, item],
    }))
  }

  const replies = {
    default: translate('aiTrips.chatReplies.default', { fallback: 'تمام! عدّلت الخطة لك ✅' }),
    cheaper: translate('aiTrips.chatReplies.cheaper', {
      fallback: 'تم 👌 قلّلت التكاليف التقديرية وخليت الاقتراحات على خيارات اقتصادية.',
    }),
    nature: translate('aiTrips.chatReplies.nature', {
      fallback: 'جميل! ضفت نشاط طبيعة/مطل في نهاية كل يوم 🌿',
    }),
    restaurants: translate('aiTrips.chatReplies.restaurants', {
      fallback: 'تمام! ضفت اقتراح عشاء يومي + ترشيحات حسب الميزانية 🍽️',
    }),
    shopping: translate('aiTrips.chatReplies.shopping', {
      fallback: 'تم ✅ ضفت وقت للتسوق بعد العصر في كل يوم 🛍️',
    }),
    family: translate('aiTrips.chatReplies.family', {
      fallback: 'تمام! خليت الخطة عائلية أكثر ووسمت الأنشطة بأنها مناسبة للعائلة 👨‍👩‍👧‍👦',
    }),
    day2: translate('aiTrips.chatReplies.day2', {
      fallback: 'تم 👍 خليت اليوم الثاني أخف وقلّلت عدد الأنشطة عشان يكون مريح.',
    }),
  }

  const hasAny = (terms) => terms.some((term) => msg.includes(term))

  let reply = replies.default

  if (
    hasAny([
      'أرخص',
      'ارخص',
      'قلل',
      'اقتصادي',
      'cheap',
      'cheaper',
      'lower',
      'reduce',
      'budget',
      'less',
      'lower cost',
      'reduce cost',
    ])
  ) {
    scaleCosts(0.8)
    reply = replies.cheaper
  }

  if (hasAny(['طبيعة', 'nature', 'outdoor', 'scenic', 'scenery', 'views'])) {
    addItemToEachDay({
      time: '16:30',
      name: translate('aiTrips.chatItems.nature.name', {
        fallback: 'جلسة طبيعة / نقطة مطل',
      }),
      estimatedCost: 0,
      note: translate('aiTrips.chatItems.nature.note', {
        fallback: 'نشاط خارجي خفيف مناسب للتصوير والاسترخاء',
      }),
    })
    reply = replies.nature
  }

  if (hasAny(['مطاعم', 'أكل', 'اكل', 'food', 'restaurant', 'restaurants', 'dinner'])) {
    addItemToEachDay({
      time: '20:00',
      name: translate('aiTrips.chatItems.dinner.name', {
        fallback: 'عشاء (ترشيح مطعم حسب الميزانية)',
      }),
      estimatedCost: 110,
      note: translate('aiTrips.chatItems.dinner.note', {
        fallback: 'أقدر أخصصه: شعبي/فاخر/بحري',
      }),
    })
    reply = replies.restaurants
  }

  if (hasAny(['تسوق', 'سوق', 'shopping', 'mall', 'market'])) {
    addItemToEachDay({
      time: '18:30',
      name: translate('aiTrips.chatItems.shopping.name', {
        fallback: 'تسوق (سوق/مول/شارع مشهور)',
      }),
      estimatedCost: 0,
      note: translate('aiTrips.chatItems.shopping.note', {
        fallback: 'وقت مرن تقدر تزوده أو تقلله',
      }),
    })
    reply = replies.shopping
  }

  if (hasAny(['عائلية', 'عائلة', 'family'])) {
    const familyTitle = translate('aiTrips.chatFamily.title', { fallback: 'يوم عائلي' })
    const familySuffix = translate('aiTrips.chatFamily.noteSuffix', {
      fallback: ' — مناسب للعائلة',
    })
    patched.daysPlan = patched.daysPlan.map((day) => ({
      ...day,
      title: familyTitle,
      items: day.items.map((item) => ({
        ...item,
        note: `${item.note || ''}${familySuffix}`.trim(),
      })),
    }))
    reply = replies.family
  }

  if (hasAny(['اليوم الثاني', 'اليوم 2', 'day 2', 'second day', 'day two', 'day2'])) {
    const day2 = patched.daysPlan.find((day) => day.day === 2)
    if (day2) {
      day2.title = translate('aiTrips.chatDay2.title', { fallback: 'يوم خفيف' })
      day2.items = day2.items.slice(0, 3)
      reply = replies.day2
    }
  }

  return { reply, patchedPlan: patched }
}
