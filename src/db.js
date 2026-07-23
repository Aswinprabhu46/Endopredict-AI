// ─── Persistent Database Service for EndoPredict (LocalStorage & Firebase Firestore) ───

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc,
  deleteDoc
} from "firebase/firestore";

const DB_KEYS = {
  USERS: "endopredict_users",
  PATIENTS: "endopredict_patients",
  TEETH: "endopredict_teeth",
  APPOINTMENTS: "endopredict_appointments",
  CURRENT_USER: "endopredict_current_user"
};

// Initial Mock Data to seed the Database
const DEFAULT_USERS = [
  {
    email: "drkumar@endopredict.com",
    password: "password123",
    name: "Dr. Aravind Kumar",
    specialization: "Endodontist (MDS)",
    license: "TN-DCI-2018-4521"
  }
];

const DEFAULT_PATIENTS = [
  { id: 1, name: "Priya Sharma", age: 34, gender: "F", tooth: "#26", diagnosis: "Irreversible Pulpitis", risk: "High", pain: 7, status: "Post-op", lastVisit: "2026-05-28", flareupRisk: 82, analgesic: "Ibuprofen 600mg", followup: "48h", avatar: "PS", phone: "9876543210" },
  { id: 2, name: "Rajan Mehta", age: 52, gender: "M", tooth: "#14", diagnosis: "Apical Periodontitis", risk: "Medium", pain: 5, status: "Scheduled", lastVisit: "2026-05-27", flareupRisk: 47, analgesic: "Paracetamol 500mg", followup: "7d", avatar: "RM", phone: "9876543211" },
  { id: 3, name: "Kavitha Nair", age: 28, gender: "F", tooth: "#36", diagnosis: "Pulp Necrosis", risk: "Low", pain: 3, status: "Completed", lastVisit: "2026-05-25", flareupRisk: 18, analgesic: "None required", followup: "14d", avatar: "KN", phone: "9876543212" },
  { id: 4, name: "Arjun Reddy", age: 45, gender: "M", tooth: "#47", diagnosis: "Retreatment", risk: "High", pain: 8, status: "Emergency", lastVisit: "2026-05-29", flareupRisk: 91, analgesic: "Tramadol 50mg", followup: "24h", avatar: "AR", phone: "9876543213" },
  { id: 5, name: "Sunita Patel", age: 61, gender: "F", tooth: "#11", diagnosis: "Chronic Apical Abscess", risk: "Medium", pain: 6, status: "Post-op", lastVisit: "2026-05-26", flareupRisk: 55, analgesic: "Ibuprofen 400mg", followup: "72h", avatar: "SP", phone: "9876543214" },
  { id: 6, name: "Vikram Iyer", age: 39, gender: "M", tooth: "#21", diagnosis: "Symptomatic Pulpitis", risk: "Low", pain: 4, status: "Scheduled", lastVisit: "2026-05-24", flareupRisk: 29, analgesic: "Paracetamol 500mg", followup: "7d", avatar: "VI", phone: "9876543215" },
  { id: 7, name: "Anjali Gupta", age: 41, gender: "F", tooth: "#24", diagnosis: "Apical Periodontitis", risk: "Medium", pain: 6, status: "Post-op", lastVisit: "2026-05-24", flareupRisk: 52, analgesic: "Ibuprofen 400mg", followup: "72h", avatar: "AG", phone: "9876543216" },
  { id: 8, name: "Devendra Verma", age: 64, gender: "M", tooth: "#35", diagnosis: "Pulp Necrosis", risk: "High", pain: 8, status: "Post-op", lastVisit: "2026-05-28", flareupRisk: 79, analgesic: "Ketorolac 10mg", followup: "24h", avatar: "DV", phone: "9876543217" },
  { id: 9, name: "Meera Deshmukh", age: 31, gender: "F", tooth: "#16", diagnosis: "Reversible Pulpitis", risk: "Low", pain: 2, status: "Scheduled", lastVisit: "2026-05-20", flareupRisk: 15, analgesic: "None required", followup: "14d", avatar: "MD", phone: "9876543218" },
  { id: 10, name: "Rohan Kapoor", age: 23, gender: "M", tooth: "#13", diagnosis: "Irreversible Pulpitis", risk: "Medium", pain: 5, status: "Scheduled", lastVisit: "2026-05-22", flareupRisk: 41, analgesic: "Paracetamol 650mg", followup: "7d", avatar: "RK", phone: "9876543219" },
];

