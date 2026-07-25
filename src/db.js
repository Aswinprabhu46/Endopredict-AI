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
  deleteDoc,
  onSnapshot
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
  {
    "id": 1,
    "name": "Priya Sharma",
    "age": 34,
    "gender": "F",
    "tooth": "#26",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "High",
    "pain": 7,
    "status": "Post-op",
    "lastVisit": "2026-05-28",
    "flareupRisk": 82,
    "analgesic": "Ibuprofen 600mg",
    "followup": "48h",
    "avatar": "PS",
    "phone": "+919876543210"
  },
  {
    "id": 2,
    "name": "Rajan Mehta",
    "age": 52,
    "gender": "M",
    "tooth": "#14",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Scheduled",
    "lastVisit": "2026-05-27",
    "flareupRisk": 47,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "RM",
    "phone": "+919876543211"
  },
  {
    "id": 3,
    "name": "Kavitha Nair",
    "age": 28,
    "gender": "F",
    "tooth": "#36",
    "diagnosis": "Pulp Necrosis",
    "risk": "Low",
    "pain": 3,
    "status": "Completed",
    "lastVisit": "2026-05-25",
    "flareupRisk": 18,
    "analgesic": "None required",
    "followup": "14d",
    "avatar": "KN",
    "phone": "+919876543212"
  },
  {
    "id": 4,
    "name": "Arjun Reddy",
    "age": 45,
    "gender": "M",
    "tooth": "#47",
    "diagnosis": "Retreatment",
    "risk": "High",
    "pain": 8,
    "status": "Emergency",
    "lastVisit": "2026-05-29",
    "flareupRisk": 91,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "AR",
    "phone": "+919876543213"
  },
  {
    "id": 5,
    "name": "Sunita Patel",
    "age": 61,
    "gender": "F",
    "tooth": "#11",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "Medium",
    "pain": 6,
    "status": "Post-op",
    "lastVisit": "2026-05-26",
    "flareupRisk": 55,
    "analgesic": "Ibuprofen 400mg",
    "followup": "72h",
    "avatar": "SP",
    "phone": "+919876543214"
  },
  {
    "id": 6,
    "name": "Vikram Iyer",
    "age": 39,
    "gender": "M",
    "tooth": "#21",
    "diagnosis": "Symptomatic Pulpitis",
    "risk": "Low",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-05-24",
    "flareupRisk": 29,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "VI",
    "phone": "+919876543215"
  },
  {
    "id": 7,
    "name": "Anjali Gupta",
    "age": 41,
    "gender": "F",
    "tooth": "#24",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 6,
    "status": "Post-op",
    "lastVisit": "2026-05-24",
    "flareupRisk": 52,
    "analgesic": "Ibuprofen 400mg",
    "followup": "72h",
    "avatar": "AG",
    "phone": "+919876543216"
  },
  {
    "id": 8,
    "name": "Devendra Verma",
    "age": 64,
    "gender": "M",
    "tooth": "#35",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 8,
    "status": "Post-op",
    "lastVisit": "2026-05-28",
    "flareupRisk": 79,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "DV",
    "phone": "+919876543217"
  },
  {
    "id": 9,
    "name": "Meera Deshmukh",
    "age": 31,
    "gender": "F",
    "tooth": "#16",
    "diagnosis": "Reversible Pulpitis",
    "risk": "Low",
    "pain": 2,
    "status": "Scheduled",
    "lastVisit": "2026-05-20",
    "flareupRisk": 15,
    "analgesic": "None required",
    "followup": "14d",
    "avatar": "MD",
    "phone": "+919876543218"
  },
  {
    "id": 10,
    "name": "Rohan Kapoor",
    "age": 23,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Scheduled",
    "lastVisit": "2026-05-22",
    "flareupRisk": 41,
    "analgesic": "Paracetamol 650mg",
    "followup": "7d",
    "avatar": "RK",
    "phone": "+919876543219"
  },
  {
    "id": 11,
    "name": "Shoba Reddy",
    "age": 22,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-05-03",
    "flareupRisk": 49,
    "analgesic": "None required",
    "followup": "24h",
    "avatar": "SR",
    "phone": "+919876543011"
  },
  {
    "id": 12,
    "name": "Sanjay Mehta",
    "age": 22,
    "gender": "M",
    "tooth": "#46",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "In Progress",
    "lastVisit": "2026-06-07",
    "flareupRisk": 49,
    "analgesic": "Amoxicillin 500mg",
    "followup": "24h",
    "avatar": "SM",
    "phone": "+919876543012"
  },
  {
    "id": 13,
    "name": "Shoba Mukherjee",
    "age": 55,
    "gender": "F",
    "tooth": "#16",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "In Progress",
    "lastVisit": "2026-04-23",
    "flareupRisk": 63,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "SM",
    "phone": "+919876543013"
  },
  {
    "id": 14,
    "name": "Rajan Deshmukh",
    "age": 30,
    "gender": "M",
    "tooth": "#27",
    "diagnosis": "Retreatment",
    "risk": "Medium",
    "pain": 6,
    "status": "Post-op",
    "lastVisit": "2026-03-28",
    "flareupRisk": 41,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "RD",
    "phone": "+919876543014"
  },
  {
    "id": 15,
    "name": "Shilpa Deshmukh",
    "age": 72,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "High",
    "pain": 8,
    "status": "Post-op",
    "lastVisit": "2026-06-10",
    "flareupRisk": 87,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "SD",
    "phone": "+919876543015"
  },
  {
    "id": 16,
    "name": "Rakesh Saxena",
    "age": 33,
    "gender": "M",
    "tooth": "#21",
    "diagnosis": "Apical Periodontitis",
    "risk": "Low",
    "pain": 1,
    "status": "Scheduled",
    "lastVisit": "2026-01-28",
    "flareupRisk": 31,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "RS",
    "phone": "+919876543016"
  },
  {
    "id": 17,
    "name": "Nisha Deshmukh",
    "age": 50,
    "gender": "F",
    "tooth": "#13",
    "diagnosis": "Reversible Pulpitis",
    "risk": "Low",
    "pain": 3,
    "status": "Completed",
    "lastVisit": "2026-06-20",
    "flareupRisk": 21,
    "analgesic": "Paracetamol 500mg",
    "followup": "72h",
    "avatar": "ND",
    "phone": "+919876543017"
  },
  {
    "id": 18,
    "name": "Girish Menon",
    "age": 67,
    "gender": "M",
    "tooth": "#21",
    "diagnosis": "Retreatment",
    "risk": "Low",
    "pain": 3,
    "status": "Emergency",
    "lastVisit": "2026-03-22",
    "flareupRisk": 24,
    "analgesic": "Tramadol 50mg",
    "followup": "14d",
    "avatar": "GM",
    "phone": "+919876543018"
  },
  {
    "id": 19,
    "name": "Vandana Sengupta",
    "age": 70,
    "gender": "F",
    "tooth": "#13",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 4,
    "status": "Completed",
    "lastVisit": "2026-05-07",
    "flareupRisk": 37,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "VS",
    "phone": "+919876543019"
  },
  {
    "id": 20,
    "name": "Rahul Gupta",
    "age": 62,
    "gender": "M",
    "tooth": "#15",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 7,
    "status": "Emergency",
    "lastVisit": "2026-06-08",
    "flareupRisk": 90,
    "analgesic": "Paracetamol 500mg",
    "followup": "72h",
    "avatar": "RG",
    "phone": "+919876543020"
  },
  {
    "id": 21,
    "name": "Sangeetha Menon",
    "age": 37,
    "gender": "F",
    "tooth": "#15",
    "diagnosis": "Calcified Canals",
    "risk": "High",
    "pain": 7,
    "status": "Emergency",
    "lastVisit": "2026-04-17",
    "flareupRisk": 88,
    "analgesic": "Tramadol 50mg",
    "followup": "48h",
    "avatar": "SM",
    "phone": "+919876543021"
  },
  {
    "id": 22,
    "name": "Ashok Sengupta",
    "age": 24,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Scheduled",
    "lastVisit": "2026-04-13",
    "flareupRisk": 30,
    "analgesic": "None required",
    "followup": "7d",
    "avatar": "AS",
    "phone": "+919876543022"
  },
  {
    "id": 23,
    "name": "Shilpa Chawla",
    "age": 54,
    "gender": "F",
    "tooth": "#22",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "High",
    "pain": 9,
    "status": "Post-op",
    "lastVisit": "2026-06-25",
    "flareupRisk": 70,
    "analgesic": "None required",
    "followup": "14d",
    "avatar": "SC",
    "phone": "+919876543023"
  },
  {
    "id": 24,
    "name": "Rajan Reddy",
    "age": 39,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Post-op",
    "lastVisit": "2026-02-25",
    "flareupRisk": 24,
    "analgesic": "None required",
    "followup": "72h",
    "avatar": "RR",
    "phone": "+919876543024"
  },
  {
    "id": 25,
    "name": "Ritu Reddy",
    "age": 61,
    "gender": "F",
    "tooth": "#16",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "High",
    "pain": 9,
    "status": "Scheduled",
    "lastVisit": "2026-05-18",
    "flareupRisk": 89,
    "analgesic": "Paracetamol 500mg",
    "followup": "72h",
    "avatar": "RR",
    "phone": "+919876543025"
  },
  {
    "id": 26,
    "name": "Aarav Agarwal",
    "age": 41,
    "gender": "M",
    "tooth": "#12",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 1,
    "status": "Completed",
    "lastVisit": "2026-05-08",
    "flareupRisk": 13,
    "analgesic": "Tramadol 50mg",
    "followup": "48h",
    "avatar": "AA",
    "phone": "+919876543026"
  },
  {
    "id": 27,
    "name": "Aparna Nair",
    "age": 67,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 2,
    "status": "Scheduled",
    "lastVisit": "2026-03-06",
    "flareupRisk": 27,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "AN",
    "phone": "+919876543027"
  },
  {
    "id": 28,
    "name": "Vivek Tripathi",
    "age": 59,
    "gender": "M",
    "tooth": "#36",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "Completed",
    "lastVisit": "2026-04-17",
    "flareupRisk": 47,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "VT",
    "phone": "+919876543028"
  },
  {
    "id": 29,
    "name": "Deepa Verma",
    "age": 35,
    "gender": "F",
    "tooth": "#47",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 6,
    "status": "In Progress",
    "lastVisit": "2026-01-08",
    "flareupRisk": 36,
    "analgesic": "Amoxicillin 500mg",
    "followup": "48h",
    "avatar": "DV",
    "phone": "+919876543029"
  },
  {
    "id": 30,
    "name": "Arjun Mukherjee",
    "age": 61,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 4,
    "status": "Post-op",
    "lastVisit": "2026-03-08",
    "flareupRisk": 39,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "AM",
    "phone": "+919876543030"
  },
  {
    "id": 31,
    "name": "Sneha Singh",
    "age": 34,
    "gender": "F",
    "tooth": "#37",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "Low",
    "pain": 3,
    "status": "In Progress",
    "lastVisit": "2026-04-26",
    "flareupRisk": 28,
    "analgesic": "Ketorolac 10mg",
    "followup": "48h",
    "avatar": "SS",
    "phone": "+919876543031"
  },
  {
    "id": 32,
    "name": "Karthik Reddy",
    "age": 27,
    "gender": "M",
    "tooth": "#14",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 6,
    "status": "Emergency",
    "lastVisit": "2026-04-02",
    "flareupRisk": 62,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "KR",
    "phone": "+919876543032"
  },
  {
    "id": 33,
    "name": "Sunita Rao",
    "age": 72,
    "gender": "F",
    "tooth": "#15",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-02-14",
    "flareupRisk": 47,
    "analgesic": "Amoxicillin 500mg",
    "followup": "7d",
    "avatar": "SR",
    "phone": "+919876543033"
  },
  {
    "id": 34,
    "name": "Nilesh Chawla",
    "age": 36,
    "gender": "M",
    "tooth": "#46",
    "diagnosis": "Apical Periodontitis",
    "risk": "High",
    "pain": 8,
    "status": "In Progress",
    "lastVisit": "2026-01-27",
    "flareupRisk": 95,
    "analgesic": "Ibuprofen 600mg",
    "followup": "24h",
    "avatar": "NC",
    "phone": "+919876543034"
  },
  {
    "id": 35,
    "name": "Aparna Sengupta",
    "age": 36,
    "gender": "F",
    "tooth": "#12",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 7,
    "status": "Emergency",
    "lastVisit": "2026-04-06",
    "flareupRisk": 85,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "AS",
    "phone": "+919876543035"
  },
  {
    "id": 36,
    "name": "Aarav Bhat",
    "age": 37,
    "gender": "M",
    "tooth": "#15",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "In Progress",
    "lastVisit": "2026-03-07",
    "flareupRisk": 62,
    "analgesic": "None required",
    "followup": "7d",
    "avatar": "AB",
    "phone": "+919876543036"
  },
  {
    "id": 37,
    "name": "Kavitha Mehta",
    "age": 58,
    "gender": "F",
    "tooth": "#37",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "Low",
    "pain": 1,
    "status": "Post-op",
    "lastVisit": "2026-05-17",
    "flareupRisk": 20,
    "analgesic": "Ibuprofen 600mg",
    "followup": "14d",
    "avatar": "KM",
    "phone": "+919876543037"
  },
  {
    "id": 38,
    "name": "Girish Mehta",
    "age": 53,
    "gender": "M",
    "tooth": "#31",
    "diagnosis": "Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "In Progress",
    "lastVisit": "2026-05-04",
    "flareupRisk": 12,
    "analgesic": "Ibuprofen 600mg",
    "followup": "48h",
    "avatar": "GM",
    "phone": "+919876543038"
  },
  {
    "id": 39,
    "name": "Kavya Saxena",
    "age": 59,
    "gender": "F",
    "tooth": "#26",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Low",
    "pain": 2,
    "status": "In Progress",
    "lastVisit": "2026-02-09",
    "flareupRisk": 23,
    "analgesic": "Amoxicillin 500mg",
    "followup": "14d",
    "avatar": "KS",
    "phone": "+919876543039"
  },
  {
    "id": 40,
    "name": "Rahul Verma",
    "age": 37,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Completed",
    "lastVisit": "2026-04-01",
    "flareupRisk": 31,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "RV",
    "phone": "+919876543040"
  },
  {
    "id": 41,
    "name": "Shilpa Saxena",
    "age": 27,
    "gender": "F",
    "tooth": "#27",
    "diagnosis": "Apical Periodontitis",
    "risk": "High",
    "pain": 9,
    "status": "In Progress",
    "lastVisit": "2026-02-03",
    "flareupRisk": 76,
    "analgesic": "Tramadol 50mg",
    "followup": "48h",
    "avatar": "SS",
    "phone": "+919876543041"
  },
  {
    "id": 42,
    "name": "Rakesh Kapoor",
    "age": 31,
    "gender": "M",
    "tooth": "#11",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 9,
    "status": "Completed",
    "lastVisit": "2026-05-22",
    "flareupRisk": 92,
    "analgesic": "Amoxicillin 500mg",
    "followup": "14d",
    "avatar": "RK",
    "phone": "+919876543042"
  },
  {
    "id": 43,
    "name": "Meera Subramanian",
    "age": 27,
    "gender": "F",
    "tooth": "#15",
    "diagnosis": "Pulp Necrosis",
    "risk": "Medium",
    "pain": 5,
    "status": "Post-op",
    "lastVisit": "2026-03-09",
    "flareupRisk": 42,
    "analgesic": "None required",
    "followup": "14d",
    "avatar": "MS",
    "phone": "+919876543043"
  },
  {
    "id": 44,
    "name": "Kiran Mukherjee",
    "age": 42,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Retreatment",
    "risk": "Medium",
    "pain": 5,
    "status": "Emergency",
    "lastVisit": "2026-04-21",
    "flareupRisk": 67,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "KM",
    "phone": "+919876543044"
  },
  {
    "id": 45,
    "name": "Vandana Deshmukh",
    "age": 23,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 6,
    "status": "Completed",
    "lastVisit": "2026-04-23",
    "flareupRisk": 43,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "VD",
    "phone": "+919876543045"
  },
  {
    "id": 46,
    "name": "Aarav Reddy",
    "age": 25,
    "gender": "M",
    "tooth": "#15",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 9,
    "status": "Completed",
    "lastVisit": "2026-02-14",
    "flareupRisk": 71,
    "analgesic": "Amoxicillin 500mg",
    "followup": "14d",
    "avatar": "AR",
    "phone": "+919876543046"
  },
  {
    "id": 47,
    "name": "Anitha Kapoor",
    "age": 44,
    "gender": "F",
    "tooth": "#27",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 6,
    "status": "Scheduled",
    "lastVisit": "2026-05-25",
    "flareupRisk": 48,
    "analgesic": "None required",
    "followup": "24h",
    "avatar": "AK",
    "phone": "+919876543047"
  },
  {
    "id": 48,
    "name": "Sachin Agarwal",
    "age": 68,
    "gender": "M",
    "tooth": "#16",
    "diagnosis": "Pulp Necrosis",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-03-24",
    "flareupRisk": 45,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "SA",
    "phone": "+919876543048"
  },
  {
    "id": 49,
    "name": "Uma Kulkarni",
    "age": 72,
    "gender": "F",
    "tooth": "#37",
    "diagnosis": "Retreatment",
    "risk": "Medium",
    "pain": 5,
    "status": "Post-op",
    "lastVisit": "2026-02-08",
    "flareupRisk": 45,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "UK",
    "phone": "+919876543049"
  },
  {
    "id": 50,
    "name": "Vikram Joshi",
    "age": 40,
    "gender": "M",
    "tooth": "#22",
    "diagnosis": "Retreatment",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-01-28",
    "flareupRisk": 36,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "VJ",
    "phone": "+919876543050"
  },
  {
    "id": 51,
    "name": "Swati Deshmukh",
    "age": 43,
    "gender": "F",
    "tooth": "#14",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "High",
    "pain": 7,
    "status": "In Progress",
    "lastVisit": "2026-02-09",
    "flareupRisk": 91,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "SD",
    "phone": "+919876543051"
  },
  {
    "id": 52,
    "name": "Nikhil Mehta",
    "age": 27,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Calcified Canals",
    "risk": "High",
    "pain": 7,
    "status": "Completed",
    "lastVisit": "2026-04-04",
    "flareupRisk": 81,
    "analgesic": "Ketorolac 10mg",
    "followup": "14d",
    "avatar": "NM",
    "phone": "+919876543052"
  },
  {
    "id": 53,
    "name": "Shalini Gupta",
    "age": 37,
    "gender": "F",
    "tooth": "#27",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "High",
    "pain": 7,
    "status": "In Progress",
    "lastVisit": "2026-01-14",
    "flareupRisk": 70,
    "analgesic": "Amoxicillin 500mg",
    "followup": "48h",
    "avatar": "SG",
    "phone": "+919876543053"
  },
  {
    "id": 54,
    "name": "Rajan Agarwal",
    "age": 41,
    "gender": "M",
    "tooth": "#26",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Completed",
    "lastVisit": "2026-06-13",
    "flareupRisk": 67,
    "analgesic": "None required",
    "followup": "7d",
    "avatar": "RA",
    "phone": "+919876543054"
  },
  {
    "id": 55,
    "name": "Meera Menon",
    "age": 29,
    "gender": "F",
    "tooth": "#47",
    "diagnosis": "Retreatment",
    "risk": "High",
    "pain": 7,
    "status": "Emergency",
    "lastVisit": "2026-04-10",
    "flareupRisk": 91,
    "analgesic": "None required",
    "followup": "48h",
    "avatar": "MM",
    "phone": "+919876543055"
  },
  {
    "id": 56,
    "name": "Aarav Kapoor",
    "age": 39,
    "gender": "M",
    "tooth": "#36",
    "diagnosis": "Retreatment",
    "risk": "High",
    "pain": 7,
    "status": "In Progress",
    "lastVisit": "2026-04-15",
    "flareupRisk": 95,
    "analgesic": "Amoxicillin 500mg",
    "followup": "72h",
    "avatar": "AK",
    "phone": "+919876543056"
  },
  {
    "id": 57,
    "name": "Sneha Gupta",
    "age": 53,
    "gender": "F",
    "tooth": "#26",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Post-op",
    "lastVisit": "2026-02-03",
    "flareupRisk": 31,
    "analgesic": "Tramadol 50mg",
    "followup": "14d",
    "avatar": "SG",
    "phone": "+919876543057"
  },
  {
    "id": 58,
    "name": "Pradeep Verma",
    "age": 72,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Retreatment",
    "risk": "Low",
    "pain": 3,
    "status": "Post-op",
    "lastVisit": "2026-04-15",
    "flareupRisk": 10,
    "analgesic": "Paracetamol 500mg",
    "followup": "7d",
    "avatar": "PV",
    "phone": "+919876543058"
  },
  {
    "id": 59,
    "name": "Shoba Saxena",
    "age": 33,
    "gender": "F",
    "tooth": "#14",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 8,
    "status": "Scheduled",
    "lastVisit": "2026-04-25",
    "flareupRisk": 82,
    "analgesic": "Paracetamol 500mg",
    "followup": "24h",
    "avatar": "SS",
    "phone": "+919876543059"
  },
  {
    "id": 60,
    "name": "Manish Iyer",
    "age": 72,
    "gender": "M",
    "tooth": "#36",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "High",
    "pain": 8,
    "status": "In Progress",
    "lastVisit": "2026-04-05",
    "flareupRisk": 71,
    "analgesic": "Paracetamol 500mg",
    "followup": "24h",
    "avatar": "MI",
    "phone": "+919876543060"
  },
  {
    "id": 61,
    "name": "Sneha Pillai",
    "age": 56,
    "gender": "F",
    "tooth": "#35",
    "diagnosis": "Calcified Canals",
    "risk": "Medium",
    "pain": 6,
    "status": "In Progress",
    "lastVisit": "2026-05-27",
    "flareupRisk": 63,
    "analgesic": "None required",
    "followup": "14d",
    "avatar": "SP",
    "phone": "+919876543061"
  },
  {
    "id": 62,
    "name": "Suresh Iyer",
    "age": 68,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 8,
    "status": "Scheduled",
    "lastVisit": "2026-06-16",
    "flareupRisk": 78,
    "analgesic": "None required",
    "followup": "72h",
    "avatar": "SI",
    "phone": "+919876543062"
  },
  {
    "id": 63,
    "name": "Kavya Deshmukh",
    "age": 49,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Completed",
    "lastVisit": "2026-02-03",
    "flareupRisk": 50,
    "analgesic": "Tramadol 50mg",
    "followup": "72h",
    "avatar": "KD",
    "phone": "+919876543063"
  },
  {
    "id": 64,
    "name": "Ganesh Verma",
    "age": 45,
    "gender": "M",
    "tooth": "#46",
    "diagnosis": "Pulp Necrosis",
    "risk": "Medium",
    "pain": 4,
    "status": "Emergency",
    "lastVisit": "2026-04-15",
    "flareupRisk": 39,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "GV",
    "phone": "+919876543064"
  },
  {
    "id": 65,
    "name": "Anitha Gupta",
    "age": 47,
    "gender": "F",
    "tooth": "#27",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 1,
    "status": "Emergency",
    "lastVisit": "2026-04-10",
    "flareupRisk": 28,
    "analgesic": "Ketorolac 10mg",
    "followup": "24h",
    "avatar": "AG",
    "phone": "+919876543065"
  },
  {
    "id": 66,
    "name": "Sachin Menon",
    "age": 68,
    "gender": "M",
    "tooth": "#37",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-04-01",
    "flareupRisk": 66,
    "analgesic": "Tramadol 50mg",
    "followup": "7d",
    "avatar": "SM",
    "phone": "+919876543066"
  },
  {
    "id": 67,
    "name": "Nandini Subramanian",
    "age": 64,
    "gender": "F",
    "tooth": "#11",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Scheduled",
    "lastVisit": "2026-05-13",
    "flareupRisk": 24,
    "analgesic": "Amoxicillin 500mg",
    "followup": "14d",
    "avatar": "NS",
    "phone": "+919876543067"
  },
  {
    "id": 68,
    "name": "Aditya Nair",
    "age": 62,
    "gender": "M",
    "tooth": "#31",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 3,
    "status": "Scheduled",
    "lastVisit": "2026-02-11",
    "flareupRisk": 24,
    "analgesic": "Ibuprofen 600mg",
    "followup": "72h",
    "avatar": "AN",
    "phone": "+919876543068"
  },
  {
    "id": 69,
    "name": "Priya Rao",
    "age": 42,
    "gender": "F",
    "tooth": "#11",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Completed",
    "lastVisit": "2026-05-24",
    "flareupRisk": 61,
    "analgesic": "Ibuprofen 600mg",
    "followup": "7d",
    "avatar": "PR",
    "phone": "+919876543069"
  },
  {
    "id": 70,
    "name": "Anand Joshi",
    "age": 35,
    "gender": "M",
    "tooth": "#15",
    "diagnosis": "Apical Periodontitis",
    "risk": "Low",
    "pain": 1,
    "status": "Scheduled",
    "lastVisit": "2026-02-08",
    "flareupRisk": 10,
    "analgesic": "Paracetamol 500mg",
    "followup": "24h",
    "avatar": "AJ",
    "phone": "+919876543070"
  },
  {
    "id": 71,
    "name": "Radha Subramanian",
    "age": 28,
    "gender": "F",
    "tooth": "#14",
    "diagnosis": "Calcified Canals",
    "risk": "Medium",
    "pain": 4,
    "status": "Completed",
    "lastVisit": "2026-02-25",
    "flareupRisk": 64,
    "analgesic": "Tramadol 50mg",
    "followup": "48h",
    "avatar": "RS",
    "phone": "+919876543071"
  },
  {
    "id": 72,
    "name": "Pradeep Reddy",
    "age": 58,
    "gender": "M",
    "tooth": "#13",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Emergency",
    "lastVisit": "2026-06-19",
    "flareupRisk": 59,
    "analgesic": "None required",
    "followup": "48h",
    "avatar": "PR",
    "phone": "+919876543072"
  },
  {
    "id": 73,
    "name": "Vandana Choudhury",
    "age": 36,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "In Progress",
    "lastVisit": "2026-06-14",
    "flareupRisk": 42,
    "analgesic": "Ibuprofen 600mg",
    "followup": "72h",
    "avatar": "VC",
    "phone": "+919876543073"
  },
  {
    "id": 74,
    "name": "Rakesh Nair",
    "age": 53,
    "gender": "M",
    "tooth": "#27",
    "diagnosis": "Reversible Pulpitis",
    "risk": "Low",
    "pain": 1,
    "status": "Emergency",
    "lastVisit": "2026-04-21",
    "flareupRisk": 23,
    "analgesic": "Ibuprofen 600mg",
    "followup": "7d",
    "avatar": "RN",
    "phone": "+919876543074"
  },
  {
    "id": 75,
    "name": "Sonali Patel",
    "age": 48,
    "gender": "F",
    "tooth": "#37",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 9,
    "status": "Completed",
    "lastVisit": "2026-04-15",
    "flareupRisk": 90,
    "analgesic": "Amoxicillin 500mg",
    "followup": "14d",
    "avatar": "SP",
    "phone": "+919876543075"
  },
  {
    "id": 76,
    "name": "Nilesh Rao",
    "age": 36,
    "gender": "M",
    "tooth": "#31",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Scheduled",
    "lastVisit": "2026-01-11",
    "flareupRisk": 63,
    "analgesic": "Ketorolac 10mg",
    "followup": "14d",
    "avatar": "NR",
    "phone": "+919876543076"
  },
  {
    "id": 77,
    "name": "Radha Tripathi",
    "age": 41,
    "gender": "F",
    "tooth": "#22",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 8,
    "status": "Completed",
    "lastVisit": "2026-06-20",
    "flareupRisk": 76,
    "analgesic": "Tramadol 50mg",
    "followup": "72h",
    "avatar": "RT",
    "phone": "+919876543077"
  },
  {
    "id": 78,
    "name": "Nilesh Menon",
    "age": 21,
    "gender": "M",
    "tooth": "#37",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-02-18",
    "flareupRisk": 40,
    "analgesic": "None required",
    "followup": "7d",
    "avatar": "NM",
    "phone": "+919876543078"
  },
  {
    "id": 79,
    "name": "Sonali Singh",
    "age": 62,
    "gender": "F",
    "tooth": "#21",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 8,
    "status": "Post-op",
    "lastVisit": "2026-06-13",
    "flareupRisk": 95,
    "analgesic": "Ibuprofen 600mg",
    "followup": "72h",
    "avatar": "SS",
    "phone": "+919876543079"
  },
  {
    "id": 80,
    "name": "Manoj Kapoor",
    "age": 63,
    "gender": "M",
    "tooth": "#35",
    "diagnosis": "Calcified Canals",
    "risk": "Medium",
    "pain": 6,
    "status": "In Progress",
    "lastVisit": "2026-05-24",
    "flareupRisk": 65,
    "analgesic": "Amoxicillin 500mg",
    "followup": "72h",
    "avatar": "MK",
    "phone": "+919876543080"
  },
  {
    "id": 81,
    "name": "Nandini Joshi",
    "age": 65,
    "gender": "F",
    "tooth": "#17",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Completed",
    "lastVisit": "2026-01-11",
    "flareupRisk": 54,
    "analgesic": "Paracetamol 500mg",
    "followup": "24h",
    "avatar": "NJ",
    "phone": "+919876543081"
  },
  {
    "id": 82,
    "name": "Yash Sengupta",
    "age": 65,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Pulp Necrosis",
    "risk": "Medium",
    "pain": 4,
    "status": "Emergency",
    "lastVisit": "2026-03-20",
    "flareupRisk": 48,
    "analgesic": "Tramadol 50mg",
    "followup": "14d",
    "avatar": "YS",
    "phone": "+919876543082"
  },
  {
    "id": 83,
    "name": "Deepa Dutta",
    "age": 33,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "Medium",
    "pain": 4,
    "status": "Scheduled",
    "lastVisit": "2026-03-05",
    "flareupRisk": 58,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "DD",
    "phone": "+919876543083"
  },
  {
    "id": 84,
    "name": "Amit Mehta",
    "age": 56,
    "gender": "M",
    "tooth": "#47",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "Low",
    "pain": 3,
    "status": "Emergency",
    "lastVisit": "2026-04-10",
    "flareupRisk": 30,
    "analgesic": "Ibuprofen 600mg",
    "followup": "24h",
    "avatar": "AM",
    "phone": "+919876543084"
  },
  {
    "id": 85,
    "name": "Radha Chawla",
    "age": 42,
    "gender": "F",
    "tooth": "#31",
    "diagnosis": "Pulp Necrosis",
    "risk": "Low",
    "pain": 1,
    "status": "Emergency",
    "lastVisit": "2026-01-16",
    "flareupRisk": 18,
    "analgesic": "Ibuprofen 600mg",
    "followup": "24h",
    "avatar": "RC",
    "phone": "+919876543085"
  },
  {
    "id": 86,
    "name": "Anand Patel",
    "age": 30,
    "gender": "M",
    "tooth": "#35",
    "diagnosis": "Calcified Canals",
    "risk": "Medium",
    "pain": 5,
    "status": "Scheduled",
    "lastVisit": "2026-05-20",
    "flareupRisk": 40,
    "analgesic": "Ibuprofen 600mg",
    "followup": "14d",
    "avatar": "AP",
    "phone": "+919876543086"
  },
  {
    "id": 87,
    "name": "Uma Agarwal",
    "age": 35,
    "gender": "F",
    "tooth": "#35",
    "diagnosis": "Cracked Tooth Syndrome",
    "risk": "High",
    "pain": 7,
    "status": "Emergency",
    "lastVisit": "2026-05-10",
    "flareupRisk": 84,
    "analgesic": "Tramadol 50mg",
    "followup": "14d",
    "avatar": "UA",
    "phone": "+919876543087"
  },
  {
    "id": 88,
    "name": "Anand Agarwal",
    "age": 68,
    "gender": "M",
    "tooth": "#16",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "Completed",
    "lastVisit": "2026-02-08",
    "flareupRisk": 48,
    "analgesic": "None required",
    "followup": "24h",
    "avatar": "AA",
    "phone": "+919876543088"
  },
  {
    "id": 89,
    "name": "Sangeetha Nair",
    "age": 31,
    "gender": "F",
    "tooth": "#12",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "High",
    "pain": 7,
    "status": "In Progress",
    "lastVisit": "2026-03-08",
    "flareupRisk": 84,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "SN",
    "phone": "+919876543089"
  },
  {
    "id": 90,
    "name": "Prakash Mukherjee",
    "age": 50,
    "gender": "M",
    "tooth": "#35",
    "diagnosis": "Apical Periodontitis",
    "risk": "Medium",
    "pain": 4,
    "status": "In Progress",
    "lastVisit": "2026-05-04",
    "flareupRisk": 51,
    "analgesic": "None required",
    "followup": "48h",
    "avatar": "PM",
    "phone": "+919876543090"
  },
  {
    "id": 91,
    "name": "Kavya Choudhury",
    "age": 30,
    "gender": "F",
    "tooth": "#47",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "Low",
    "pain": 3,
    "status": "Post-op",
    "lastVisit": "2026-04-10",
    "flareupRisk": 12,
    "analgesic": "Paracetamol 500mg",
    "followup": "72h",
    "avatar": "KC",
    "phone": "+919876543091"
  },
  {
    "id": 92,
    "name": "Devendra Chawla",
    "age": 65,
    "gender": "M",
    "tooth": "#36",
    "diagnosis": "Chronic Apical Abscess",
    "risk": "High",
    "pain": 7,
    "status": "In Progress",
    "lastVisit": "2026-05-03",
    "flareupRisk": 78,
    "analgesic": "Amoxicillin 500mg",
    "followup": "7d",
    "avatar": "DC",
    "phone": "+919876543092"
  },
  {
    "id": 93,
    "name": "Anitha Kulkarni",
    "age": 68,
    "gender": "F",
    "tooth": "#47",
    "diagnosis": "Reversible Pulpitis",
    "risk": "Medium",
    "pain": 5,
    "status": "Post-op",
    "lastVisit": "2026-06-01",
    "flareupRisk": 36,
    "analgesic": "Paracetamol 500mg",
    "followup": "14d",
    "avatar": "AK",
    "phone": "+919876543093"
  },
  {
    "id": 94,
    "name": "Nilesh Saxena",
    "age": 23,
    "gender": "M",
    "tooth": "#47",
    "diagnosis": "Pulp Necrosis",
    "risk": "High",
    "pain": 8,
    "status": "Emergency",
    "lastVisit": "2026-06-14",
    "flareupRisk": 86,
    "analgesic": "Tramadol 50mg",
    "followup": "48h",
    "avatar": "NS",
    "phone": "+919876543094"
  },
  {
    "id": 95,
    "name": "Vandana Singh",
    "age": 26,
    "gender": "F",
    "tooth": "#16",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Medium",
    "pain": 6,
    "status": "Completed",
    "lastVisit": "2026-04-11",
    "flareupRisk": 61,
    "analgesic": "Tramadol 50mg",
    "followup": "24h",
    "avatar": "VS",
    "phone": "+919876543095"
  },
  {
    "id": 96,
    "name": "Vinod Kapoor",
    "age": 63,
    "gender": "M",
    "tooth": "#22",
    "diagnosis": "Symptomatic Apical Periodontitis",
    "risk": "High",
    "pain": 9,
    "status": "Emergency",
    "lastVisit": "2026-01-11",
    "flareupRisk": 71,
    "analgesic": "Ibuprofen 600mg",
    "followup": "72h",
    "avatar": "VK",
    "phone": "+919876543096"
  },
  {
    "id": 97,
    "name": "Swati Bhat",
    "age": 53,
    "gender": "F",
    "tooth": "#45",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "High",
    "pain": 9,
    "status": "Emergency",
    "lastVisit": "2026-05-12",
    "flareupRisk": 84,
    "analgesic": "Ibuprofen 600mg",
    "followup": "48h",
    "avatar": "SB",
    "phone": "+919876543097"
  },
  {
    "id": 98,
    "name": "Vinod Choudhury",
    "age": 49,
    "gender": "M",
    "tooth": "#36",
    "diagnosis": "Irreversible Pulpitis",
    "risk": "Medium",
    "pain": 4,
    "status": "In Progress",
    "lastVisit": "2026-04-23",
    "flareupRisk": 52,
    "analgesic": "Paracetamol 500mg",
    "followup": "72h",
    "avatar": "VC",
    "phone": "+919876543098"
  },
  {
    "id": 99,
    "name": "Deepa Sharma",
    "age": 61,
    "gender": "F",
    "tooth": "#46",
    "diagnosis": "Calcified Canals",
    "risk": "Medium",
    "pain": 4,
    "status": "Completed",
    "lastVisit": "2026-01-14",
    "flareupRisk": 45,
    "analgesic": "Amoxicillin 500mg",
    "followup": "24h",
    "avatar": "DS",
    "phone": "+919876543099"
  },
  {
    "id": 100,
    "name": "Manish Dutta",
    "age": 28,
    "gender": "M",
    "tooth": "#45",
    "diagnosis": "Asymptomatic Apical Periodontitis",
    "risk": "Low",
    "pain": 2,
    "status": "Scheduled",
    "lastVisit": "2026-03-23",
    "flareupRisk": 30,
    "analgesic": "Ketorolac 10mg",
    "followup": "72h",
    "avatar": "MD",
    "phone": "+919876543100"
  }
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
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-endopredict-clinical-client-key",
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

