import random

# This is our fake database for the demo
# In real app this would be a proper database like PostgreSQL

USERS = [
    {
        "id": "u1",
        "name": "Rahul Sharma",
        "phone": "98201****1",
        "lat": 19.0760,
        "lng": 72.8777,
        "role": "provider",
        "cash_available": 800,
        "trust_score": 92,
        "rating": 4.8,
        "total_transactions": 34,
        "distance_km": 0.3,
        "avatar": "RS"
    },
    {
        "id": "u2",
        "name": "Priya Mehta",
        "phone": "91234****2",
        "lat": 19.0775,
        "lng": 72.8790,
        "role": "provider",
        "cash_available": 500,
        "trust_score": 78,
        "rating": 4.5,
        "total_transactions": 18,
        "distance_km": 0.5,
        "avatar": "PM"
    },
    {
        "id": "u3",
        "name": "Amit Patel",
        "phone": "99876****3",
        "lat": 19.0748,
        "lng": 72.8760,
        "role": "provider",
        "cash_available": 1000,
        "trust_score": 95,
        "rating": 5.0,
        "total_transactions": 67,
        "distance_km": 0.8,
        "avatar": "AP"
    },
    {
        "id": "u4",
        "name": "Sneha Joshi",
        "phone": "87654****4",
        "lat": 19.0790,
        "lng": 72.8800,
        "role": "provider",
        "cash_available": 300,
        "trust_score": 61,
        "rating": 4.1,
        "total_transactions": 8,
        "distance_km": 1.2,
        "avatar": "SJ"
    },
]

# Active transactions stored in memory for demo
TRANSACTIONS = {}

def get_providers_near(amount: int):
    """Return providers who have enough cash for the requested amount"""
    return [u for u in USERS if u["role"] == "provider" and u["cash_available"] >= amount]

def get_trust_label(score: int):
    """Convert trust score number to a human readable label"""
    if score >= 90:
        return "Highly Trusted"
    elif score >= 70:
        return "Trusted"
    elif score >= 50:
        return "Moderate"
    else:
        return "New User"

def get_max_limit(trust_score: int):
    """Trust score determines how much cash a user can request"""
    if trust_score >= 90:
        return 1000
    elif trust_score >= 70:
        return 500
    else:
        return 200