const DEFAULT_TEETH = {
  11: { name: "Upper Right Central Incisor", type: "Incisor", q: 1, status: "healthy", pain: 0, flareup: 5, patient: null },
  12: { name: "Upper Right Lateral Incisor", type: "Incisor", q: 1, status: "healthy", pain: 0, flareup: 8, patient: null },
  13: { name: "Upper Right Canine", type: "Canine", q: 1, status: "crown", pain: 1, flareup: 12, patient: null },
  14: { name: "Upper Right First Premolar", type: "Premolar", q: 1, status: "rct_done", pain: 2, flareup: 20, patient: "Rajan Mehta" },
  15: { name: "Upper Right Second Premolar", type: "Premolar", q: 1, status: "healthy", pain: 0, flareup: 6, patient: null },
  16: { name: "Upper Right First Molar", type: "Molar", q: 1, status: "cavity", pain: 4, flareup: 38, patient: null },
  17: { name: "Upper Right Second Molar", type: "Molar", q: 1, status: "healthy", pain: 0, flareup: 5, patient: null },
  18: { name: "Upper Right Wisdom Tooth", type: "Molar", q: 1, status: "extracted", pain: 0, flareup: 0, patient: null },
  21: { name: "Upper Left Central Incisor", type: "Incisor", q: 2, status: "healthy", pain: 0, flareup: 4, patient: null },
  22: { name: "Upper Left Lateral Incisor", type: "Incisor", q: 2, status: "infected", pain: 6, flareup: 55, patient: "Sunita Patel" },
  23: { name: "Upper Left Canine", type: "Canine", q: 2, status: "healthy", pain: 0, flareup: 7, patient: null },
  24: { name: "Upper Left First Premolar", type: "Premolar", q: 2, status: "cavity", pain: 3, flareup: 29, patient: null },
  25: { name: "Upper Left Second Premolar", type: "Premolar", q: 2, status: "healthy", pain: 0, flareup: 5, patient: null },
  26: { name: "Upper Left First Molar", type: "Molar", q: 2, status: "infected", pain: 7, flareup: 82, patient: "Priya Sharma" },
  27: { name: "Upper Left Second Molar", type: "Molar", q: 2, status: "rct_needed", pain: 5, flareup: 47, patient: null },
  28: { name: "Upper Left Wisdom Tooth", type: "Molar", q: 2, status: "healthy", pain: 0, flareup: 3, patient: null },
  31: { name: "Lower Left Central Incisor", type: "Incisor", q: 3, status: "healthy", pain: 0, flareup: 4, patient: null },
  32: { name: "Lower Left Lateral Incisor", type: "Incisor", q: 3, status: "healthy", pain: 0, flareup: 6, patient: null },
  33: { name: "Lower Left Canine", type: "Canine", q: 3, status: "healthy", pain: 0, flareup: 5, patient: null },
  34: { name: "Lower Left First Premolar", type: "Premolar", q: 3, status: "healthy", pain: 0, flareup: 9, patient: null },
  35: { name: "Lower Left Second Premolar", type: "Premolar", q: 3, status: "cavity", pain: 2, flareup: 22, patient: null },
  36: { name: "Lower Left First Molar", type: "Molar", q: 3, status: "rct_done", pain: 3, flareup: 18, patient: "Kavitha Nair" },
  37: { name: "Lower Left Second Molar", type: "Molar", q: 3, status: "healthy", pain: 0, flareup: 7, patient: null },
  38: { name: "Lower Left Wisdom Tooth", type: "Molar", q: 3, status: "extracted", pain: 0, flareup: 0, patient: null },
  41: { name: "Lower Right Central Incisor", type: "Incisor", q: 4, status: "healthy", pain: 0, flareup: 5, patient: null },
  42: { name: "Lower Right Lateral Incisor", type: "Incisor", q: 4, status: "healthy", pain: 0, flareup: 4, patient: null },
  43: { name: "Lower Right Canine", type: "Canine", q: 4, status: "healthy", pain: 0, flareup: 6, patient: null },
  44: { name: "Lower Right First Premolar", type: "Premolar", q: 4, status: "healthy", pain: 0, flareup: 10, patient: null },
  45: { name: "Lower Right Second Premolar", type: "Premolar", q: 4, status: "rct_needed", pain: 4, flareup: 35, patient: null },
  46: { name: "Lower Right First Molar", type: "Molar", q: 4, status: "healthy", pain: 0, flareup: 8, patient: null },
  47: { name: "Lower Right Second Molar", type: "Molar", q: 4, status: "infected", pain: 8, flareup: 91, patient: "Arjun Reddy" },
  48: { name: "Lower Right Wisdom Tooth", type: "Molar", q: 4, status: "healthy", pain: 0, flareup: 5, patient: null },
};

