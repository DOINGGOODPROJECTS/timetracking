// Système de traduction pour l'application

export type Language = "fr" | "en"

// Dictionnaire de traduction
export const translations = {
  // Textes généraux
  general: {
    appName: {
      fr: "Direct Impact Partners",
      en: "Direct Impact Partners",
    },
    loading: {
      fr: "Chargement...",
      en: "Loading...",
    },
    processing: {
      fr: "Traitement...",
      en: "Processing...",
    },
    error: {
      fr: "Une erreur est survenue",
      en: "An error occurred",
    },
    save: {
      fr: "Enregistrer",
      en: "Save",
    },
    cancel: {
      fr: "Annuler",
      en: "Cancel",
    },
    confirm: {
      fr: "Confirmer",
      en: "Confirm",
    },
    delete: {
      fr: "Supprimer",
      en: "Delete",
    },
    edit: {
      fr: "Modifier",
      en: "Edit",
    },
    view: {
      fr: "Voir",
      en: "View",
    },
    download: {
      fr: "Télécharger",
      en: "Download",
    },
    add: {
      fr: "Ajouter",
      en: "Add",
    },
    search: {
      fr: "Rechercher",
      en: "Search",
    },
    noData: {
      fr: "Aucune donnée disponible",
      en: "No data available",
    },
  },

  // Navigation
  nav: {
    dashboard: {
      fr: "Tableau de bord",
      en: "Dashboard",
    },
    timesheet: {
      fr: "Mes pointages",
      en: "My timesheet",
    },
    map: {
      fr: "Carte",
      en: "Map",
    },
    reports: {
      fr: "Rapports",
      en: "Reports",
    },
    admin: {
      fr: "Administration",
      en: "Administration",
    },
    settings: {
      fr: "Paramètres",
      en: "Settings",
    },
    profile: {
      fr: "Profil",
      en: "Profile",
    },
    logout: {
      fr: "Déconnexion",
      en: "Logout",
    },
    login: {
      fr: "Connexion",
      en: "Login",
    },
    myAccount: {
      fr: "Mon compte",
      en: "My account",
    },
  },

  // Tableau de bord
  dashboard: {
    title: {
      fr: "Tableau de bord",
      en: "Dashboard",
    },
    overview: {
      fr: "Vue d'ensemble",
      en: "Overview",
    },
    history: {
      fr: "Historique",
      en: "History",
    },
    currentStatus: {
      fr: "Statut actuel",
      en: "Current status",
    },
    present: {
      fr: "Présent",
      en: "Present",
    },
    absent: {
      fr: "Absent",
      en: "Absent",
    },
    lastActivity: {
      fr: "Dernière activité",
      en: "Last activity",
    },
    none: {
      fr: "Aucune",
      en: "None",
    },
    weeklyHours: {
      fr: "Heures cette semaine",
      en: "Hours this week",
    },
    punctuality: {
      fr: "Ponctualité",
      en: "Punctuality",
    },
    onTimeArrivals: {
      fr: "Arrivées à l'heure ce mois-ci",
      en: "On-time arrivals this month",
    },
    recentActivities: {
      fr: "Activités récentes",
      en: "Recent activities",
    },
    lastCheckIns: {
      fr: "Vos 5 derniers pointages",
      en: "Your last 5 check-ins",
    },
    noCheckInsYet: {
      fr: "Vous n'avez pas encore effectué de pointage",
      en: "You haven't checked in yet",
    },
    comparedToLastWeek: {
      fr: "par rapport à la semaine dernière",
      en: "compared to last week",
    },
  },

  // Pointages
  timesheet: {
    title: {
      fr: "Mes Pointages",
      en: "My Timesheet",
    },
    checkInOut: {
      fr: "Pointage",
      en: "Check-in/out",
    },
    recordArrivalDeparture: {
      fr: "Enregistrez votre arrivée et votre départ",
      en: "Record your arrival and departure",
    },
    checkIn: {
      fr: "Pointer l'arrivée",
      en: "Check in",
    },
    checkOut: {
      fr: "Pointer la sortie",
      en: "Check out",
    },
    date: {
      fr: "Date",
      en: "Date",
    },
    arrival: {
      fr: "Arrivée",
      en: "Arrival",
    },
    departure: {
      fr: "Départ",
      en: "Departure",
    },
    totalHours: {
      fr: "Heures totales",
      en: "Total hours",
    },
    status: {
      fr: "Statut",
      en: "Status",
    },
    location: {
      fr: "Lieu",
      en: "Location",
    },
    arrivalLocation: {
      fr: "Lieu d'arrivée",
      en: "Arrival location",
    },
    departureLocation: {
      fr: "Lieu de départ",
      en: "Departure location",
    },
    currentPosition: {
      fr: "Position actuelle",
      en: "Current position",
    },
    accuracy: {
      fr: "Précision",
      en: "Accuracy",
    },
    meters: {
      fr: "mètres",
      en: "meters",
    },
    gettingLocation: {
      fr: "Récupération de votre position...",
      en: "Getting your location...",
    },
    checkInSuccess: {
      fr: "Pointage réussi",
      en: "Check-in successful",
    },
    checkOutSuccess: {
      fr: "Pointage de sortie réussi",
      en: "Check-out successful",
    },
    checkedInAt: {
      fr: "Vous avez pointé à",
      en: "You checked in at",
    },
    checkedOutAt: {
      fr: "Vous avez pointé votre sortie à",
      en: "You checked out at",
    },
    from: {
      fr: "depuis",
      en: "from",
    },
    yourCurrentLocation: {
      fr: "votre position actuelle",
      en: "your current location",
    },
    alreadyCheckedIn: {
      fr: "Vous êtes déjà pointé",
      en: "You are already checked in",
    },
    notCheckedIn: {
      fr: "Vous n'êtes pas pointé",
      en: "You are not checked in",
    },
    currentlyPresent: {
      fr: "Vous êtes actuellement présent",
      en: "You are currently present",
    },
    history: {
      fr: "Historique des pointages",
      en: "Timesheet history",
    },
    noRecords: {
      fr: "Aucun pointage trouvé",
      en: "No timesheet records found",
    },
    complete: {
      fr: "Complet",
      en: "Complete",
    },
    incomplete: {
      fr: "Incomplet",
      en: "Incomplete",
    },
    late: {
      fr: "En retard",
      en: "Late",
    },
    early: {
      fr: "En avance",
      en: "Early",
    },
    onTime: {
      fr: "À l'heure",
      en: "On time",
    },
    overtime: {
      fr: "Heures sup.",
      en: "Overtime",
    },
    locationError: {
      fr: "Erreur de localisation",
      en: "Location error",
    },
    locationPermissionDenied: {
      fr: "Vous avez refusé l'accès à votre position",
      en: "You denied access to your location",
    },
    locationUnavailable: {
      fr: "Les informations de localisation ne sont pas disponibles",
      en: "Location information is not available",
    },
    locationTimeout: {
      fr: "La demande de localisation a expiré",
      en: "Location request timed out",
    },
    locationNotSupported: {
      fr: "La géolocalisation n'est pas prise en charge par votre navigateur",
      en: "Geolocation is not supported by your browser",
    },
    checkInError: {
      fr: "Une erreur est survenue lors du pointage",
      en: "An error occurred during check-in",
    },
    checkOutError: {
      fr: "Une erreur est survenue lors du pointage de sortie",
      en: "An error occurred during check-out",
    },
    retryLocation: {
      fr: "Réessayer",
      en: "Retry",
    },
    lastCheckAt: {
      fr: "Dernier pointage à",
      en: "Last check at",
    },
    notAvailable: {
      fr: "Non disponible",
      en: "Not available",
    },
  },

  // Rapports
  reports: {
    title: {
      fr: "Rapports",
      en: "Reports",
    },
    generate: {
      fr: "Générer un rapport",
      en: "Generate report",
    },
    saved: {
      fr: "Rapports sauvegardés",
      en: "Saved reports",
    },
    type: {
      fr: "Type de rapport",
      en: "Report type",
    },
    daily: {
      fr: "Rapport quotidien",
      en: "Daily report",
    },
    weekly: {
      fr: "Rapport hebdomadaire",
      en: "Weekly report",
    },
    monthly: {
      fr: "Rapport mensuel",
      en: "Monthly report",
    },
    custom: {
      fr: "Rapport personnalisé",
      en: "Custom report",
    },
    format: {
      fr: "Format",
      en: "Format",
    },
    startDate: {
      fr: "Date de début",
      en: "Start date",
    },
    endDate: {
      fr: "Date de fin",
      en: "End date",
    },
    generating: {
      fr: "Génération en cours...",
      en: "Generating...",
    },
    generated: {
      fr: "Rapport généré",
      en: "Report generated",
    },
    name: {
      fr: "Nom",
      en: "Name",
    },
    date: {
      fr: "Date",
      en: "Date",
    },
    size: {
      fr: "Taille",
      en: "Size",
    },
    actions: {
      fr: "Actions",
      en: "Actions",
    },
    noReports: {
      fr: "Aucun rapport trouvé",
      en: "No reports found",
    },
    downloadingReport: {
      fr: "Téléchargement du rapport",
      en: "Downloading report",
    },
    viewingReport: {
      fr: "Ouverture du rapport",
      en: "Opening report",
    },
    selectDate: {
      fr: "Sélectionner une date",
      en: "Select a date",
    },
    selectReportType: {
      fr: "Sélectionnez un type de rapport",
      en: "Select a report type",
    },
    selectFormat: {
      fr: "Sélectionnez un format",
      en: "Select a format",
    },
  },

  // Paramètres
  settings: {
    title: {
      fr: "Paramètres",
      en: "Settings",
    },
    notifications: {
      fr: "Notifications",
      en: "Notifications",
    },
    application: {
      fr: "Application",
      en: "Application",
    },
    theme: {
      fr: "Thème",
      en: "Theme",
    },
    light: {
      fr: "Clair",
      en: "Light",
    },
    dark: {
      fr: "Sombre",
      en: "Dark",
    },
    system: {
      fr: "Système",
      en: "System",
    },
    language: {
      fr: "Langue",
      en: "Language",
    },
    french: {
      fr: "Français",
      en: "French",
    },
    english: {
      fr: "Anglais",
      en: "English",
    },
    settingsSaved: {
      fr: "Paramètres sauvegardés",
      en: "Settings saved",
    },
    settingsUpdated: {
      fr: "Les paramètres ont été mis à jour",
      en: "Settings have been updated",
    },
    emailNotifications: {
      fr: "Notifications par email",
      en: "Email notifications",
    },
    receiveEmailNotifications: {
      fr: "Recevez des notifications par email",
      en: "Receive notifications by email",
    },
    pushNotifications: {
      fr: "Notifications push",
      en: "Push notifications",
    },
    receivePushNotifications: {
      fr: "Recevez des notifications sur votre appareil",
      en: "Receive notifications on your device",
    },
    dailySummary: {
      fr: "Résumé quotidien",
      en: "Daily summary",
    },
    receiveDailySummary: {
      fr: "Recevez un résumé quotidien de vos pointages",
      en: "Receive a daily summary of your check-ins",
    },
    lateAlert: {
      fr: "Alerte de retard",
      en: "Late alert",
    },
    receiveLateAlert: {
      fr: "Recevez une alerte en cas de pointage tardif",
      en: "Receive an alert for late check-ins",
    },
    missedCheckOutAlert: {
      fr: "Alerte d'oubli de pointage",
      en: "Missed check-out alert",
    },
    receiveMissedCheckOutAlert: {
      fr: "Recevez une alerte si vous oubliez de pointer votre départ",
      en: "Receive an alert if you forget to check out",
    },
  },

  // Administration
  admin: {
    title: {
      fr: "Administration",
      en: "Administration",
    },
    employees: {
      fr: "Employés",
      en: "Employees",
    },
    employeesList: {
      fr: "Liste des employés",
      en: "Employees list",
    },
    addEmployee: {
      fr: "Ajouter un employé",
      en: "Add employee",
    },
    editEmployee: {
      fr: "Modifier un employé",
      en: "Edit employee",
    },
    deleteEmployee: {
      fr: "Supprimer un employé",
      en: "Delete employee",
    },
    deleteConfirmation: {
      fr: "Êtes-vous sûr ?",
      en: "Are you sure?",
    },
    deleteWarning: {
      fr: "Cette action ne peut pas être annulée. Cela supprimera définitivement l'employé et toutes les données associées.",
      en: "This action cannot be undone. It will permanently delete the employee and all associated data.",
    },
    name: {
      fr: "Nom complet",
      en: "Full name",
    },
    email: {
      fr: "Email",
      en: "Email",
    },
    department: {
      fr: "Département",
      en: "Department",
    },
    status: {
      fr: "Statut",
      en: "Status",
    },
    active: {
      fr: "Actif",
      en: "Active",
    },
    inactive: {
      fr: "Inactif",
      en: "Inactive",
    },
    lastLocation: {
      fr: "Dernière position",
      en: "Last location",
    },
    notAvailable: {
      fr: "Non disponible",
      en: "Not available",
    },
    actions: {
      fr: "Actions",
      en: "Actions",
    },
    employeeAdded: {
      fr: "Employé ajouté",
      en: "Employee added",
    },
    employeeUpdated: {
      fr: "Employé mis à jour",
      en: "Employee updated",
    },
    employeeDeleted: {
      fr: "Employé supprimé",
      en: "Employee deleted",
    },
    viewTimesheet: {
      fr: "Voir les pointages",
      en: "View timesheet",
    },
    employeeTimesheet: {
      fr: "Pointages de",
      en: "Timesheet for",
    },
    backToList: {
      fr: "Retour à la liste",
      en: "Back to list",
    },
  },

  // Profil
  profile: {
    title: {
      fr: "Mon Profil",
      en: "My Profile",
    },
    personalInfo: {
      fr: "Informations personnelles",
      en: "Personal information",
    },
    changePassword: {
      fr: "Changer le mot de passe",
      en: "Change password",
    },
    currentPassword: {
      fr: "Mot de passe actuel",
      en: "Current password",
    },
    newPassword: {
      fr: "Nouveau mot de passe",
      en: "New password",
    },
    confirmPassword: {
      fr: "Confirmer le mot de passe",
      en: "Confirm password",
    },
    updateProfile: {
      fr: "Mettre à jour le profil",
      en: "Update profile",
    },
    updating: {
      fr: "Mise à jour...",
      en: "Updating...",
    },
    profileUpdated: {
      fr: "Profil mis à jour",
      en: "Profile updated",
    },
    passwordMismatch: {
      fr: "Les mots de passe ne correspondent pas",
      en: "Passwords do not match",
    },
    incorrectPassword: {
      fr: "Mot de passe actuel incorrect",
      en: "Current password is incorrect",
    },
    changePhoto: {
      fr: "Changer la photo",
      en: "Change photo",
    },
    photoRequirements: {
      fr: "JPG, PNG ou GIF. 1MB maximum.",
      en: "JPG, PNG or GIF. 1MB maximum.",
    },
  },

  // Authentification
  auth: {
    login: {
      fr: "Connexion",
      en: "Login",
    },
    loginDescription: {
      fr: "Entrez vos identifiants pour accéder à votre compte",
      en: "Enter your credentials to access your account",
    },
    email: {
      fr: "Email",
      en: "Email",
    },
    password: {
      fr: "Mot de passe",
      en: "Password",
    },
    forgotPassword: {
      fr: "Mot de passe oublié?",
      en: "Forgot password?",
    },
    loggingIn: {
      fr: "Connexion en cours...",
      en: "Logging in...",
    },
    invalidCredentials: {
      fr: "Email ou mot de passe incorrect",
      en: "Invalid email or password",
    },
  },

  // Page d'accueil
  home: {
    title: {
      fr: "Gestion des Pointages des Employés",
      en: "Employee Time Tracking Management",
    },
    subtitle: {
      fr: "Suivez facilement les heures d'arrivée et de départ de vos employés avec notre système de pointage simple et efficace.",
      en: "Easily track your employees' arrival and departure times with our simple and efficient time tracking system.",
    },
    getStarted: {
      fr: "Commencer",
      en: "Get started",
    },
    dashboard: {
      fr: "Tableau de bord",
      en: "Dashboard",
    },
    features: {
      easyTracking: {
        title: {
          fr: "Pointage Facile",
          en: "Easy Tracking",
        },
        subtitle: {
          fr: "Rapide et Simple",
          en: "Quick and Simple",
        },
        description: {
          fr: "Enregistrez vos heures d'arrivée et de départ en un clic.",
          en: "Record your arrival and departure times with one click.",
        },
      },
      employeeManagement: {
        title: {
          fr: "Gestion des Employés",
          en: "Employee Management",
        },
        subtitle: {
          fr: "Centralisé",
          en: "Centralized",
        },
        description: {
          fr: "Gérez tous vos employés depuis une interface unique.",
          en: "Manage all your employees from a single interface.",
        },
      },
      detailedReports: {
        title: {
          fr: "Rapports Détaillés",
          en: "Detailed Reports",
        },
        subtitle: {
          fr: "Analytique",
          en: "Analytics",
        },
        description: {
          fr: "Visualisez les tendances et exportez des rapports détaillés.",
          en: "Visualize trends and export detailed reports.",
        },
      },
    },
    footer: {
      rights: {
        fr: "Tous droits réservés.",
        en: "All rights reserved.",
      },
    },
  },
}

// Fonction pour obtenir une traduction
export function getTranslation(key: string, language: Language = "fr"): string {
  // Diviser la clé par des points pour accéder aux objets imbriqués
  const keys = key.split(".")
  let value: any = translations

  // Parcourir l'objet de traduction pour trouver la valeur
  for (const k of keys) {
    if (value[k] === undefined) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    value = value[k]
  }

  // Vérifier si la langue demandée existe
  if (value[language] === undefined) {
    console.warn(`Translation not available in ${language} for key: ${key}`)
    // Fallback à l'anglais ou au français
    return value["en"] || value["fr"] || key
  }

  return value[language]
}

// Hook pour utiliser les traductions (sera implémenté dans un contexte)
export function createTranslationContext(language: Language) {
  return {
    t: (key: string) => getTranslation(key, language),
    language,
  }
}
