const schoolTripNameTranslations = {
  en: {
    الرياض: 'Riyadh',
    جدة: 'Jeddah',
    العلا: 'AlUla',
    أبها: 'Abha',
    الخبر: 'Khobar',
    الطائف: 'Taif',
    'المتحف الوطني': 'National Museum',
    'حديقة الملك عبدالله': 'King Abdullah Park',
    'الواجهة البحرية': 'Waterfront',
    'جدة التاريخية': 'Historic Jeddah',
    'فقيه أكواريوم': 'Fakieh Aquarium',
    'متحف الطيبات': 'Tayebat Museum',
  },
}

const schoolTripTitleTranslations = {
  en: {
    س: 'S',
    'رحلة مكهه': 'Makkah trip',
    'اختبار رحلة مدرسية': 'School trip test',
    'برنامج مدرسي – الرياض': 'School program - Riyadh',
  },
}

const schoolTripSchoolTranslations = {
  en: {
    'مدرسة سمورة العسل': 'Samourat Al Asal School',
    'مدرسه 123': 'School 123',
    'مدرسة 1': 'School 1',
    'مدرسة 2': 'School 2',
  },
}

const schoolTripMeetingPointTranslations = {
  en: {
    'نقطة تجمع 1': 'Meeting point 1',
    'نقطة تجمع 2': 'Meeting point 2',
    ثثتنن: 'TBD',
    اا: 'TBD',
    ثث: 'TBD',
    '33': 'Gate 33',
  },
}

const schoolTripGradeTranslations = {
  en: {
    ابتدائي: 'Primary',
    متوسط: 'Middle school',
    ثانوي: 'High school',
  },
}

const schoolTripTransportTranslations = {
  en: {
    bus: 'School bus',
    no_bus: 'No bus',
    privateBuses: 'Private buses',
    schoolBuses: 'School buses',
    noTransport: 'No transport',
  },
}

const schoolTripApprovalTranslations = {
  en: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },
}

const transportKeyMap = {
  bus: 'bus',
  no_bus: 'noTransport',
  noTransport: 'noTransport',
  privateBuses: 'privateBuses',
  schoolBuses: 'schoolBuses',
}

const gradeKeys = new Set(['g4', 'g5', 'g6', 'm1', 'm2', 'm3', 'h1', 'h2', 'h3'])

export const localizeSchoolTripName = (language, value) => {
  if (!value || language === 'ar') return value
  return schoolTripNameTranslations[language]?.[value] ?? value
}

export const localizeSchoolTripTitle = (language, value) => {
  if (!value || language === 'ar') return value
  return schoolTripTitleTranslations[language]?.[value] ?? value
}

export const localizeSchoolTripSchool = (language, value) => {
  if (!value || language === 'ar') return value
  return schoolTripSchoolTranslations[language]?.[value] ?? value
}

export const localizeSchoolTripMeetingPoint = (language, value) => {
  if (!value || language === 'ar') return value
  return schoolTripMeetingPointTranslations[language]?.[value] ?? value
}

export const localizeSchoolTripGrade = (language, value, t) => {
  if (!value) return value

  if (gradeKeys.has(value)) {
    return t(`schoolTrips.grades.${value}`, { fallback: value })
  }

  if (language === 'ar') return value
  return schoolTripGradeTranslations[language]?.[value] ?? value
}

export const localizeSchoolTripTransport = (language, value, t) => {
  if (!value) return value

  const transportKey = transportKeyMap[value]
  if (transportKey) {
    const fallback =
      schoolTripTransportTranslations[language]?.[value] ??
      schoolTripTransportTranslations[language]?.[transportKey] ??
      value

    return t(`schoolTrips.transports.${transportKey}`, { fallback })
  }

  if (language === 'ar') return value
  return schoolTripTransportTranslations[language]?.[value] ?? value
}

export const localizeApprovalStatus = (language, value) => {
  if (!value || language === 'ar') return value
  return schoolTripApprovalTranslations[language]?.[value] ?? value
}
