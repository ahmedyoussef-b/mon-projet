export enum Directions {
  RTL = 'rtl',
  LTR = 'ltr',
}

export enum Languages {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

export enum Routes {
  ROOT = '/',
  MENU = 'menu',
  ABOUT = 'about',
  CONTACT = 'contact',
  AUTH = 'auth',
  CART = 'cart',
}

export enum Pages {
  LOGIN = 'signin',
  Register = 'signup',
}

export enum InputTypes {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATE_TIME_LOCAL = 'datetime-local',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  FILE = 'file',
  IMAGE = 'image',
  COLOR = 'color',
  RANGE = 'range',
  TEL = 'tel',
  URL = 'url',
  SEARCH = 'search',
  MONTH = 'month',
  WEEK = 'week',
  HIDDEN = 'hidden',
  MULTI_SELECT = 'multi select',
}

export enum Navigate {
  NEXT = 'next',
  PREV = 'prev',
}
export enum Responses {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  STATUS = 'status',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export enum AuthMessages {
  LOGIN_SUCCESS = 'Login successfully',
  LOGOUT_SUCCESS = 'Logout successfully',
  REGISTER_SUCCESS = 'Register successfully',
  FORGET_PASSWORD_SUCCESS = 'Forget password successfully',
  RESET_PASSWORD_SUCCESS = 'Reset password successfully',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum Environments {
  PROD = 'production',
  DEV = 'development',
}
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const donnees = [
  {
instrument:"LSHH001",
    reglage: "1000 mm",
    action: "Alarme + Déclenchement TVcc",
    type_vanne: null,
    alarme: true,
    interdiction_pompes: false,
  },
  {
instrument:"LSH004",
    reglage: "800 mm",
    action: "Alarme + ouverture de la vanne de décharge puis condenseur LV001 vers bâche tampon",
    type_vanne: null,
    alarme: true,
    interdiction_pompes: false,
  },
  {
    instrument:"LSH003",
    reglage: "750 mm",
    action: "Alarme",
    type_vanne: null,
    alarme: true,
    interdiction_pompes: false,
  },
  {
instrument:"LSH002",
    reglage: "700 mm",
    action: "Fermeture de la vanne LV001",
    type_vanne: null,
    alarme: false,
    interdiction_pompes: false,
  },
  {
instrument:"LSH001",
    reglage: "630 mm",
    action: "Fermeture de la vanne d’appoint normal CAP LV001 et d’appoint rapide CAP UV001",
    type_vanne: null,
    alarme: false,
    interdiction_pompes: false,
  },
  {
instrument:null,
    reglage: "610 mm",
    action: "marche normale c'est le niveau de travaille",
    type_vanne: "normal",
    alarme: false,
    interdiction_pompes: false,
  },
  {
instrument:"LSL001",
    reglage: "580 mm",
    action: "Ouverture vanne d’appoint normal CAP LV001",
    type_vanne: "normal",
    alarme: false,
    interdiction_pompes: false,
  },
  {
instrument:"LSL002",
    reglage: "530 mm",
    action: "Ouverture vanne d’appoint rapide CAP UV001",
    type_vanne: "normal",
    alarme: false,
    interdiction_pompes: false,
  },
  {
instrument:"LSL003",
    reglage: "370 mm",
    action: "Alarme + interdiction de démarrage des pompes CEX",
    type_vanne: null,
    alarme: true,
    interdiction_pompes: true,
  },
  {
    instrument:"LSLL001",
    reglage: "240 mm",
    action: "Alarme + declanchement de la pompe CEX",
    type_vanne: null,
    alarme: true,
    interdiction_pompes: true,
  },
];