const DEFAULT_APPOINTMENTS = [
  { time: "09:00 AM", patient: "Arjun Reddy", type: "Emergency RCT", risk: "High", room: "Op 1", duration: 90 },
  { time: "10:30 AM", patient: "Priya Sharma", type: "Post-op Review", risk: "High", room: "Op 2", duration: 30 },
  { time: "12:00 PM", patient: "Sunita Patel", type: "Follow-up", risk: "Medium", room: "Op 1", duration: 20 },
  { time: "02:30 PM", patient: "Vikram Iyer", type: "Consultation", risk: "Low", room: "Op 3", duration: 45 },
  { time: "04:00 PM", patient: "Rajan Mehta", type: "RCT Session 2", risk: "Medium", room: "Op 2", duration: 60 },
];

// ─── Firebase Configuration ──────────────────────────────────────────────────
// Firebase Config (Replace with environment variables or your own credentials)
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "endopredict-clinical.firebaseapp.com",
  projectId: "endopredict-clinical",
  storageBucket: "endopredict-clinical.firebasestorage.app",
  messagingSenderId: "449514827343",
  appId: "1:449514827343:web:1ffd38c81e56c0a51f043a"
};

// Google Gemini API Key (Read from environment variable VITE_GEMINI_API_KEY)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let app = null;
let firestore = null;
let useFirebase = false;

if (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    firestore = getFirestore(app);
    useFirebase = true;
    console.log("Firebase initialized successfully with cloud configuration.");
  } catch (err) {
    console.error("Firebase connection initialization failed:", err);
  }
}

