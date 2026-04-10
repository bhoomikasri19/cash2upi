from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from data.fake_users import get_providers_near, get_trust_label, get_max_limit, TRANSACTIONS, USERS
import random
import string
import time

router = APIRouter()

# --- Request Models ---
# These define what data the frontend must send

class MatchRequest(BaseModel):
    amount: int
    seeker_name: str
    seeker_phone: str

class AcceptRequest(BaseModel):
    transaction_id: str
    provider_id: str

class ConfirmRequest(BaseModel):
    transaction_id: str
    otp: str

class RatingRequest(BaseModel):
    transaction_id: str
    rating: float


# --- Helper ---
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


# --- Routes ---

@router.get("/providers")
def get_nearby_providers(amount: int):
    """
    Frontend calls this to get nearby cash providers.
    Filters by amount — only show providers who have enough cash.
    Also validates the amount limit (max ₹1000).
    """
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")
    if amount > 1000:
        raise HTTPException(status_code=400, detail="Maximum cash request is ₹1000 per transaction")

    providers = get_providers_near(amount)

    # Add trust label to each provider before sending to frontend
    for p in providers:
        p["trust_label"] = get_trust_label(p["trust_score"])

    return {"providers": providers, "count": len(providers)}


@router.post("/request")
def request_match(data: MatchRequest):
    """
    Seeker sends amount + their info.
    We create a transaction record and return it.
    """
    if data.amount > 1000:
        raise HTTPException(status_code=400, detail="Maximum limit is ₹1000")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    providers = get_providers_near(data.amount)
    if not providers:
        raise HTTPException(status_code=404, detail="No providers available nearby right now")

    # Create transaction
    txn_id = "TXN" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    TRANSACTIONS[txn_id] = {
        "id": txn_id,
        "seeker_name": data.seeker_name,
        "seeker_phone": data.seeker_phone,
        "amount": data.amount,
        "status": "pending",  # pending → accepted → confirmed → complete
        "otp": None,
        "provider_id": None,
        "created_at": time.time()
    }

    return {"transaction_id": txn_id, "message": "Request sent to nearby providers"}


@router.post("/accept")
def accept_request(data: AcceptRequest):
    """
    Provider accepts a cash request.
    We generate OTP and attach it to the transaction.
    OTP must be shown to seeker — they verify it when receiving cash.
    """
    txn = TRANSACTIONS.get(data.transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if txn["status"] != "pending":
        raise HTTPException(status_code=400, detail="Transaction already accepted")

    otp = generate_otp()
    TRANSACTIONS[data.transaction_id]["otp"] = otp
    TRANSACTIONS[data.transaction_id]["status"] = "accepted"
    TRANSACTIONS[data.transaction_id]["provider_id"] = data.provider_id

    # Get provider details to return
    provider = next((u for u in USERS if u["id"] == data.provider_id), None)

    return {
        "otp": otp,
        "transaction_id": data.transaction_id,
        "provider": provider,
        "message": "Provider accepted! Share UPI and meet to exchange cash."
    }


@router.post("/confirm")
def confirm_transaction(data: ConfirmRequest):
    """
    After cash is handed over, seeker enters OTP to confirm.
    This marks transaction as complete.
    """
    txn = TRANSACTIONS.get(data.transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if txn["status"] != "accepted":
        raise HTTPException(status_code=400, detail="Transaction not in accepted state")
    if txn["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Wrong OTP. Cash not confirmed.")

    TRANSACTIONS[data.transaction_id]["status"] = "complete"

    return {
        "success": True,
        "message": "Transaction complete! Cash exchanged successfully.",
        "transaction_id": data.transaction_id,
        "amount": txn["amount"]
    }


@router.get("/status/{transaction_id}")
def get_transaction_status(transaction_id: str):
    txn = TRANSACTIONS.get(transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn


@router.post("/rate")
def rate_transaction(data: RatingRequest):
    txn = TRANSACTIONS.get(data.transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    TRANSACTIONS[data.transaction_id]["rating"] = data.rating
    return {"success": True, "message": "Rating submitted. Thank you!"}
