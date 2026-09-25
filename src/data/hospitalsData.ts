export type DelhiZone = 'Central' | 'South' | 'North' | 'West' | 'East' | 'Dwarka';
export type HospitalType = 'Government' | 'Private';
export type AmbulanceStatus = 'Active Standby' | 'Immediate Dispatch' | 'On Call' | 'Limited Availability';

export interface Hospital {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  emergency_phone: string;
  ambulance_response_min: number;
  specialization: string[];
  emergency_available: boolean;
  has_ambulance: boolean;
  zone: DelhiZone;
  type: HospitalType;
  available_ambulances: number;
  ambulance_status: AmbulanceStatus;
}

export interface HospitalDatabase {
  [region: string]: {
    hospitals: Hospital[];
  };
}

export const UPLOADED_HOSPITALS_DATA: HospitalDatabase = {
  "south delhi": {
    hospitals: [
      {
        name: "AIIMS New Delhi (JPN Apex Trauma Center)",
        address: "Sri Aurobindo Marg, Ansari Nagar East, New Delhi 110029",
        latitude: 28.5672,
        longitude: 77.2100,
        distance_km: 1.2,
        emergency_phone: "011-2658-8500",
        ambulance_response_min: 7,
        specialization: ["Apex Level-1 Trauma", "Emergency Medicine", "Cardiothoracic Surgery", "Neurosurgery", "Toxicology & Critical Care"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Government",
        available_ambulances: 6,
        ambulance_status: "Active Standby"
      },
      {
        name: "VMMC & Safdarjung Hospital",
        address: "Ring Road, Opposite AIIMS, Ansari Nagar West, New Delhi 110029",
        latitude: 28.5702,
        longitude: 77.2066,
        distance_km: 1.4,
        emergency_phone: "011-2616-5060",
        ambulance_response_min: 8,
        specialization: ["24x7 Emergency Trauma", "National Burns Centre", "Orthopedics & Polytrauma", "General Surgery", "Pediatric Emergency"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Max Super Speciality Hospital, Saket",
        address: "1, 2, Press Enclave Road, Mandir Marg, Saket, New Delhi 110017",
        latitude: 28.5273,
        longitude: 77.2119,
        distance_km: 3.5,
        emergency_phone: "011-4055-4055",
        ambulance_response_min: 9,
        specialization: ["Level-1 Emergency & Trauma", "STEMI Chest Pain Center", "Comprehensive Stroke Unit", "Organ Transplant ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Indraprastha Apollo Hospital",
        address: "Sarita Vihar, Delhi-Mathura Road, New Delhi 110076",
        latitude: 28.5398,
        longitude: 77.2872,
        distance_km: 5.2,
        emergency_phone: "011-2929-9090",
        ambulance_response_min: 10,
        specialization: ["Emergency & Trauma Care", "Interventional Cardiology", "Acute Stroke Resuscitation", "Neurosurgery ICU", "Pediatric Emergency"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Private",
        available_ambulances: 5,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Fortis Escorts Heart Institute",
        address: "Okhla Road, Sukhdev Vihar Metro Station, New Delhi 110025",
        latitude: 28.5606,
        longitude: 77.2801,
        distance_km: 4.8,
        emergency_phone: "011-4713-5000",
        ambulance_response_min: 9,
        specialization: ["Emergency Cardiac Resuscitation", "Cath Lab 24x7", "ECMO & Critical Care", "Vascular Surgery"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Fortis Flt. Lt. Rajan Dhall Hospital, Vasant Kunj",
        address: "Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj, New Delhi 110070",
        latitude: 28.5284,
        longitude: 77.1517,
        distance_km: 4.1,
        emergency_phone: "011-4277-6222",
        ambulance_response_min: 10,
        specialization: ["Emergency Medicine", "Polytrauma", "Neurology & Stroke", "Critical Care ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      }
    ]
  },
  "central delhi": {
    hospitals: [
      {
        name: "Dr. Ram Manohar Lohia Hospital (RML Hospital)",
        address: "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
        latitude: 28.6251,
        longitude: 77.2016,
        distance_km: 1.8,
        emergency_phone: "011-2336-5525",
        ambulance_response_min: 8,
        specialization: ["Apex Trauma Center", "Emergency Medicine", "Cardiology & Cath Lab", "Intensive Care Unit", "Toxicology & Poisoning"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Lok Nayak Jai Prakash Narayan Hospital (LNJP / MAMC)",
        address: "Jawaharlal Nehru Marg, Delhi Gate, New Delhi 110002",
        latitude: 28.6366,
        longitude: 77.2410,
        distance_km: 2.5,
        emergency_phone: "011-2323-3000",
        ambulance_response_min: 9,
        specialization: ["Level-1 Emergency & Trauma", "Disaster Resuscitation", "Pediatric Emergency", "Burns & Plastic Surgery", "Infectious Diseases"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Sir Ganga Ram Hospital",
        address: "Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi 110060",
        latitude: 28.6384,
        longitude: 77.1895,
        distance_km: 2.9,
        emergency_phone: "011-4225-4000",
        ambulance_response_min: 8,
        specialization: ["Emergency Resuscitation Unit", "Cardiothoracic Surgery", "Neurosurgery & Acute Stroke", "Pediatric ICU", "Multiorgan Trauma"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Lady Hardinge Medical College & S.K. Hospital (LHMC)",
        address: "Shaheed Bhagat Singh Marg, Connaught Place, New Delhi 110001",
        latitude: 28.6335,
        longitude: 77.2144,
        distance_km: 1.5,
        emergency_phone: "011-2336-3728",
        ambulance_response_min: 10,
        specialization: ["Emergency Medicine", "Obstetrics & High-Risk Pregnancy", "Pediatric Intensive Care", "General Surgery"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Govind Ballabh Pant Hospital (G.B. Pant)",
        address: "1, Jawaharlal Nehru Marg, Raj Ghat, New Delhi 110002",
        latitude: 28.6375,
        longitude: 77.2425,
        distance_km: 2.7,
        emergency_phone: "011-2323-4242",
        ambulance_response_min: 11,
        specialization: ["Cardiac Emergency & Cath Lab", "Neurosurgical Emergency", "Gastrointestinal Critical Care", "Super-Specialty ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "On Call"
      }
    ]
  },
  "dwarka, delhi": {
    hospitals: [
      {
        name: "Manipal Hospital Dwarka",
        address: "Palam Vihar Road, Sector 6, Dwarka, New Delhi 110075",
        latitude: 28.5832,
        longitude: 77.0682,
        distance_km: 1.5,
        emergency_phone: "011-4967-4967",
        ambulance_response_min: 6,
        specialization: ["Quaternary Emergency & Trauma", "STEMI Chest Pain Center", "Acute Stroke Resuscitation", "Pediatric & Neonatal ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Fortis Hospital Dwarka",
        address: "Plot 1, Pocket C-5, Sector 8, Dwarka, Delhi 110077",
        latitude: 28.5921,
        longitude: 77.0460,
        distance_km: 2.3,
        emergency_phone: "011-4247-3000",
        ambulance_response_min: 7,
        specialization: ["Emergency Medicine", "Interventional Cardiology", "Neuro-trauma", "Intensive Care"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Venkateshwar Hospital",
        address: "Sector 18A, Dwarka, New Delhi 110075",
        latitude: 28.5886,
        longitude: 77.0422,
        distance_km: 2.8,
        emergency_phone: "011-4855-5555",
        ambulance_response_min: 8,
        specialization: ["24x7 Critical Care Emergency", "Cardiology", "Trauma & Orthopedics", "Pulmonology"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Aakash Healthcare Super Speciality Hospital",
        address: "Road No. 201, Sector 3, Dwarka, New Delhi 110075",
        latitude: 28.6042,
        longitude: 77.0504,
        distance_km: 3.1,
        emergency_phone: "011-2808-8888",
        ambulance_response_min: 8,
        specialization: ["Emergency & Trauma", "Orthopedics & Joint Reconstruction", "Cardiology & Cath Lab", "Critical Care ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Indira Gandhi Hospital (Dwarka Govt. Hospital)",
        address: "Sector 9, Dwarka, New Delhi 110077",
        latitude: 28.5772,
        longitude: 77.0645,
        distance_km: 2.6,
        emergency_phone: "011-2808-0101",
        ambulance_response_min: 9,
        specialization: ["Government 24x7 Emergency", "Trauma Care", "General Surgery", "Pediatrics & Medicine"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      }
    ]
  },
  "west delhi": {
    hospitals: [
      {
        name: "Deen Dayal Upadhyay Hospital (DDU Hospital)",
        address: "Clock Tower, Hari Nagar, New Delhi 110064",
        latitude: 28.6277,
        longitude: 77.1121,
        distance_km: 2.1,
        emergency_phone: "011-2549-4402",
        ambulance_response_min: 9,
        specialization: ["Level-1 Govt. Trauma & Emergency", "Orthopedics & Fractures", "General & Laparoscopic Surgery", "Pediatric Resuscitation"],
        emergency_available: true,
        has_ambulance: true,
        zone: "West",
        type: "Government",
        available_ambulances: 4,
        ambulance_status: "Active Standby"
      },
      {
        name: "Mata Chanan Devi Hospital",
        address: "C-1, Janakpuri, New Delhi 110058",
        latitude: 28.6256,
        longitude: 77.0863,
        distance_km: 2.4,
        emergency_phone: "011-4558-2000",
        ambulance_response_min: 8,
        specialization: ["Emergency & Trauma", "Cardiology & CCU", "Neuro-trauma", "Nephrology & Dialysis"],
        emergency_available: true,
        has_ambulance: true,
        zone: "West",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Maharaja Agrasen Hospital, Punjabi Bagh",
        address: "Block C, West Punjabi Bagh, New Delhi 110026",
        latitude: 28.6672,
        longitude: 77.1264,
        distance_km: 3.8,
        emergency_phone: "011-4077-7666",
        ambulance_response_min: 9,
        specialization: ["Emergency & Critical Care", "Interventional Cardiology", "Trauma & Orthopedics", "Gastroenterology"],
        emergency_available: true,
        has_ambulance: true,
        zone: "West",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Kalra Hospital SRCNC",
        address: "Tulsi Dass Kalra Marg, Kirti Nagar, New Delhi 110015",
        latitude: 28.6534,
        longitude: 77.1352,
        distance_km: 4.2,
        emergency_phone: "011-4500-5600",
        ambulance_response_min: 11,
        specialization: ["Emergency Cardiac Care", "Neurosurgery", "Critical Care Medicine", "Plastic & Reconstructive Surgery"],
        emergency_available: true,
        has_ambulance: true,
        zone: "West",
        type: "Private",
        available_ambulances: 2,
        ambulance_status: "On Call"
      }
    ]
  },
  "east delhi": {
    hospitals: [
      {
        name: "Guru Teg Bahadur Hospital (GTB Hospital) & UCMS",
        address: "Tahirpur Road, Dilshad Garden, Delhi 110095",
        latitude: 28.6841,
        longitude: 77.3094,
        distance_km: 2.3,
        emergency_phone: "011-2258-6262",
        ambulance_response_min: 8,
        specialization: ["Apex Level-1 Trauma Center (Trans-Yamuna)", "Emergency Neurosurgery", "Burns & Plastic Surgery", "Cardiovascular Emergencies"],
        emergency_available: true,
        has_ambulance: true,
        zone: "East",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Max Super Speciality Hospital, Patparganj",
        address: "108A, I.P. Extension, Patparganj, Delhi 110092",
        latitude: 28.6297,
        longitude: 77.3060,
        distance_km: 2.8,
        emergency_phone: "011-4303-3333",
        ambulance_response_min: 9,
        specialization: ["Advanced Emergency & Trauma", "STEMI Heart Attack Center", "Stroke Unit", "Critical Care & ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "East",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Lal Bahadur Shastri Hospital (LBS Hospital)",
        address: "Khichripur, Mayur Vihar Phase 2, Delhi 110091",
        latitude: 28.6186,
        longitude: 77.3175,
        distance_km: 3.2,
        emergency_phone: "011-2277-4145",
        ambulance_response_min: 11,
        specialization: ["24x7 Government Emergency", "General Surgery & Trauma", "Pediatric Resuscitation", "Obstetric Emergency"],
        emergency_available: true,
        has_ambulance: true,
        zone: "East",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Dharamshila Narayana Superspeciality Hospital",
        address: "Metro Station Road, Vasundhara Enclave, Delhi 110096",
        latitude: 28.6015,
        longitude: 77.3235,
        distance_km: 3.9,
        emergency_phone: "011-4306-6666",
        ambulance_response_min: 10,
        specialization: ["24x7 Emergency Medicine", "Cardiology & Cath Lab", "Oncologic Emergencies", "Critical Care & Pulmonology"],
        emergency_available: true,
        has_ambulance: true,
        zone: "East",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Immediate Dispatch"
      }
    ]
  },
  "north delhi": {
    hospitals: [
      {
        name: "Fortis Hospital, Shalimar Bagh",
        address: "AA Block, Poorbi Shalimar Bag, New Delhi 110088",
        latitude: 28.7088,
        longitude: 77.1648,
        distance_km: 2.5,
        emergency_phone: "011-4530-2222",
        ambulance_response_min: 8,
        specialization: ["Emergency & Trauma Medicine", "Interventional Cardiology", "Acute Stroke & Neuro ICU", "Trauma & Orthopedics"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Max Super Speciality Hospital, Shalimar Bagh",
        address: "C&D Block, Shalimar Place, Outer Ring Road, Delhi 110088",
        latitude: 28.7126,
        longitude: 77.1578,
        distance_km: 2.8,
        emergency_phone: "011-6642-2222",
        ambulance_response_min: 9,
        specialization: ["24/7 Level-1 Emergency", "Cardiology & STEMI Unit", "Comprehensive Stroke Program", "Critical Care & ICU"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Dr. Baba Saheb Ambedkar Hospital (BSA Hospital)",
        address: "Sector 6, Rohini, Delhi 110085",
        latitude: 28.7142,
        longitude: 77.1145,
        distance_km: 3.1,
        emergency_phone: "011-2705-5585",
        ambulance_response_min: 10,
        specialization: ["Govt. Apex Emergency & Trauma", "Orthopedics & Polytrauma", "ICU & Critical Care", "Pediatrics & Medicine"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Government",
        available_ambulances: 4,
        ambulance_status: "Active Standby"
      },
      {
        name: "Babu Jagjivan Ram Memorial Hospital (BJRM)",
        address: "E-Block, Jahangirpuri, Delhi 110033",
        latitude: 28.7291,
        longitude: 77.1689,
        distance_km: 3.7,
        emergency_phone: "011-2763-1810",
        ambulance_response_min: 11,
        specialization: ["24x7 Emergency Services", "General Surgery & Trauma", "Critical Care Resuscitation", "Pediatric Emergency"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      },
      {
        name: "Hindu Rao Hospital (MCD Premier Govt. Hospital)",
        address: "Near Subzi Mandi, Malka Ganj, Delhi 110007",
        latitude: 28.6738,
        longitude: 77.2089,
        distance_km: 4.1,
        emergency_phone: "011-2391-9476",
        ambulance_response_min: 12,
        specialization: ["Apex Municipal Emergency & Trauma", "Orthopedics", "General Surgery", "Cardiology Unit"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Government",
        available_ambulances: 3,
        ambulance_status: "On Call"
      },
      {
        name: "Sant Parmanand Hospital, Civil Lines",
        address: "18, Sham Nath Marg, Civil Lines, Delhi 110054",
        latitude: 28.6756,
        longitude: 77.2241,
        distance_km: 4.5,
        emergency_phone: "011-2399-4401",
        ambulance_response_min: 10,
        specialization: ["Emergency Trauma & Orthopedics", "Joint & Spine Surgery", "Cardiology", "Critical Care"],
        emergency_available: true,
        has_ambulance: true,
        zone: "North",
        type: "Private",
        available_ambulances: 3,
        ambulance_status: "Active Standby"
      }
    ]
  },
  "default": {
    hospitals: [
      {
        name: "AIIMS New Delhi (JPN Apex Trauma Center)",
        address: "Sri Aurobindo Marg, Ansari Nagar East, New Delhi 110029",
        latitude: 28.5672,
        longitude: 77.2100,
        distance_km: 4.5,
        emergency_phone: "011-2658-8500",
        ambulance_response_min: 7,
        specialization: ["Apex Level-1 Trauma", "Emergency Medicine", "Cardiothoracic Surgery", "Neurosurgery", "Toxicology & Critical Care"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Government",
        available_ambulances: 6,
        ambulance_status: "Active Standby"
      },
      {
        name: "Dr. Ram Manohar Lohia Hospital (RML Hospital)",
        address: "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
        latitude: 28.6251,
        longitude: 77.2016,
        distance_km: 5.0,
        emergency_phone: "011-2336-5525",
        ambulance_response_min: 8,
        specialization: ["Apex Trauma Center", "Emergency Medicine", "Cardiology & Cath Lab", "Intensive Care Unit"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Central",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Manipal Hospital Dwarka",
        address: "Palam Vihar Road, Sector 6, Dwarka, New Delhi 110075",
        latitude: 28.5832,
        longitude: 77.0682,
        distance_km: 6.2,
        emergency_phone: "011-4967-4967",
        ambulance_response_min: 6,
        specialization: ["Quaternary Emergency & Trauma", "STEMI Chest Pain Center", "Acute Stroke Resuscitation"],
        emergency_available: true,
        has_ambulance: true,
        zone: "Dwarka",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Max Super Speciality Hospital, Saket",
        address: "1, 2, Press Enclave Road, Mandir Marg, Saket, New Delhi 110017",
        latitude: 28.5273,
        longitude: 77.2119,
        distance_km: 7.1,
        emergency_phone: "011-4055-4055",
        ambulance_response_min: 9,
        specialization: ["Level-1 Emergency & Trauma", "STEMI Chest Pain Center", "Comprehensive Stroke Unit"],
        emergency_available: true,
        has_ambulance: true,
        zone: "South",
        type: "Private",
        available_ambulances: 4,
        ambulance_status: "Immediate Dispatch"
      },
      {
        name: "Guru Teg Bahadur Hospital (GTB Hospital)",
        address: "Tahirpur Road, Dilshad Garden, Delhi 110095",
        latitude: 28.6841,
        longitude: 77.3094,
        distance_km: 8.5,
        emergency_phone: "011-2258-6262",
        ambulance_response_min: 8,
        specialization: ["Apex Level-1 Trauma Center", "Emergency Neurosurgery", "Burns & Plastic Surgery"],
        emergency_available: true,
        has_ambulance: true,
        zone: "East",
        type: "Government",
        available_ambulances: 5,
        ambulance_status: "Active Standby"
      },
      {
        name: "Deen Dayal Upadhyay Hospital (DDU Hospital)",
        address: "Clock Tower, Hari Nagar, New Delhi 110064",
        latitude: 28.6277,
        longitude: 77.1121,
        distance_km: 7.8,
        emergency_phone: "011-2549-4402",
        ambulance_response_min: 9,
        specialization: ["Level-1 Govt. Trauma & Emergency", "Orthopedics & Fractures", "General Surgery"],
        emergency_available: true,
        has_ambulance: true,
        zone: "West",
        type: "Government",
        available_ambulances: 4,
        ambulance_status: "Active Standby"
      }
    ]
  }
};

/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Common landmark coordinates across all Delhi zones for easy lookup & simulation
 */
export const PRESET_LOCATIONS: {
  [key: string]: {
    name: string;
    lat: number;
    lon: number;
    regionKey: string;
    zone: DelhiZone;
  };
} = {
  "dwarka": { name: "Dwarka (Sector 8)", lat: 28.5921, lon: 77.0460, regionKey: "dwarka, delhi", zone: "Dwarka" },
  "connaught_place": { name: "Connaught Place (Central)", lat: 28.6328, lon: 77.2197, regionKey: "central delhi", zone: "Central" },
  "hauz_khas": { name: "South Delhi (Hauz Khas)", lat: 28.5494, lon: 77.2065, regionKey: "south delhi", zone: "South" },
  "saket": { name: "South Delhi (Saket)", lat: 28.5244, lon: 77.2100, regionKey: "south delhi", zone: "South" },
  "janakpuri": { name: "West Delhi (Janakpuri)", lat: 28.6219, lon: 77.0878, regionKey: "west delhi", zone: "West" },
  "mayur_vihar": { name: "East Delhi (Mayur Vihar)", lat: 28.6015, lon: 77.3015, regionKey: "east delhi", zone: "East" },
  "dilshad_garden": { name: "East Delhi (Dilshad Garden)", lat: 28.6841, lon: 77.3094, regionKey: "east delhi", zone: "East" },
  "model_town": { name: "North Delhi (Model Town)", lat: 28.7020, lon: 77.1930, regionKey: "north delhi", zone: "North" },
  "rohini": { name: "North Delhi (Rohini Sector 6)", lat: 28.7142, lon: 77.1145, regionKey: "north delhi", zone: "North" },
};

/**
 * Finds nearest hospitals using exact Haversine calculation or region fallback
 */
export function findNearestHospitals(
  latitude?: number | null,
  longitude?: number | null,
  locationName: string = "Dwarka, Delhi",
  limit: number = 3
): (Hospital & { calculated_distance_km: number })[] {
  let hospitalPool: Hospital[] = [];

  if (latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined) {
    // GPS coordinates provided: pool all unique hospitals across all zones
    const seenNames = new Set<string>();
    for (const key of Object.keys(UPLOADED_HOSPITALS_DATA)) {
      if (key !== "default") {
        for (const hosp of UPLOADED_HOSPITALS_DATA[key].hospitals) {
          if (!seenNames.has(hosp.name)) {
            seenNames.add(hosp.name);
            hospitalPool.push(hosp);
          }
        }
      }
    }

    const calculated = hospitalPool.map((h) => {
      const dist = calculateHaversineDistance(latitude, longitude, h.latitude, h.longitude);
      return {
        ...h,
        distance_km: dist,
        calculated_distance_km: dist,
      };
    });

    return calculated
      .filter((h) => h.emergency_available)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, limit);
  }

  // Fallback to location string matching
  const normalized = (locationName || "").toLowerCase().trim();
  let matchedRegion = "";

  for (const key of Object.keys(UPLOADED_HOSPITALS_DATA)) {
    if (key !== "default" && (normalized.includes(key) || key.includes(normalized))) {
      matchedRegion = key;
      break;
    }
  }

  if (!matchedRegion) {
    if (
      normalized.includes("south") ||
      normalized.includes("saket") ||
      normalized.includes("hauz") ||
      normalized.includes("vasant") ||
      normalized.includes("aiims") ||
      normalized.includes("safdarjung") ||
      normalized.includes("okhla") ||
      normalized.includes("sarita vihar")
    ) {
      matchedRegion = "south delhi";
    } else if (
      normalized.includes("dwarka") ||
      normalized.includes("palam") ||
      normalized.includes("matiala")
    ) {
      matchedRegion = "dwarka, delhi";
    } else if (
      normalized.includes("central") ||
      normalized.includes("cp") ||
      normalized.includes("connaught") ||
      normalized.includes("rajendra") ||
      normalized.includes("karol") ||
      normalized.includes("rml") ||
      normalized.includes("lnjp")
    ) {
      matchedRegion = "central delhi";
    } else if (
      normalized.includes("north") ||
      normalized.includes("rohini") ||
      normalized.includes("model town") ||
      normalized.includes("shalimar") ||
      normalized.includes("civil lines") ||
      normalized.includes("jahangirpuri")
    ) {
      matchedRegion = "north delhi";
    } else if (
      normalized.includes("west") ||
      normalized.includes("janakpuri") ||
      normalized.includes("hari nagar") ||
      normalized.includes("tilak") ||
      normalized.includes("punjabi bagh") ||
      normalized.includes("kirti") ||
      normalized.includes("ddu")
    ) {
      matchedRegion = "west delhi";
    } else if (
      normalized.includes("east") ||
      normalized.includes("mayur") ||
      normalized.includes("patparganj") ||
      normalized.includes("dilshad") ||
      normalized.includes("laxmi") ||
      normalized.includes("gtb") ||
      normalized.includes("shastri")
    ) {
      matchedRegion = "east delhi";
    } else {
      matchedRegion = "default";
    }
  }

  const regionData = UPLOADED_HOSPITALS_DATA[matchedRegion] || UPLOADED_HOSPITALS_DATA["default"];
  const list = regionData.hospitals.map((h) => ({
    ...h,
    calculated_distance_km: h.distance_km,
  }));

  return list
    .filter((h) => h.emergency_available)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}
