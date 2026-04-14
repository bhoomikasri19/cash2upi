

const ALL_USERS = [
  { id: 'u1', name: 'Rahul Sharma', avatar: 'RS', avatarClass: 'av-blue', cash_available: 800, trust_score: 94, rating: 4.9, total_transactions: 87, distance_m: 120, city: 'Andheri West', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001001' },
  { id: 'u2', name: 'Priya Mehta', avatar: 'PM', avatarClass: 'av-green', cash_available: 500, trust_score: 81, rating: 4.6, total_transactions: 34, distance_m: 230, city: 'Bandra', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001002' },
  { id: 'u3', name: 'Amit Patel', avatar: 'AP', avatarClass: 'av-purple', cash_available: 1000, trust_score: 97, rating: 5.0, total_transactions: 142, distance_m: 350, city: 'Dadar', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001003' },
  { id: 'u4', name: 'Sneha Joshi', avatar: 'SJ', avatarClass: 'av-orange', cash_available: 300, trust_score: 63, rating: 4.2, total_transactions: 11, distance_m: 480, city: 'Kurla', verified: false, online: true, badge: 'badge-yellow', trust_label: 'New User', phone: '9820001004' },
  { id: 'u5', name: 'Vikram Singh', avatar: 'VS', avatarClass: 'av-blue', cash_available: 700, trust_score: 88, rating: 4.7, total_transactions: 56, distance_m: 210, city: 'Juhu', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001005' },
  { id: 'u6', name: 'Anjali Desai', avatar: 'AD', avatarClass: 'av-green', cash_available: 400, trust_score: 76, rating: 4.4, total_transactions: 23, distance_m: 670, city: 'Malad', verified: true, online: true, badge: 'badge-blue', trust_label: 'Trusted', phone: '9820001006' },
  { id: 'u7', name: 'Rohan Verma', avatar: 'RV', avatarClass: 'av-purple', cash_available: 600, trust_score: 91, rating: 4.8, total_transactions: 78, distance_m: 390, city: 'Goregaon', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001007' },
  { id: 'u8', name: 'Meera Nair', avatar: 'MN', avatarClass: 'av-orange', cash_available: 250, trust_score: 58, rating: 4.0, total_transactions: 7, distance_m: 540, city: 'Borivali', verified: false, online: true, badge: 'badge-yellow', trust_label: 'New User', phone: '9820001008' },
  { id: 'u9', name: 'Karan Malhotra', avatar: 'KM', avatarClass: 'av-blue', cash_available: 900, trust_score: 89, rating: 4.7, total_transactions: 62, distance_m: 180, city: 'Powai', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001009' },
  { id: 'u10', name: 'Divya Krishnan', avatar: 'DK', avatarClass: 'av-green', cash_available: 350, trust_score: 72, rating: 4.3, total_transactions: 18, distance_m: 820, city: 'Thane', verified: true, online: true, badge: 'badge-blue', trust_label: 'Trusted', phone: '9820001010' },
  { id: 'u11', name: 'Siddharth Rao', avatar: 'SR', avatarClass: 'av-purple', cash_available: 750, trust_score: 93, rating: 4.9, total_transactions: 104, distance_m: 95, city: 'Santacruz', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001011' },
  { id: 'u12', name: 'Pooja Gupta', avatar: 'PG', avatarClass: 'av-orange', cash_available: 450, trust_score: 84, rating: 4.5, total_transactions: 41, distance_m: 310, city: 'Vile Parle', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001012' },
  { id: 'u13', name: 'Arjun Kapoor', avatar: 'AK', avatarClass: 'av-blue', cash_available: 550, trust_score: 79, rating: 4.4, total_transactions: 29, distance_m: 440, city: 'Chembur', verified: true, online: true, badge: 'badge-blue', trust_label: 'Trusted', phone: '9820001013' },
  { id: 'u14', name: 'Tanvi Shah', avatar: 'TS', avatarClass: 'av-green', cash_available: 200, trust_score: 55, rating: 3.9, total_transactions: 5, distance_m: 710, city: 'Kandivali', verified: false, online: true, badge: 'badge-yellow', trust_label: 'New User', phone: '9820001014' },
  { id: 'u15', name: 'Dev Khanna', avatar: 'DH', avatarClass: 'av-purple', cash_available: 650, trust_score: 92, rating: 4.8, total_transactions: 95, distance_m: 160, city: 'Andheri East', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001015' },
  { id: 'u16', name: 'Ishaan Bose', avatar: 'IB', avatarClass: 'av-orange', cash_available: 300, trust_score: 67, rating: 4.1, total_transactions: 14, distance_m: 590, city: 'Mulund', verified: false, online: true, badge: 'badge-yellow', trust_label: 'New User', phone: '9820001016' },
  { id: 'u17', name: 'Kavya Reddy', avatar: 'KR', avatarClass: 'av-blue', cash_available: 850, trust_score: 87, rating: 4.6, total_transactions: 53, distance_m: 270, city: 'Ghatkopar', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001017' },
  { id: 'u18', name: 'Nikhil Jain', avatar: 'NJ', avatarClass: 'av-green', cash_available: 1000, trust_score: 96, rating: 4.9, total_transactions: 118, distance_m: 145, city: 'Worli', verified: true, online: true, badge: 'badge-green', trust_label: 'Highly Trusted', phone: '9820001018' },
  { id: 'u19', name: 'Riya Agarwal', avatar: 'RA', avatarClass: 'av-purple', cash_available: 400, trust_score: 74, rating: 4.3, total_transactions: 21, distance_m: 760, city: 'Vikhroli', verified: true, online: true, badge: 'badge-blue', trust_label: 'Trusted', phone: '9820001019' },
  { id: 'u20', name: 'Manav Tiwari', avatar: 'MT', avatarClass: 'av-orange', cash_available: 500, trust_score: 82, rating: 4.5, total_transactions: 38, distance_m: 320, city: 'Khar', verified: true, online: true, badge: 'badge-green', trust_label: 'Trusted', phone: '9820001020' },
]

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Randomise distances slightly on each call so it feels live
function randomiseDistance(user) {
  const variance = Math.floor(Math.random() * 60) - 30  // ±30m
  return { ...user, distance_m: Math.max(50, user.distance_m + variance) }
}

// Pick 10 random users from the pool — different every call
export function getRandomUsers() {
  return shuffle(ALL_USERS).slice(0, 10).map(randomiseDistance)
}

export const DEMO_USERS = getRandomUsers()

export function getMatchedProviders(amount, emergencyMode = false) {
  const pool = getRandomUsers()
  const eligible = pool.filter(u => u.cash_available >= amount && u.online)
  if (emergencyMode) {
    return eligible.sort((a, b) =>
      (b.trust_score * 0.7 + (1000 - b.distance_m) * 0.3) -
      (a.trust_score * 0.7 + (1000 - a.distance_m) * 0.3)
    )
  }
  return eligible.sort((a, b) =>
    a.distance_m !== b.distance_m ? a.distance_m - b.distance_m : b.trust_score - a.trust_score
  )
}

export function formatDistance(meters) {
  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`
}

export function getCommission(amount = 200) {
  // ₹5 for amounts up to ₹200, ₹7 up to ₹500, ₹10 for above
  if (amount <= 200) return 5
  if (amount <= 500) return 7
  return 10
}