export const db = {
  getGeminiKey() {
    const custom = localStorage.getItem("endopredict_custom_gemini_key");
    if (custom && custom.trim() !== "") return custom;
    return GEMINI_API_KEY;
  },
  setGeminiKey(key) {
    localStorage.setItem("endopredict_custom_gemini_key", key);
  },
  isFirebaseConfigured() {
    return useFirebase;
  },

  getFirebaseConfig() {
    return FIREBASE_CONFIG;
  },

  async init() {
    // Local storage seeding fallback
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.PATIENTS)) {
      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
    } else {
      try {
        const local = JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS) || "[]");
        if (local.length < DEFAULT_PATIENTS.length) {
          // Identify missing default patients and append them
          const existingIds = new Set(local.map(p => p.id));
          const toAdd = DEFAULT_PATIENTS.filter(p => !existingIds.has(p.id));
          if (toAdd.length > 0) {
            localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([...local, ...toAdd]));
          }
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
      }
    }
    if (!localStorage.getItem(DB_KEYS.TEETH)) {
      localStorage.setItem(DB_KEYS.TEETH, JSON.stringify(DEFAULT_TEETH));
    }
    if (!localStorage.getItem(DB_KEYS.APPOINTMENTS)) {
      localStorage.setItem(DB_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    }

    // Firebase collections seeding
    if (useFirebase && firestore) {
      try {
        // Users collection
        const usersCol = collection(firestore, "users");
        const usersSnap = await getDocs(usersCol);
        if (usersSnap.empty) {
          for (const u of DEFAULT_USERS) {
            await setDoc(doc(firestore, "users", u.email.toLowerCase()), u);
          }
        }

        // Patients collection
        const patientsCol = collection(firestore, "patients");
        const patientsSnap = await getDocs(patientsCol);
        if (patientsSnap.empty) {
          for (const p of DEFAULT_PATIENTS) {
            await setDoc(doc(firestore, "patients", String(p.id)), p);
          }
        }

        // Teeth collection
        const teethCol = collection(firestore, "teeth");
        const teethSnap = await getDocs(teethCol);
        if (teethSnap.empty) {
          for (const [id, t] of Object.entries(DEFAULT_TEETH)) {
            await setDoc(doc(firestore, "teeth", String(id)), t);
          }
        }

        // Appointments collection
        const apptsCol = collection(firestore, "appointments");
        const apptsSnap = await getDocs(apptsCol);
        if (apptsSnap.empty) {
          for (const a of DEFAULT_APPOINTMENTS) {
            await addDoc(apptsCol, a);
          }
        }
      } catch (err) {
        console.error("Error seeding Firebase Firestore database collections:", err);
      }
    }
  },

  // ─── Users Table CRUD ──────────────────────────────────────────────────────
  async getUsers() {
    await this.init();
    if (useFirebase && firestore) {
      try {
        const snap = await getDocs(collection(firestore, "users"));
        return snap.docs.map(d => d.data());
      } catch (err) {
        console.error("Firebase getUsers failed, falling back locally:", err);
      }
    }
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS));
  },

  async registerUser(name, email, password, specialization, license) {
    const newUser = { name, email, password, specialization, license };
    if (useFirebase && firestore) {
      try {
        const userDocRef = doc(firestore, "users", email.toLowerCase());
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          return { success: false, message: "Email is already registered in Firebase!" };
        }
        await setDoc(userDocRef, newUser);
        return { success: true, user: newUser };
      } catch (err) {
        console.error("Firebase registerUser failed:", err);
        return { success: false, message: "Firebase write failed: " + err.message };
      }
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email is already registered locally!" };
    }
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return { success: true, user: newUser };
  },

  async verifyUser(email, password) {
    if (useFirebase && firestore) {
      try {
        const userDocRef = doc(firestore, "users", email.toLowerCase());
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const user = userDoc.data();
          if (user.password === password) {
            return { success: true, user };
          }
        }
        return { success: false, message: "Invalid email or password!" };
      } catch (err) {
        console.error("Firebase verifyUser failed:", err);
        return { success: false, message: "Firebase connection error: " + err.message };
      }
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      return { success: true, user: found };
    }
    return { success: false, message: "Invalid email or password!" };
  },

  getCurrentUser() {
    const raw = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  async updateUser(email, updatedData) {
    if (useFirebase && firestore) {
      try {
        const userDocRef = doc(firestore, "users", email.toLowerCase());
        await updateDoc(userDocRef, updatedData);
      } catch (err) {
        console.error("Firebase updateUser failed:", err);
      }
    }
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
    const current = this.getCurrentUser();
    if (current && current.email.toLowerCase() === email.toLowerCase()) {
      const updatedUser = { ...current, ...updatedData };
      this.setCurrentUser(updatedUser);
      return updatedUser;
    }
    return null;
  },

  clearCurrentUser() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },

  // ─── Patients Table CRUD ───────────────────────────────────────────────────
  async getPatients() {
    await this.init();
    let pts = [];
    if (useFirebase && firestore) {
      try {
        const snap = await getDocs(collection(firestore, "patients"));
        pts = snap.docs.map(d => d.data());
      } catch (err) {
        console.error("Firebase getPatients failed, falling back locally:", err);
        pts = JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS)) || [];
      }
    } else {
      pts = JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS)) || [];
    }
    // Ensure all patients have normalized records
    return pts.map((p, idx) => {
      const defaultVisits = [
        { date: p.lastVisit || "2026-07-10", problems: p.diagnosis || "Irreversible Pulpitis", notes: "Initial diagnosis and treatment planning.", status: p.status || "Completed" }
      ];
      const rawPhone = p.phone || `987654321${(p.id - 1) % 10}`;
      const digits = rawPhone.replace(/\D/g, "");
      let normalizedPhone = rawPhone;
      if (digits.length === 10) {
        normalizedPhone = "+91" + digits;
      } else if (digits.length === 12 && digits.startsWith("91")) {
        normalizedPhone = "+" + digits;
      } else if (!rawPhone.startsWith("+")) {
        normalizedPhone = "+91" + digits;
      }
      return {
        ...p,
        phone: normalizedPhone,
        visits: p.visits || defaultVisits,
        medicalHistory: p.medicalHistory || "None declared",
        allergies: p.allergies || "No known drug allergies",
        documents: p.documents || []
      };
    });
  },

  async addPatient(patient) {
    const avatar = patient.name.split(" ").map(n => n[0]).join("").toUpperCase();
    if (useFirebase && firestore) {
      try {
        const patients = await this.getPatients();
        const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
        const newPatient = {
          id: newId,
          ...patient,
          avatar
        };
        await setDoc(doc(firestore, "patients", String(newId)), newPatient);
        return newPatient;
      } catch (err) {
        console.error("Firebase addPatient failed:", err);
      }
    }

    const patients = JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS)) || [];
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient = {
      id: newId,
      ...patient,
      avatar
    };
    patients.push(newPatient);
    localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  async updatePatient(id, updatedFields) {
    if (useFirebase && firestore) {
      try {
        const patientDocRef = doc(firestore, "patients", String(id));
        await updateDoc(patientDocRef, updatedFields);
        const updated = await getDoc(patientDocRef);
        return updated.data();
      } catch (err) {
        console.error("Firebase updatePatient failed:", err);
      }
    }

    let patients = JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS)) || [];
    patients = patients.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(patients));
    return patients.find(p => p.id === id);
  },

  // ─── Teeth Chart Table CRUD ────────────────────────────────────────────────
  async getTeeth() {
    await this.init();
    if (useFirebase && firestore) {
      try {
        const snap = await getDocs(collection(firestore, "teeth"));
        const teethObj = {};
        snap.docs.forEach(d => {
          teethObj[d.id] = d.data();
        });
        if (Object.keys(teethObj).length > 0) {
          return teethObj;
        }
      } catch (err) {
        console.error("Firebase getTeeth failed:", err);
      }
    }
    return JSON.parse(localStorage.getItem(DB_KEYS.TEETH));
  },

  async updateTooth(toothId, updatedFields) {
    if (useFirebase && firestore) {
      try {
        const toothDocRef = doc(firestore, "teeth", String(toothId));
        await updateDoc(toothDocRef, updatedFields);
        const updated = await getDoc(toothDocRef);
        return updated.data();
      } catch (err) {
        console.error("Firebase updateTooth failed:", err);
      }
    }

    const teeth = JSON.parse(localStorage.getItem(DB_KEYS.TEETH)) || {};
    if (teeth[toothId]) {
      teeth[toothId] = { ...teeth[toothId], ...updatedFields };
      localStorage.setItem(DB_KEYS.TEETH, JSON.stringify(teeth));
    }
    return teeth[toothId];
  },

  // ─── Appointments Table CRUD ────────────────────────────────────────────────
  async getAppointments() {
    await this.init();
    if (useFirebase && firestore) {
      try {
        const snap = await getDocs(collection(firestore, "appointments"));
        return snap.docs.map(d => d.data());
      } catch (err) {
        console.error("Firebase getAppointments failed:", err);
      }
    }
    return JSON.parse(localStorage.getItem(DB_KEYS.APPOINTMENTS));
  },

  async addAppointment(appt) {
    if (useFirebase && firestore) {
      try {
        await addDoc(collection(firestore, "appointments"), appt);
        return appt;
      } catch (err) {
        console.error("Firebase addAppointment failed:", err);
      }
    }

    const appts = JSON.parse(localStorage.getItem(DB_KEYS.APPOINTMENTS)) || [];
    appts.push(appt);
    localStorage.setItem(DB_KEYS.APPOINTMENTS, JSON.stringify(appts));
    return appt;
  },

  async updateAppointment(index, updatedAppt) {
    if (useFirebase && firestore) {
      try {
        const apptsCol = collection(firestore, "appointments");
        const snap = await getDocs(apptsCol);
        const docToUpdate = snap.docs[index];
        if (docToUpdate) {
          await updateDoc(docToUpdate.ref, updatedAppt);
        }
      } catch (err) {
        console.error("Firebase updateAppointment failed:", err);
      }
    }
    const appts = JSON.parse(localStorage.getItem(DB_KEYS.APPOINTMENTS)) || [];
    if (appts[index]) {
      appts[index] = { ...appts[index], ...updatedAppt };
      localStorage.setItem(DB_KEYS.APPOINTMENTS, JSON.stringify(appts));
    }
    return appts;
  },

  async deleteAppointment(index) {
    if (useFirebase && firestore) {
      try {
        const apptsCol = collection(firestore, "appointments");
        const snap = await getDocs(apptsCol);
        const docToDelete = snap.docs[index];
        if (docToDelete) {
          await deleteDoc(docToDelete.ref);
        }
      } catch (err) {
        console.error("Firebase deleteAppointment failed:", err);
      }
    }
    const appts = JSON.parse(localStorage.getItem(DB_KEYS.APPOINTMENTS)) || [];
    appts.splice(index, 1);
    localStorage.setItem(DB_KEYS.APPOINTMENTS, JSON.stringify(appts));
    return appts;
  }
};
