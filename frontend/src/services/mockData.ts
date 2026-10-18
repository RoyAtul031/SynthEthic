import { DatasetItem, DatasetPreview, EvaluationReport, TwinDataPayload, ComplianceCertificate } from '../types';

export const MOCK_DATASETS: DatasetItem[] = [
  {
    id: "healthcare_hipaa",
    name: "Healthcare Clinical EHR (HIPAA)",
    description: "Patient vitals, ICD-10 diagnoses, and 30-day readmissions. Direct PII: Patient_MRN.",
    domain: "Healthcare & Life Sciences",
    compliance: "HIPAA Safe Harbor & GDPR Art. 9",
    row_count: 500,
    column_count: 9,
    columns: ["Patient_MRN", "Age", "Gender", "Systolic_BP", "Cholesterol", "Glucose_Level", "Diagnosis_ICD", "Treatment_Category", "Readmitted_30D"],
    is_benchmark: true
  },
  {
    id: "fintech_fraud",
    name: "FinTech Transaction Ledger",
    description: "Credit card fraud, merchant categories, foreign transaction flags, and risk scores.",
    domain: "Banking & FinTech",
    compliance: "PCI-DSS & GLBA",
    row_count: 500,
    column_count: 7,
    columns: ["Transaction_ID", "Account_Age_Months", "Transaction_Amount", "Merchant_Category", "Foreign_Tx", "Risk_Score", "Fraud_Flag"],
    is_benchmark: true
  },
  {
    id: "saas_churn",
    name: "SaaS Subscription Analytics",
    description: "Customer activity, contract types, monthly billing, and churn rates.",
    domain: "Enterprise Software",
    compliance: "GDPR Art. 25 & CCPA",
    row_count: 500,
    column_count: 7,
    columns: ["Customer_ID", "Tenure_Months", "Contract_Type", "Monthly_Charges", "Cloud_Storage_GB", "Support_Tickets", "Churn"],
    is_benchmark: true
  }
];

