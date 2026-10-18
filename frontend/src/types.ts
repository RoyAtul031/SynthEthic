export interface User {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar?: string;
  token?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  domain: string;
  compliance: string;
  row_count: number;
  column_count: number;
  columns: string[];
  is_benchmark: boolean;
}

export interface DatasetPreview {
  dataset_id: string;
  total_rows: number;
  total_columns: number;
  schema: {
    name: string;
    dtype: string;
    sample_value: string;
    unique_values: number;
    has_nulls: boolean;
  }[];
  preview: Record<string, any>[];
}

export interface SynthesisConfig {
  dataset_id: string;
  epsilon: number;
  delta: number;
  epochs: number;
  batch_size: number;
  latent_dim: number;
  learning_rate: number;
  noise_mechanism: string;
  synthetic_sample_count?: number;
}

export interface TrainingMetricEntry {
  epoch: number;
  d_loss: number;
  g_loss: number;
  epsilon_spent: number;
  progress_percent: number;
}

export interface EvaluationReport {
  overall_utility_score: number;
  overall_privacy_score: number;
  utility_details: {
    overall_score: number;
    mean_wasserstein_distance: number;
    mean_total_variation_distance: number;
    correlation_preservation_score: number;
    columns: Record<string, {
      type: string;
      metric_name: string;
      raw_distance: number;
      fidelity_score: number;
    }>;
  };
  privacy_details: {
    overall_score: number;
    dcr_5th_percentile: number;
    dcr_median: number;
    nearest_neighbor_ratio: number;
    mia_resilience: number;
    pii_retention_risk: number;
    epsilon_budget: number;
    delta_budget: number;
    dcr_histogram: {
      bin: string;
      synthetic_to_real: number;
      safe_threshold: string;
    }[];
  };
  feature_distributions: {
    column: string;
    type: string;
    data: {
      category: string;
      Real: number;
      Synthetic: number;
    }[];
  }[];
  correlation_matrix: {
    features: string[];
    real: Record<string, Record<string, number>>;
    synthetic: Record<string, Record<string, number>>;
  };
  compliance_status: {
    gdpr_article_25: boolean;
    hipaa_safe_harbor: boolean;
    differential_privacy_guarantee: string;
    zero_pii_retention: boolean;
  };
}

export interface TwinDataPayload {
  job_id: string;
  page: number;
  page_size: number;
  total_records: number;
  columns: string[];
  real_sample: Record<string, any>[];
  synthetic_sample: Record<string, any>[];
}

export interface ComplianceCertificate {
  certificate_id: string;
  issuer: string;
  standard_version: string;
  job_id: string;
  evaluation_timestamp: string;
  differential_privacy: {
    epsilon: number;
    delta: number;
    mechanism: string;
    mathematical_guarantee: string;
  };
  empirical_privacy: {
    empirical_score: number;
    distance_to_closest_record_median: number;
    nearest_neighbor_distance_ratio: number;
    membership_inference_attack_resilience: string;
    pii_leakage_rate: string;
  };
  utility_benchmarks: {
    overall_utility_score: number;
    correlation_matrix_preservation: string;
    wasserstein_metric: number;
  };
  legal_certifications: {
    gdpr_article_25_data_protection_by_design: string;
    gdpr_recital_26_anonymized_data: string;
    hipaa_safe_harbor_18_identifiers: string;
    safe_for_ai_training_and_testing: boolean;
  };
}
