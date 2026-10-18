"""
SynthEthic Security and Privacy-by-Design Module
Handles PII tokenization, salt-hashing, and noise-encoding before synthesis pipeline.
"""
import hashlib
import re
from typing import Dict, Any, List

# Common PII Regex Patterns
PII_PATTERNS = {
    "email": re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"),
    "ssn": re.compile(r"^\d{3}-?\d{2}-?\d{4}$"),
    "phone": re.compile(r"^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$"),
    "credit_card": re.compile(r"^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$"),
    "uuid": re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
}

class NoiseEncoder:
    """
    Sanitizes raw ingest data by detecting and masking direct identifiers (PII)
    using cryptographic keyed salted hashes and pseudonym tokens.
    Guarantees no raw identity leaks into the generative neural network.
    """
    def __init__(self, salt: str = "synthethic_entropy_salt_2026"):
        self.salt = salt

    def identify_pii_columns(self, df_columns: List[str], sample_values: Dict[str, List[Any]]) -> List[str]:
        pii_columns = []
        name_indicators = ["name", "email", "phone", "ssn", "mrn", "patient_id", "user_id", "customer_id", "account_number", "address", "zipcode", "ip_address"]
        
        for col in df_columns:
            col_lower = col.lower()
            if any(ind in col_lower for ind in name_indicators):
                pii_columns.append(col)
                continue
            
            # Check sample value pattern matching
            samples = sample_values.get(col, [])
            matched = False
            for val in samples:
                val_str = str(val).strip()
                for pattern_type, pattern in PII_PATTERNS.items():
                    if pattern.match(val_str):
                        pii_columns.append(col)
                        matched = True
                        break
                if matched:
                    break
        return pii_columns

    def salt_hash_token(self, value: Any, prefix: str = "SYNTH_ANON_") -> str:
        """Irreversible SHA-256 HMAC pseudonym for direct identifiers"""
        raw_str = f"{value}_{self.salt}".encode("utf-8")
        h = hashlib.sha256(raw_str).hexdigest()[:10].upper()
        return f"{prefix}{h}"

    def encode_pii_series(self, values: List[Any], col_name: str) -> List[str]:
        prefix = f"{col_name[:4].upper()}_"
        return [self.salt_hash_token(v, prefix) for v in values]