if (FIREBASE_CONFIG && FIREBASE_CONFIG.projectId) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    firestore = getFirestore(app);
    useFirebase = true;
    console.log("Firebase initialized successfully with cloud configuration for project:", FIREBASE_CONFIG.projectId);
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

  subscribePatients(callback) {
    if (useFirebase && firestore) {
      try {
        return onSnapshot(collection(firestore, "patients"), (snap) => {
          const pts = snap.docs.map(d => d.data());
          if (pts.length > 0) {
            const normalized = pts.map((p) => {
              const defaultVisits = [
                { date: p.lastVisit || "2026-07-10", problems: p.diagnosis || "Irreversible Pulpitis", notes: "Initial diagnosis and treatment planning.", status: p.status || "Completed" }
              ];
              const rawPhone = p.phone || `9876543210`;
              return {
                ...p,
                phone: rawPhone,
                visits: p.visits || defaultVisits,
                medicalHistory: p.medicalHistory || "None declared",
                allergies: p.allergies || "No known drug allergies",
                documents: p.documents || []
              };
            });
            callback(normalized);
          }
        });
      } catch (e) {
        console.error("subscribePatients error:", e);
      }
    }
    return () => {};
  },

  subscribeTeeth(callback) {
    if (useFirebase && firestore) {
      try {
        return onSnapshot(collection(firestore, "teeth"), (snap) => {
          const teethObj = {};
          snap.docs.forEach(d => {
            teethObj[d.id] = d.data();
          });
          if (Object.keys(teethObj).length > 0) {
            callback(teethObj);
          }
        });
      } catch (e) {
        console.error("subscribeTeeth error:", e);
      }
    }
    return () => {};
  },

  subscribeAppointments(callback) {
    if (useFirebase && firestore) {
      try {
        return onSnapshot(collection(firestore, "appointments"), (snap) => {
          const appts = snap.docs.map(d => d.data());
          if (appts.length > 0) {
            callback(appts);
          }
        });
      } catch (e) {
        console.error("subscribeAppointments error:", e);
      }
    }
    return () => {};
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

        // Patients collection - ensure all 100 patients exist in Firebase Cloud Firestore
        for (const p of DEFAULT_PATIENTS) {
          try {
            await setDoc(doc(firestore, "patients", String(p.id)), p, { merge: true });
          } catch (e) {
            console.error(`Error setting patient doc ${p.id}:`, e);
          }
        }

        // Teeth collection
        for (const [id, t] of Object.entries(DEFAULT_TEETH)) {
          try {
            await setDoc(doc(firestore, "teeth", String(id)), t, { merge: true });
          } catch (e) {}
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

  async forceSyncAllToFirebase() {
    if (useFirebase && firestore) {
      let count = 0;
      for (const p of DEFAULT_PATIENTS) {
        try {
          await setDoc(doc(firestore, "patients", String(p.id)), p, { merge: true });
          count++;
        } catch (e) {
          console.error("forceSyncAllToFirebase patient error:", e);
        }
      }
      for (const [id, t] of Object.entries(DEFAULT_TEETH)) {
        try {
          await setDoc(doc(firestore, "teeth", String(id)), t, { merge: true });
        } catch (e) {}
      }
      return { success: true, count };
    }
    return { success: false, message: "Firebase is not initialized." };
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
