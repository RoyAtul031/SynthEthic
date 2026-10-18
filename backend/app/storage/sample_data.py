"""
SynthEthic Benchmark Datasets
Pre-loaded, domain-specific compliance datasets for instant testing and synthesis.
"""
import numpy as np
import pandas as pd

def generate_healthcare_dataset(n_rows: int = 1000) -> pd.DataFrame:
    """Simulates HIPAA Clinical Health Records (EHR)"""
    np.random.seed(42)
    ages = np.random.randint(18, 85, size=n_rows)
    genders = np.random.choice(["Male", "Female", "Non-Binary"], size=n_rows, p=[0.48, 0.49, 0.03])
    
    # Correlated clinical vitals
    systolic_bp = 100 + (ages * 0.4) + np.random.normal(0, 12, size=n_rows)
    cholesterol = 150 + (ages * 0.5) + np.random.normal(0, 20, size=n_rows)
    glucose = 85 + (ages * 0.3) + np.random.normal(0, 15, size=n_rows)

    diagnoses = np.random.choice(
        ["Hypertension", "Type-2-Diabetes", "Cardiomyopathy", "Asthma", "Osteoarthritis"],
        size=n_rows,
        p=[0.35, 0.25, 0.15, 0.15, 0.10]
    )
    treatments = np.random.choice(
        ["ACE-Inhibitor", "Metformin", "Beta-Blocker", "Inhaler-Corticosteroid", "NSAID"],
        size=n_rows
    )
    
    # Readmission risk correlated with BP and age
    risk_factor = (systolic_bp - 120) / 40.0 + (ages - 50) / 40.0
    readmitted_prob = 1.0 / (1.0 + np.exp(-risk_factor))
    readmitted = (np.random.rand(n_rows) < readmitted_prob).astype(int)

    return pd.DataFrame({
        "Patient_MRN": [f"MRN-{100000 + i}" for i in range(n_rows)],
        "Age": ages,
        "Gender": genders,
        "Systolic_BP": np.round(systolic_bp, 1),
        "Cholesterol": np.round(cholesterol, 1),
        "Glucose_Level": np.round(glucose, 1),
        "Diagnosis_ICD": diagnoses,
        "Treatment_Category": treatments,
        "Readmitted_30D": readmitted
    })

def generate_fintech_dataset(n_rows: int = 1000) -> pd.DataFrame:
    """Simulates FinTech Transaction Fraud Data (PCI-DSS & AML compliant test data)"""
    np.random.seed(1337)
    account_age = np.random.randint(1, 120, size=n_rows)
    tx_amounts = np.round(np.random.exponential(scale=120, size=n_rows) + 5, 2)
    categories = np.random.choice(["Retail", "Travel", "Crypto", "Gambling", "Electronics"], size=n_rows, p=[0.45, 0.2, 0.1, 0.05, 0.2])
    foreign = np.random.choice(["No", "Yes"], size=n_rows, p=[0.85, 0.15])
    
    # Fraud correlates with large amount, crypto/gambling, foreign
    fraud_prob = 0.02 + 0.15 * (categories == "Crypto") + 0.10 * (categories == "Gambling") + 0.08 * (foreign == "Yes")
    fraud_flag = (np.random.rand(n_rows) < fraud_prob).astype(int)
    risk_score = np.clip(np.round((fraud_prob * 100) + np.random.normal(0, 8, size=n_rows), 1), 0, 100)

    return pd.DataFrame({
        "Transaction_ID": [f"TX-{200000 + i}" for i in range(n_rows)],
        "Account_Age_Months": account_age,
        "Transaction_Amount": tx_amounts,
        "Merchant_Category": categories,
        "Foreign_Tx": foreign,
        "Risk_Score": risk_score,
        "Fraud_Flag": fraud_flag
    })

def generate_saas_dataset(n_rows: int = 1000) -> pd.DataFrame:
    """Simulates SaaS User Analytics (GDPR compliant telemetry)"""
    np.random.seed(99)
    tenure = np.random.randint(1, 48, size=n_rows)
    contracts = np.random.choice(["Month-to-Month", "One-Year", "Two-Year"], size=n_rows, p=[0.55, 0.30, 0.15])
    monthly_charges = np.round(29.0 + (tenure * 1.5) + np.random.normal(0, 10, size=n_rows), 2)
    storage_gb = np.random.randint(10, 500, size=n_rows)
    support_tickets = np.random.poisson(lam=1.5, size=n_rows)
    
    churn_prob = 0.35 * (contracts == "Month-to-Month") + 0.08 * (support_tickets > 3) - 0.005 * tenure
    churn_prob = np.clip(churn_prob, 0.02, 0.85)
    churn = (np.random.rand(n_rows) < churn_prob).astype(int)

    return pd.DataFrame({
        "Customer_ID": [f"CUST-{300000 + i}" for i in range(n_rows)],
        "Tenure_Months": tenure,
        "Contract_Type": contracts,
        "Monthly_Charges": monthly_charges,
        "Cloud_Storage_GB": storage_gb,
        "Support_Tickets": support_tickets,
        "Churn": churn
    })

AVAILABLE_BENCHMARKS = {
    "healthcare_hipaa": {
        "name": "Healthcare Clinical EHR (HIPAA)",
        "description": "Patient vitals, ICD-10 diagnoses, and 30-day readmissions. Direct PII: Patient_MRN.",
        "domain": "Healthcare & Life Sciences",
        "compliance": "HIPAA Safe Harbor & GDPR Art. 9",
        "generator": generate_healthcare_dataset
    },
    "fintech_fraud": {
        "name": "FinTech Transaction Ledger",
        "description": "Credit card fraud, merchant categories, foreign transaction flags, and risk scores.",
        "domain": "Banking & FinTech",
        "compliance": "PCI-DSS & GLBA",
        "generator": generate_fintech_dataset
    },
    "saas_churn": {
        "name": "SaaS Subscription Analytics",
        "description": "Customer activity, contract types, monthly billing, and churn rates.",
        "domain": "Enterprise Software",
        "compliance": "GDPR Art. 25 & CCPA",
        "generator": generate_saas_dataset
    }
}
