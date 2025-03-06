"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donnees = exports.UserRole = exports.Environments = exports.Methods = exports.AuthMessages = exports.SortBy = exports.SortOrder = exports.Responses = exports.Navigate = exports.InputTypes = exports.Pages = exports.Routes = exports.Languages = exports.Directions = void 0;
var Directions;
(function (Directions) {
    Directions["RTL"] = "rtl";
    Directions["LTR"] = "ltr";
})(Directions || (exports.Directions = Directions = {}));
var Languages;
(function (Languages) {
    Languages["ENGLISH"] = "en";
    Languages["ARABIC"] = "ar";
})(Languages || (exports.Languages = Languages = {}));
var Routes;
(function (Routes) {
    Routes["ROOT"] = "/";
    Routes["MENU"] = "menu";
    Routes["ABOUT"] = "about";
    Routes["CONTACT"] = "contact";
    Routes["AUTH"] = "auth";
    Routes["CART"] = "cart";
})(Routes || (exports.Routes = Routes = {}));
var Pages;
(function (Pages) {
    Pages["LOGIN"] = "signin";
    Pages["Register"] = "signup";
})(Pages || (exports.Pages = Pages = {}));
var InputTypes;
(function (InputTypes) {
    InputTypes["TEXT"] = "text";
    InputTypes["EMAIL"] = "email";
    InputTypes["PASSWORD"] = "password";
    InputTypes["NUMBER"] = "number";
    InputTypes["DATE"] = "date";
    InputTypes["TIME"] = "time";
    InputTypes["DATE_TIME_LOCAL"] = "datetime-local";
    InputTypes["CHECKBOX"] = "checkbox";
    InputTypes["RADIO"] = "radio";
    InputTypes["SELECT"] = "select";
    InputTypes["TEXTAREA"] = "textarea";
    InputTypes["FILE"] = "file";
    InputTypes["IMAGE"] = "image";
    InputTypes["COLOR"] = "color";
    InputTypes["RANGE"] = "range";
    InputTypes["TEL"] = "tel";
    InputTypes["URL"] = "url";
    InputTypes["SEARCH"] = "search";
    InputTypes["MONTH"] = "month";
    InputTypes["WEEK"] = "week";
    InputTypes["HIDDEN"] = "hidden";
    InputTypes["MULTI_SELECT"] = "multi select";
})(InputTypes || (exports.InputTypes = InputTypes = {}));
var Navigate;
(function (Navigate) {
    Navigate["NEXT"] = "next";
    Navigate["PREV"] = "prev";
})(Navigate || (exports.Navigate = Navigate = {}));
var Responses;
(function (Responses) {
    Responses["SUCCESS"] = "success";
    Responses["ERROR"] = "error";
    Responses["WARNING"] = "warning";
    Responses["INFO"] = "info";
})(Responses || (exports.Responses = Responses = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var SortBy;
(function (SortBy) {
    SortBy["CREATED_AT"] = "createdAt";
    SortBy["UPDATED_AT"] = "updatedAt";
    SortBy["NAME"] = "name";
    SortBy["EMAIL"] = "email";
    SortBy["PHONE"] = "phone";
    SortBy["STATUS"] = "status";
    SortBy["START_DATE"] = "startDate";
    SortBy["END_DATE"] = "endDate";
})(SortBy || (exports.SortBy = SortBy = {}));
var AuthMessages;
(function (AuthMessages) {
    AuthMessages["LOGIN_SUCCESS"] = "Login successfully";
    AuthMessages["LOGOUT_SUCCESS"] = "Logout successfully";
    AuthMessages["REGISTER_SUCCESS"] = "Register successfully";
    AuthMessages["FORGET_PASSWORD_SUCCESS"] = "Forget password successfully";
    AuthMessages["RESET_PASSWORD_SUCCESS"] = "Reset password successfully";
})(AuthMessages || (exports.AuthMessages = AuthMessages = {}));
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PUT"] = "PUT";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
})(Methods || (exports.Methods = Methods = {}));
var Environments;
(function (Environments) {
    Environments["PROD"] = "production";
    Environments["DEV"] = "development";
})(Environments || (exports.Environments = Environments = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.donnees = [
    {
        instrument: "LSHH001",
        reglage: "1000 mm",
        action: "Alarme + Déclenchement TVcc",
        type_vanne: null,
        alarme: true,
        interdiction_pompes: false,
    },
    {
        instrument: "LSH004",
        reglage: "800 mm",
        action: "Alarme + ouverture de la vanne de décharge puis condenseur LV001 vers bâche tampon",
        type_vanne: null,
        alarme: true,
        interdiction_pompes: false,
    },
    {
        instrument: "LSH003",
        reglage: "750 mm",
        action: "Alarme",
        type_vanne: null,
        alarme: true,
        interdiction_pompes: false,
    },
    {
        instrument: "LSH002",
        reglage: "700 mm",
        action: "Fermeture de la vanne LV001",
        type_vanne: null,
        alarme: false,
        interdiction_pompes: false,
    },
    {
        instrument: "LSH001",
        reglage: "630 mm",
        action: "Fermeture de la vanne d’appoint normal CAP LV001 et d’appoint rapide CAP UV001",
        type_vanne: null,
        alarme: false,
        interdiction_pompes: false,
    },
    {
        instrument: null,
        reglage: "610 mm",
        action: "marche normale c'est le niveau de travaille",
        type_vanne: "normal",
        alarme: false,
        interdiction_pompes: false,
    },
    {
        instrument: "LSL001",
        reglage: "580 mm",
        action: "Ouverture vanne d’appoint normal CAP LV001",
        type_vanne: "normal",
        alarme: false,
        interdiction_pompes: false,
    },
    {
        instrument: "LSL002",
        reglage: "530 mm",
        action: "Ouverture vanne d’appoint rapide CAP UV001",
        type_vanne: "normal",
        alarme: false,
        interdiction_pompes: false,
    },
    {
        instrument: "LSL003",
        reglage: "370 mm",
        action: "Alarme + interdiction de démarrage des pompes CEX",
        type_vanne: null,
        alarme: true,
        interdiction_pompes: true,
    },
    {
        instrument: "LSLL001",
        reglage: "240 mm",
        action: "Alarme + declanchement de la pompe CEX",
        type_vanne: null,
        alarme: true,
        interdiction_pompes: true,
    },
];
