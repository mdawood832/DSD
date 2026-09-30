import type { Topic } from '../types'

/** Seed knowledge topics, before a content plan is attached (see `seedTopics`). */
export const RAW_TOPICS: Omit<Topic, 'plan'>[] = [
  {
    id: 'candidacy',
    status: 'clinical_review',
    title: 'Am I a candidate for implants if I have bone loss?',
    cluster: 38,
    audience: 'Pre-consultation patients',
    existing: 'No current resource',
    why: 'Wide content gap, high clinical complexity, and patients arriving after being turned away elsewhere.',
    sig: { Frequency: 70, Anxiety: 74, 'Content gap': 88, 'Search demand': 66, 'Business value': 76, Complexity: 82 },
    answer:
      'Honestly, bone loss almost never means the door is closed. When another office tells you there isn’t enough bone, nine times out of ten that just means it’s not something they do, not that it can’t be done. What we’d do is rebuild the area first with a graft, let it heal up, and then place the implant. I’ve had a lot of patients who were told “no” somewhere else walk out of here with a real plan.',
    claims: [
      {
        label: 'Bone grafting and sinus augmentation can rebuild deficient sites for implants.',
        evidence: [
          {
            source: 'PubMed',
            cite: 'Int J Oral Maxillofac Implants, 2020',
            detail: 'Systematic review reports implant survival in grafted sites comparable to placement in native bone over 5+ years.',
          },
        ],
      },
      {
        label: 'A prior decline may reflect a clinic’s scope, not a true contraindication.',
        evidence: [
          {
            source: 'Guideline',
            cite: 'ITI Treatment Guide, Vol. 7',
            detail: 'Advanced augmentation protocols expand candidacy well beyond conventional anatomical limits.',
          },
        ],
      },
    ],
    excerpts: [
      {
        patient: 'Another office told me I don’t have enough bone for implants. Is there really nothing I can do?',
        clinician:
          'Bone loss doesn’t automatically rule out implants, grafting can rebuild the area, and we place implants in cases that weren’t possible a few years ago.',
      },
    ],
  },
  {
    id: 'sedation',
    status: 'clinical_review',
    title: 'Will I be awake during the procedure? Sedation options',
    cluster: 27,
    audience: 'Anxious / dental-phobic patients',
    existing: '1 thin FAQ entry',
    why: 'High anxiety signal with strong search demand; current coverage is shallow.',
    sig: { Frequency: 60, Anxiety: 78, 'Content gap': 58, 'Search demand': 62, 'Business value': 52, Complexity: 44 },
    answer:
      'You won’t feel the procedure, and you don’t have to be wide awake for it either. Some folks are perfectly fine with just the numbing, and others would rather be more relaxed, for them we can do oral sedation or IV sedation. Most of my anxious patients go that route and honestly barely remember being in the chair. And you’re monitored the whole time, so you’re safe throughout.',
    claims: [
      {
        label: 'Implants can be placed under local anesthesia alone or with oral/IV sedation.',
        evidence: [
          {
            source: 'PubMed',
            cite: 'Anesth Prog, 2019',
            detail: 'Outpatient IV sedation for implant surgery shows a strong safety profile with appropriate monitoring.',
          },
        ],
      },
      {
        label: 'Sedated patients often retain little memory of the procedure.',
        evidence: [
          {
            source: 'Reference',
            cite: 'ADA Anxiety & Sedation guidance',
            detail: 'Anterograde amnesia is a common, expected effect of moderate sedation agents.',
          },
        ],
      },
    ],
    excerpts: [
      {
        patient: 'I don’t think I can handle being awake for this. Is sedation an option?',
        clinician: 'Absolutely, we offer everything from local numbing to oral and IV sedation, so we can match your comfort level.',
      },
    ],
  },
  {
    id: 'whitening',
    status: 'clinical_review',
    title: 'Will my implant look different from my natural teeth over time?',
    cluster: 14,
    audience: 'Cosmetically-conscious patients',
    existing: 'No current resource',
    why: 'Lower-frequency question, but worth a quick, reassuring answer for aesthetics-focused patients.',
    sig: { Frequency: 34, Anxiety: 28, 'Content gap': 36, 'Search demand': 30, 'Business value': 32, Complexity: 38 },
    answer:
      'The crown on your implant is custom-shaded to match your surrounding teeth, and unlike natural enamel it won’t discolor over time. With normal brushing and cleanings, it should blend in for the life of the implant.',
    claims: [
      {
        label: 'Implant crowns are shade-matched to adjacent natural teeth at placement.',
        evidence: [
          {
            source: 'Reference',
            cite: 'ADA patient education materials',
            detail: 'Ceramic crown shade selection is standard practice to match surrounding dentition.',
          },
        ],
      },
    ],
    excerpts: [
      {
        patient: 'Will it look fake or turn a weird color after a while?',
        clinician: 'No, the crown is matched to your other teeth and it won’t discolor like natural enamel can.',
      },
    ],
  },
  {
    id: 'pain',
    status: 'clinical_review',
    title: 'Does getting an implant hurt?',
    cluster: 52,
    audience: 'Pre-consultation patients',
    existing: 'Outdated blog post',
    why: 'Highest-frequency question and the top emotional barrier to scheduling.',
    sig: { Frequency: 92, Anxiety: 90, 'Content gap': 74, 'Search demand': 84, 'Business value': 82, Complexity: 40 },
    answer:
      'I tell people this all the time, placing the implant is usually easier than the tooth extraction that came before it. We numb everything up, so during the procedure you feel some pressure but not pain. Afterward you’re a little sore for a day or two, but most folks get by just fine on ibuprofen. It’s really not the ordeal people brace themselves for.',
    claims: [
      {
        label: 'Implant placement is performed under local anesthesia, so the procedure itself is not painful.',
        evidence: [
          {
            source: 'PubMed',
            cite: 'J Oral Implantol, 2021',
            detail: 'Patient-reported pain during placement under local anesthesia is consistently low; most report pressure rather than pain.',
          },
        ],
      },
      {
        label: 'Post-operative discomfort is typically mild and managed with over-the-counter analgesics.',
        evidence: [
          {
            source: 'Guideline',
            cite: 'ITI Treatment Guide, Vol. 3',
            detail: 'NSAIDs such as ibuprofen are first-line for routine implant post-op pain; most patients resume normal activity within 1–2 days.',
          },
        ],
      },
      {
        label: 'Single-implant placement is often less invasive than the extraction that preceded it.',
        evidence: [
          {
            source: 'Reference',
            cite: 'AAOMS patient guidance',
            detail: 'For uncomplicated sites, surgical trauma from placement is frequently less than that of the prior extraction.',
          },
        ],
      },
    ],
    excerpts: [
      {
        patient: 'I’m honestly terrified it’s going to hurt. How bad is it really?',
        clinician: 'Placing the implant is usually easier than the extraction that came before it, we numb everything, so you feel pressure, not pain.',
      },
      {
        patient: 'How long am I going to be in pain afterward?',
        clinician: 'A little sore for a day or two. Most people are fine on ibuprofen and back to their routine quickly.',
      },
    ],
  },
  {
    // An already-approved copy of the pain topic so the Create tab has it from the start.
    id: 'cost',
    status: 'approved',
    approvedBy: 'Dr. M. Okafor',
    approvedDate: 'Jun 23, 2026',
    title: 'Does getting an implant hurt?',
    cluster: 52,
    audience: 'Pre-consultation patients',
    existing: 'Outdated blog post',
    why: 'Highest-frequency question and the top emotional barrier to scheduling a consultation.',
    sig: { Frequency: 92, Anxiety: 90, 'Content gap': 74, 'Search demand': 84, 'Business value': 82, Complexity: 40 },
    answer:
      'I tell people this all the time, placing the implant is usually easier than the tooth extraction that came before it. We numb everything up, so during the procedure you feel some pressure but not pain. Afterward you’re a little sore for a day or two, but most folks get by just fine on ibuprofen. It’s really not the ordeal people brace themselves for.',
    sources: [
      { source: 'PubMed', cite: 'J Oral Implantol, 2021, patient-reported pain during placement' },
      { source: 'ITI Guideline', cite: 'Treatment Guide, Vol. 3, post-op pain management' },
      { source: 'ADA', cite: 'Patient education materials, local anesthesia and post-op analgesia' },
    ],
  },
  {
    id: 'recovery',
    status: 'planned',
    approvedBy: 'Dr. R. Almeida',
    approvedDate: 'Jun 20, 2026',
    title: 'What is recovery and aftercare like?',
    cluster: 33,
    audience: 'Post-op patients',
    existing: 'Printed handout',
    why: 'Patients overestimate downtime; clear expectations reduce anxious follow-up calls.',
    sig: { Frequency: 68, Anxiety: 66, 'Content gap': 72, 'Search demand': 58, 'Business value': 58, Complexity: 50 },
    answer:
      'Most people are honestly surprised how quick they bounce back, a day or two and you’re back to your routine. You’ll be a little puffy and tender for about a week, so stick to soft foods early and take it easy. The implant itself takes a few months to fully fuse with the bone underneath, but that part happens quietly in the background, you won’t feel it working.',
    sources: [
      { source: 'PubMed', cite: 'Clin Oral Implants Res, 2020, osseointegration timeline' },
      { source: 'ITI Guideline', cite: 'Treatment Guide, Vol. 3, post-op recovery' },
    ],
  },
  {
    id: 'vsbridge',
    status: 'published',
    approvedBy: 'Dr. M. Okafor',
    approvedDate: 'Jun 9, 2026',
    title: 'Implant vs. bridge, which is right for me?',
    cluster: 41,
    audience: 'Decision-stage patients',
    existing: 'None',
    why: 'Decision-stage topic with high search demand and direct revenue impact.',
    sig: { Frequency: 74, Anxiety: 48, 'Content gap': 66, 'Search demand': 80, 'Business value': 70, Complexity: 54 },
    answer:
      'Here’s how I put it to patients: a bridge is cheaper today, but it means grinding down the healthy teeth on either side, and you’ll probably be replacing it in ten or fifteen years. An implant stands on its own and leaves your other teeth alone, and it often lasts decades. So the “cheaper” option isn’t always cheaper once you do the math over time.',
    sources: [
      { source: 'Cochrane', cite: 'Review, 2021, fixed partial denture vs. implant' },
      { source: 'PubMed', cite: 'J Dent, 2018, abutment tooth survival' },
    ],
    metrics: { views: '5.1k', search: '+34%', engage: '742', consults: '21' },
  },
  {
    id: 'insurance',
    status: 'published',
    approvedBy: 'Dr. R. Almeida',
    approvedDate: 'Jun 6, 2026',
    title: 'Does insurance cover dental implants?',
    cluster: 19,
    audience: 'Cost-sensitive patients',
    existing: 'FAQ stub',
    why: 'Recurring billing confusion; clear coverage guidance improves consultation readiness.',
    sig: { Frequency: 58, Anxiety: 50, 'Content gap': 54, 'Search demand': 70, 'Business value': 64, Complexity: 34 },
    answer:
      'Coverage really depends on your plan, some cover part of it, especially when there’s a medical reason, and some don’t cover much at all. Bring your plan details to your visit and we’ll have our coordinator give you a straight answer and lay out the financing, so there are no surprises down the line.',
    sources: [{ source: 'ADA', cite: 'Dental benefits & medical-necessity coverage' }],
    metrics: { views: '2.8k', search: '+22%', engage: '318', consults: '9' },
  },
]