export const MOCK_PREVIEWS: Record<string, DatasetPreview> = {
  healthcare_hipaa: {
    dataset_id: "healthcare_hipaa",
    total_rows: 500,
    total_columns: 9,
    schema: [
      { name: "Patient_MRN", dtype: "object", sample_value: "MRN-100000", unique_values: 500, has_nulls: false },
      { name: "Age", dtype: "int64", sample_value: "56", unique_values: 67, has_nulls: false },
      { name: "Gender", dtype: "object", sample_value: "Female", unique_values: 3, has_nulls: false },
      { name: "Systolic_BP", dtype: "float64", sample_value: "128.4", unique_values: 382, has_nulls: false },
      { name: "Cholesterol", dtype: "float64", sample_value: "185.2", unique_values: 395, has_nulls: false },
      { name: "Glucose_Level", dtype: "float64", sample_value: "96.1", unique_values: 360, has_nulls: false },
      { name: "Diagnosis_ICD", dtype: "object", sample_value: "Hypertension", unique_values: 5, has_nulls: false },
      { name: "Treatment_Category", dtype: "object", sample_value: "ACE-Inhibitor", unique_values: 5, has_nulls: false },
      { name: "Readmitted_30D", dtype: "int64", sample_value: "0", unique_values: 2, has_nulls: false }
    ],
    preview: [
      { Patient_MRN: "MRN-100001", Age: 62, Gender: "Male", Systolic_BP: 134.2, Cholesterol: 198.5, Glucose_Level: 104.2, Diagnosis_ICD: "Hypertension", Treatment_Category: "ACE-Inhibitor", Readmitted_30D: 0 },
      { Patient_MRN: "MRN-100002", Age: 45, Gender: "Female", Systolic_BP: 118.0, Cholesterol: 165.1, Glucose_Level: 88.4, Diagnosis_ICD: "Asthma", Treatment_Category: "Inhaler-Corticosteroid", Readmitted_30D: 0 },
      { Patient_MRN: "MRN-100003", Age: 71, Gender: "Male", Systolic_BP: 142.5, Cholesterol: 220.0, Glucose_Level: 145.0, Diagnosis_ICD: "Type-2-Diabetes", Treatment_Category: "Metformin", Readmitted_30D: 1 },
      { Patient_MRN: "MRN-100004", Age: 39, Gender: "Female", Systolic_BP: 112.4, Cholesterol: 154.2, Glucose_Level: 91.0, Diagnosis_ICD: "Osteoarthritis", Treatment_Category: "NSAID", Readmitted_30D: 0 }
    ]
  },
  fintech_fraud: {
    dataset_id: "fintech_fraud",
    total_rows: 500,
    total_columns: 7,
    schema: [
      { name: "Transaction_ID", dtype: "object", sample_value: "TX-200001", unique_values: 500, has_nulls: false },
      { name: "Account_Age_Months", dtype: "int64", sample_value: "24", unique_values: 110, has_nulls: false },
      { name: "Transaction_Amount", dtype: "float64", sample_value: "142.50", unique_values: 440, has_nulls: false },
      { name: "Merchant_Category", dtype: "object", sample_value: "Retail", unique_values: 5, has_nulls: false },
      { name: "Foreign_Tx", dtype: "object", sample_value: "No", unique_values: 2, has_nulls: false },
      { name: "Risk_Score", dtype: "float64", sample_value: "14.2", unique_values: 280, has_nulls: false },
      { name: "Fraud_Flag", dtype: "int64", sample_value: "0", unique_values: 2, has_nulls: false }
    ],
    preview: [
      { Transaction_ID: "TX-200001", Account_Age_Months: 36, Transaction_Amount: 48.20, Merchant_Category: "Retail", Foreign_Tx: "No", Risk_Score: 8.5, Fraud_Flag: 0 },
      { Transaction_ID: "TX-200002", Account_Age_Months: 4, Transaction_Amount: 1420.00, Merchant_Category: "Crypto", Foreign_Tx: "Yes", Risk_Score: 88.2, Fraud_Flag: 1 },
      { Transaction_ID: "TX-200003", Account_Age_Months: 72, Transaction_Amount: 84.10, Merchant_Category: "Travel", Foreign_Tx: "No", Risk_Score: 12.0, Fraud_Flag: 0 }
    ]
  },
  saas_churn: {
    dataset_id: "saas_churn",
    total_rows: 500,
    total_columns: 7,
    schema: [
      { name: "Customer_ID", dtype: "object", sample_value: "CUST-300001", unique_values: 500, has_nulls: false },
      { name: "Tenure_Months", dtype: "int64", sample_value: "18", unique_values: 48, has_nulls: false },
      { name: "Contract_Type", dtype: "object", sample_value: "Month-to-Month", unique_values: 3, has_nulls: false },
      { name: "Monthly_Charges", dtype: "float64", sample_value: "64.50", unique_values: 390, has_nulls: false },
      { name: "Cloud_Storage_GB", dtype: "int64", sample_value: "128", unique_values: 250, has_nulls: false },
      { name: "Support_Tickets", dtype: "int64", sample_value: "2", unique_values: 7, has_nulls: false },
      { name: "Churn", dtype: "int64", sample_value: "0", unique_values: 2, has_nulls: false }
    ],
    preview: [
      { Customer_ID: "CUST-300001", Tenure_Months: 14, Contract_Type: "Month-to-Month", Monthly_Charges: 59.20, Cloud_Storage_GB: 120, Support_Tickets: 3, Churn: 1 },
      { Customer_ID: "CUST-300002", Tenure_Months: 32, Contract_Type: "Two-Year", Monthly_Charges: 89.00, Cloud_Storage_GB: 340, Support_Tickets: 0, Churn: 0 },
      { Customer_ID: "CUST-300003", Tenure_Months: 6, Contract_Type: "Month-to-Month", Monthly_Charges: 45.00, Cloud_Storage_GB: 50, Support_Tickets: 4, Churn: 1 }
    ]
  }
};

