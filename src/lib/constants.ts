export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export const REGISTRATION_METHODS = {
  internal: "internal",
  apple: "apple",
  google: "google",
};

export type BarValidation = {
  rule: RegExp;
  message: string;
};

type BarValidationRules = {
  [key: string]: BarValidation;
};

export const STATE_BAR_VALIDATION_RULES: BarValidationRules = {
  AL: {
    rule: /^\d{5,6}$/,
    message: "Alabama bar number must have 5 or 6 digits.",
  },
  AK: {
    rule: /^\d{5}$/,
    message: "Alaska bar number must have exactly 5 digits.",
  },
  AZ: {
    rule: /^\d{4,5}$/,
    message: "Arizona bar number must have 4 or 5 digits.",
  },
  AR: {
    rule: /^\d{4}$/,
    message: "Arkansas bar number must have exactly 4 digits.",
  },
  CA: {
    rule: /^\d{6}$/,
    message: "California bar number must have exactly 6 digits.",
  },
  CO: {
    rule: /^\d{5}$/,
    message: "Colorado bar number must have exactly 5 digits.",
  },
  CT: {
    rule: /^\d{5,6}$/,
    message: "Connecticut bar number must have 5 or 6 digits.",
  },
  DE: {
    rule: /^\d{5}$/,
    message: "Delaware bar number must have exactly 5 digits.",
  },
  FL: {
    rule: /^\d{5,6}$/,
    message: "Florida bar number must have 5 or 6 digits.",
  },
  GA: {
    rule: /^\d{6}$/,
    message: "Georgia bar number must have exactly 6 digits.",
  },
  HI: {
    rule: /^\d{5}$/,
    message: "Hawaii bar number must have exactly 5 digits.",
  },
  ID: {
    rule: /^\d{4}$/,
    message: "Idaho bar number must have exactly 4 digits.",
  },
  IL: {
    rule: /^\d{6}$/,
    message: "Illinois bar number must have exactly 6 digits.",
  },
  IN: {
    rule: /^\d{5}$/,
    message: "Indiana bar number must have exactly 5 digits.",
  },
  IA: {
    rule: /^\d{4,5}$/,
    message: "Iowa bar number must have 4 or 5 digits.",
  },
  KS: {
    rule: /^\d{5}$/,
    message: "Kansas bar number must have exactly 5 digits.",
  },
  KY: {
    rule: /^\d{4,5}$/,
    message: "Kentucky bar number must have 4 or 5 digits.",
  },
  LA: {
    rule: /^\d{5}$/,
    message: "Louisiana bar number must have exactly 5 digits.",
  },
  ME: {
    rule: /^\d{5}$/,
    message: "Maine bar number must have exactly 5 digits.",
  },
  MD: {
    rule: /^\d{6}$/,
    message: "Maryland bar number must have exactly 6 digits.",
  },
  MA: {
    rule: /^\d{5}$/,
    message: "Massachusetts bar number must have exactly 5 digits.",
  },
  MI: {
    rule: /^\d{6}$/,
    message: "Michigan bar number must have exactly 6 digits.",
  },
  MN: {
    rule: /^\d{5,6}$/,
    message: "Minnesota bar number must have 5 or 6 digits.",
  },
  MS: {
    rule: /^\d{5,6}$/,
    message: "Mississippi bar number must have 5 or 6 digits.",
  },
  MO: {
    rule: /^\d{5}$/,
    message: "Missouri bar number must have exactly 5 digits.",
  },
  MT: {
    rule: /^\d{4,5}$/,
    message: "Montana bar number must have 4 or 5 digits.",
  },
  NE: {
    rule: /^\d{5}$/,
    message: "Nebraska bar number must have exactly 5 digits.",
  },
  NV: {
    rule: /^\d{5}$/,
    message: "Nevada bar number must have exactly 5 digits.",
  },
  NH: {
    rule: /^\d{5}$/,
    message: "New bar number must haveHampshire: exactly 5 digits.",
  },
  NJ: {
    rule: /^\d{6}$/,
    message: "New bar number must haveJersey: exactly 6 digits.",
  },
  NM: {
    rule: /^\d{4,5}$/,
    message: "New bar number must haveMexico: 4 or 5 digits.",
  },
  NY: {
    rule: /^\d{7}$/,
    message: "New bar number must haveYork: exactly 7 digits.",
  },
  NC: {
    rule: /^\d{5,6}$/,
    message: "North bar number must haveCarolina: 5 or 6 digits.",
  },
  ND: {
    rule: /^\d{5}$/,
    message: "North bar number must haveDakota: exactly 5 digits.",
  },
  OH: {
    rule: /^\d{6}$/,
    message: "Ohio bar number must have exactly 6 digits.",
  },
  OK: {
    rule: /^\d{4,5}$/,
    message: "Oklahoma bar number must have 4 or 5 digits.",
  },
  OR: {
    rule: /^\d{4,5}$/,
    message: "Oregon bar number must have 4 or 5 digits.",
  },
  PA: {
    rule: /^\d{6}$/,
    message: "Pennsylvania bar number must have exactly 6 digits.",
  },
  RI: {
    rule: /^\d{5,6}$/,
    message: "Rhode bar number must haveIsland: 5 or 6 digits.",
  },
  SC: {
    rule: /^\d{5,6}$/,
    message: "South bar number must haveCarolina: 5 or 6 digits.",
  },
  SD: {
    rule: /^\d{5}$/,
    message: "South bar number must haveDakota: exactly 5 digits.",
  },
  TN: {
    rule: /^\d{5}$/,
    message: "Tennessee bar number must have exactly 5 digits.",
  },
  TX: {
    rule: /^\d{10}$/,
    message: "Texas bar number must have exactly 10 digits.",
  },
  UT: {
    rule: /^\d{5,6}$/,
    message: "Utah bar number must have 5 or 6 digits.",
  },
  VT: {
    rule: /^\d{5}$/,
    message: "Vermont bar number must have exactly 5 digits.",
  },
  VA: {
    rule: /^\d{6}$/,
    message: "Virginia bar number must have exactly 6 digits.",
  },
  WA: {
    rule: /^\d{5,6}$/,
    message: "Washington bar number must have 5 or 6 digits.",
  },
  WV: {
    rule: /^\d{4,5}$/,
    message: "West bar number must haveVirginia: 4 or 5 digits.",
  },
  WI: {
    rule: /^\d{6}$/,
    message: "Wisconsin bar number must have exactly 6 digits.",
  },
  WY: {
    rule: /^\d{5}$/,
    message: "Wyoming bar number must have exactly 5 digits.",
  },
  DC: {
    rule: /^\d{5,6}$/,
    message: "Washington D.C. bar number must have 5 or 6 digits.",
  },
};

export const US_STATES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "Washington D.C.",
};
