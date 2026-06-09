export interface DiseaseInfo {
  fullName: string;
  description: string;
  suggestions: string[];
  urgency: 'None' | 'Low' | 'Moderate' | 'High';
  urgencyColor: string;
  category: string;
}

export const DISEASE_INFO: Record<string, DiseaseInfo> = {
  Acne: {
    fullName: 'Acne Vulgaris',
    description:
      'A common inflammatory skin condition where hair follicles become plugged with oil and dead skin cells, causing pimples, blackheads, and whiteheads. Often triggered by hormones, stress, and diet.',
    suggestions: [
      'Wash face twice daily with a gentle, non-comedogenic cleanser',
      'Apply benzoyl peroxide (2.5%–5%) or salicylic acid to affected areas',
      'Use oil-free, non-comedogenic moisturizer and SPF 30+ sunscreen daily',
      'Avoid touching or picking at blemishes to prevent scarring',
      'Change pillowcases regularly and keep hair products off the face',
      'Consult a dermatologist for prescription retinoids or antibiotics if severe',
    ],
    urgency: 'Low',
    urgencyColor: 'blue',
    category: 'Inflammatory',
  },
  Eczema: {
    fullName: 'Atopic Dermatitis (Eczema)',
    description:
      'A chronic inflammatory skin condition causing dry, itchy, and inflamed skin. Strongly linked to allergies and immune dysregulation. Flares can be triggered by soaps, fabrics, temperature changes, and stress.',
    suggestions: [
      'Moisturize immediately after bathing with fragrance-free cream or ointment',
      'Use mild, unscented soaps and laundry detergents',
      'Identify and avoid personal triggers (dust mites, pet dander, harsh fabrics)',
      'Apply OTC 1% hydrocortisone cream for mild flares',
      'Wear soft, breathable cotton clothing and keep nails short',
      'Consult a dermatologist for prescription corticosteroids or biologics (dupilumab)',
    ],
    urgency: 'Moderate',
    urgencyColor: 'amber',
    category: 'Inflammatory',
  },
  Psoriasis: {
    fullName: 'Psoriasis Vulgaris',
    description:
      'A chronic autoimmune condition causing rapid skin cell turnover, resulting in scaly, raised, red plaques. It is not contagious but is lifelong. Associated with joint problems (psoriatic arthritis) in some patients.',
    suggestions: [
      'Apply thick moisturizing creams or ointments to keep skin hydrated',
      'Use medicated shampoos with coal tar or salicylic acid for scalp involvement',
      'Discuss narrowband UVB phototherapy with your dermatologist',
      'Avoid triggers: stress, smoking, alcohol, skin injury (Koebner phenomenon)',
      'Ask about biologic medications (adalimumab, secukinumab) for moderate-severe cases',
      'Regular follow-up with a dermatologist is essential for monitoring',
    ],
    urgency: 'Moderate',
    urgencyColor: 'orange',
    category: 'Autoimmune',
  },
  Vitiligo: {
    fullName: 'Vitiligo',
    description:
      'An autoimmune condition where patches of skin lose their pigment (melanin), resulting in white or depigmented areas. It can affect any body part and may be associated with other autoimmune conditions.',
    suggestions: [
      'Apply broad-spectrum SPF 50+ sunscreen to all skin, especially depigmented areas',
      'Use camouflage cosmetics or skin-colored self-tanners to even skin tone',
      'Ask your dermatologist about topical calcineurin inhibitors (tacrolimus, pimecrolimus)',
      'Explore narrowband UVB phototherapy or excimer laser treatment',
      'Consider psychological support — vitiligo can significantly impact self-image',
      'Regular dermatologist monitoring for disease progression and repigmentation',
    ],
    urgency: 'Low',
    urgencyColor: 'purple',
    category: 'Autoimmune',
  },
  Warts: {
    fullName: 'Verruca Vulgaris (Warts)',
    description:
      'Benign skin growths caused by human papillomavirus (HPV), appearing as rough, raised bumps. They spread through direct contact and minor skin breaks. Most resolve without treatment within 2 years.',
    suggestions: [
      'Apply OTC salicylic acid preparation daily after soaking the area in warm water',
      'Seek cryotherapy (liquid nitrogen) treatment from a healthcare provider',
      'Keep warts covered with a bandage or tape to prevent spreading',
      'Avoid picking, cutting, or shaving near warts',
      'Practise good hand hygiene; do not share towels or shoes',
      'Consult a doctor if warts spread rapidly, are on the face/genitals, or bleed frequently',
    ],
    urgency: 'Low',
    urgencyColor: 'green',
    category: 'Viral',
  },
  Tinea: {
    fullName: 'Tinea (Ringworm / Dermatophytosis)',
    description:
      'A common fungal infection of the skin caused by dermatophytes. Presents as ring-shaped, scaly, itchy patches. Can affect the body (tinea corporis), feet (athlete\'s foot), groin (jock itch), or scalp (tinea capitis).',
    suggestions: [
      'Apply antifungal cream (clotrimazole or miconazole) twice daily for 2–4 weeks',
      'Keep the affected area clean and thoroughly dry — moisture promotes growth',
      'Wear loose-fitting, moisture-wicking clothing and change socks daily',
      'Avoid sharing towels, shoes, or clothing with others',
      'Wash bed linens and clothes in hot water during treatment',
      'See a doctor for oral antifungals (terbinafine) if topical treatment fails in 4 weeks',
    ],
    urgency: 'Low',
    urgencyColor: 'teal',
    category: 'Fungal',
  },
  Rosacea: {
    fullName: 'Rosacea',
    description:
      'A chronic inflammatory skin condition primarily affecting the face, causing persistent redness, visible blood vessels, and sometimes pimple-like bumps. Triggered by sun, heat, alcohol, spicy food, and stress.',
    suggestions: [
      'Identify and strictly avoid personal triggers (sun, heat, alcohol, spicy food, stress)',
      'Use gentle, non-irritating, fragrance-free skincare products only',
      'Apply broad-spectrum SPF 30+ sunscreen every morning',
      'Ask a dermatologist about topical metronidazole, azelaic acid, or brimonidine',
      'Consider laser or light-based therapy (IPL) for persistent redness and visible vessels',
      'Avoid rubbing, scrubbing, or massaging the face vigorously',
    ],
    urgency: 'Moderate',
    urgencyColor: 'red',
    category: 'Inflammatory',
  },
  Candidiasis: {
    fullName: 'Cutaneous Candidiasis',
    description:
      'A fungal skin infection caused by Candida yeast, often affecting moist skin folds (underarms, groin, under breasts). Presents as red, itchy, moist patches with satellite lesions. Common in people with diabetes or weakened immunity.',
    suggestions: [
      'Apply antifungal cream (clotrimazole or nystatin) to affected skin folds',
      'Keep affected areas clean and thoroughly dry after washing',
      'Wear breathable, moisture-wicking underwear and loose clothing',
      'Change wet clothing (swimwear, gym clothes) promptly',
      'Consider probiotic supplements to help restore healthy microbial balance',
      'Consult a doctor for oral fluconazole if infection is widespread or recurrent',
    ],
    urgency: 'Moderate',
    urgencyColor: 'yellow',
    category: 'Fungal',
  },
  Seborrh_Keratoses: {
    fullName: 'Seborrheic Keratosis',
    description:
      'Common benign skin growths appearing as waxy, scaly, "stuck-on" patches, often brown or black. They are associated with aging and are not contagious or precancerous, though they may look alarming.',
    suggestions: [
      'Usually benign — routine monitoring by a dermatologist is typically all that is needed',
      'Consult a dermatologist urgently if lesions bleed, change rapidly, or look atypical',
      'Do not attempt removal at home — high risk of infection and scarring',
      'Medical removal options: cryotherapy, curettage, electrosurgery, or laser ablation',
      'Protect skin from excessive UV exposure with SPF 30+ sunscreen',
      'Photograph lesions periodically to track any changes in size, shape, or colour',
    ],
    urgency: 'Low',
    urgencyColor: 'slate',
    category: 'Benign Growth',
  },
  Unknown_Normal: {
    fullName: 'No Specific Condition Detected',
    description:
      'The AI analysis did not identify a clear dermatological condition. The skin appears within normal parameters, or the image quality or angle may have affected the prediction accuracy. This is not necessarily cause for concern.',
    suggestions: [
      'Maintain a consistent skincare routine: gentle cleanser, fragrance-free moisturizer, SPF 30+',
      'Stay well hydrated and eat a balanced diet rich in vitamins A, C, D, and E',
      'Monitor any new or changing skin areas and photograph them for comparison over time',
      'Schedule an annual full-body skin examination with a dermatologist',
      'Try uploading a clearer, well-lit, close-up photograph for better AI accuracy',
      'If symptoms persist or worsen, consult a healthcare professional without delay',
    ],
    urgency: 'None',
    urgencyColor: 'green',
    category: 'Normal',
  },
};

export function getDiseaseInfo(disease: string): DiseaseInfo {
  return DISEASE_INFO[disease] ?? DISEASE_INFO['Unknown_Normal'];
}