export function generateMockTwinData(datasetId: string, epsilon: number, count = 100): { eval: EvaluationReport, twin: TwinDataPayload } {
  const isHealthcare = datasetId.includes('health');
  const isFintech = datasetId.includes('fintech');
  
  let columns: string[];
  let realSample: Record<string, any>[] = [];
  let syntheticSample: Record<string, any>[] = [];

  if (isHealthcare) {
    columns = ["Patient_MRN", "Age", "Gender", "Systolic_BP", "Cholesterol", "Glucose_Level", "Diagnosis_ICD", "Treatment_Category", "Readmitted_30D"];
    const diagnoses = ["Hypertension", "Type-2-Diabetes", "Cardiomyopathy", "Asthma", "Osteoarthritis"];
    const treatments = ["ACE-Inhibitor", "Metformin", "Beta-Blocker", "Inhaler-Corticosteroid", "NSAID"];
    
    for (let i = 0; i < count; i++) {
      const age = Math.floor(22 + Math.random() * 58);
      const sbp = Math.round((105 + (age * 0.4) + (Math.random() * 20 - 10)) * 10) / 10;
      const chol = Math.round((160 + (age * 0.45) + (Math.random() * 25 - 12)) * 10) / 10;
      const glucose = Math.round((85 + (age * 0.25) + (Math.random() * 18 - 9)) * 10) / 10;
      const diag = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const treat = treatments[Math.floor(Math.random() * treatments.length)];
      const readmit = Math.random() > 0.75 ? 1 : 0;

      realSample.push({
        Patient_MRN: `MRN-${100000 + i}`,
        Age: age,
        Gender: i % 2 === 0 ? "Male" : "Female",
        Systolic_BP: sbp,
        Cholesterol: chol,
        Glucose_Level: glucose,
        Diagnosis_ICD: diag,
        Treatment_Category: treat,
        Readmitted_30D: readmit
      });

      syntheticSample.push({
        Patient_MRN: `SYN_${Math.floor(100000 + Math.random() * 899999)}`,
        Age: Math.floor(20 + Math.random() * 62),
        Gender: Math.random() > 0.48 ? "Female" : "Male",
        Systolic_BP: Math.round((106 + (age * 0.38) + (Math.random() * 18 - 9)) * 10) / 10,
        Cholesterol: Math.round((162 + (age * 0.44) + (Math.random() * 22 - 11)) * 10) / 10,
        Glucose_Level: Math.round((86 + (age * 0.24) + (Math.random() * 16 - 8)) * 10) / 10,
        Diagnosis_ICD: diagnoses[Math.floor(Math.random() * diagnoses.length)],
        Treatment_Category: treatments[Math.floor(Math.random() * treatments.length)],
        Readmitted_30D: Math.random() > 0.72 ? 1 : 0
      });
    }
  } else if (isFintech) {
    columns = ["Transaction_ID", "Account_Age_Months", "Transaction_Amount", "Merchant_Category", "Foreign_Tx", "Risk_Score", "Fraud_Flag"];
    const categories = ["Retail", "Travel", "Crypto", "Gambling", "Electronics"];
    for (let i = 0; i < count; i++) {
      const amt = Math.round((Math.random() * 350 + 10) * 100) / 100;
      realSample.push({
        Transaction_ID: `TX-${200000 + i}`,
        Account_Age_Months: Math.floor(1 + Math.random() * 90),
        Transaction_Amount: amt,
        Merchant_Category: categories[i % categories.length],
        Foreign_Tx: i % 5 === 0 ? "Yes" : "No",
        Risk_Score: Math.round(Math.random() * 60 * 10) / 10,
        Fraud_Flag: i % 15 === 0 ? 1 : 0
      });
      syntheticSample.push({
        Transaction_ID: `SYN_${Math.floor(100000 + Math.random() * 899999)}`,
        Account_Age_Months: Math.floor(1 + Math.random() * 95),
        Transaction_Amount: Math.round((Math.random() * 340 + 12) * 100) / 100,
        Merchant_Category: categories[Math.floor(Math.random() * categories.length)],
        Foreign_Tx: Math.random() > 0.82 ? "Yes" : "No",
        Risk_Score: Math.round(Math.random() * 58 * 10) / 10,
        Fraud_Flag: Math.random() > 0.92 ? 1 : 0
      });
    }
  } else {
    columns = ["Customer_ID", "Tenure_Months", "Contract_Type", "Monthly_Charges", "Cloud_Storage_GB", "Support_Tickets", "Churn"];
    const contracts = ["Month-to-Month", "One-Year", "Two-Year"];
    for (let i = 0; i < count; i++) {
      realSample.push({
        Customer_ID: `CUST-${300000 + i}`,
        Tenure_Months: Math.floor(1 + Math.random() * 45),
        Contract_Type: contracts[i % contracts.length],
        Monthly_Charges: Math.round((30 + Math.random() * 80) * 100) / 100,
        Cloud_Storage_GB: Math.floor(20 + Math.random() * 400),
        Support_Tickets: Math.floor(Math.random() * 5),
        Churn: i % 4 === 0 ? 1 : 0
      });
      syntheticSample.push({
        Customer_ID: `SYN_${Math.floor(100000 + Math.random() * 899999)}`,
        Tenure_Months: Math.floor(1 + Math.random() * 48),
        Contract_Type: contracts[Math.floor(Math.random() * contracts.length)],
        Monthly_Charges: Math.round((29 + Math.random() * 82) * 100) / 100,
        Cloud_Storage_GB: Math.floor(15 + Math.random() * 420),
        Support_Tickets: Math.floor(Math.random() * 5),
        Churn: Math.random() > 0.76 ? 1 : 0
      });
    }
  }

  const evalReport: EvaluationReport = {
    overall_utility_score: parseFloat((88.5 + (epsilon * 2.1)).toFixed(1)),
    overall_privacy_score: parseFloat((99.5 - (epsilon * 2.4)).toFixed(1)),
    utility_details: {
      overall_score: parseFloat((88.5 + (epsilon * 2.1)).toFixed(1)),
      mean_wasserstein_distance: 0.078,
      mean_total_variation_distance: 0.065,
      correlation_preservation_score: 94.2,
      columns: {
        [columns[1]]: { type: "continuous", metric_name: "Wasserstein Distance", raw_distance: 0.064, fidelity_score: 93.6 },
        [columns[2]]: { type: "categorical", metric_name: "Total Variation Distance", raw_distance: 0.052, fidelity_score: 94.8 },
        [columns[3]]: { type: "continuous", metric_name: "Wasserstein Distance", raw_distance: 0.079, fidelity_score: 92.1 }
      }
    },
    privacy_details: {
      overall_score: parseFloat((99.5 - (epsilon * 2.4)).toFixed(1)),
      dcr_5th_percentile: 0.284,
      dcr_median: 0.432,
      nearest_neighbor_ratio: 0.892,
      mia_resilience: 96.5,
      pii_retention_risk: 0.0,
      epsilon_budget: epsilon,
      delta_budget: 1e-5,
      dcr_histogram: [
        { bin: "0.15-0.25", synthetic_to_real: 12, safe_threshold: "PASS" },
        { bin: "0.25-0.35", synthetic_to_real: 48, safe_threshold: "PASS" },
        { bin: "0.35-0.45", synthetic_to_real: 95, safe_threshold: "PASS" },
        { bin: "0.45-0.55", synthetic_to_real: 74, safe_threshold: "PASS" },
        { bin: "0.55-0.65", synthetic_to_real: 26, safe_threshold: "PASS" }
      ]
    },
    feature_distributions: [
      {
        column: columns[1],
        type: "continuous",
        data: [
          { category: "Low", Real: 42, Synthetic: 45 },
          { category: "Mid-Low", Real: 78, Synthetic: 74 },
          { category: "Mid-High", Real: 95, Synthetic: 92 },
          { category: "High", Real: 35, Synthetic: 39 }
        ]
      },
      {
        column: columns[2],
        type: "categorical",
        data: [
          { category: "Class A", Real: 48, Synthetic: 49 },
          { category: "Class B", Real: 52, Synthetic: 51 }
        ]
      }
    ],
    correlation_matrix: {
      features: columns.slice(1, 4),
      real: { [columns[1]]: { [columns[1]]: 1, [columns[3]]: 0.42 }, [columns[3]]: { [columns[1]]: 0.42, [columns[3]]: 1 } },
      synthetic: { [columns[1]]: { [columns[1]]: 1, [columns[3]]: 0.40 }, [columns[3]]: { [columns[1]]: 0.40, [columns[3]]: 1 } }
    },
    compliance_status: {
      gdpr_article_25: true,
      hipaa_safe_harbor: true,
      differential_privacy_guarantee: `(${epsilon}, 1e-05)-DP`,
      zero_pii_retention: true
    }
  };

  const twinPayload: TwinDataPayload = {
    job_id: `job-${Date.now().toString(16).slice(-8)}`,
    page: 1,
    page_size: 15,
    total_records: count,
    columns: columns,
    real_sample: realSample.slice(0, 15),
    synthetic_sample: syntheticSample.slice(0, 15)
  };

  return { eval: evalReport, twin: twinPayload };
}
