"""
SynthEthic End-to-End Synthesis Pipeline
Orchestrates Noise-Encoding -> Tabular DP-WGAN Training -> Synthetic Generation -> Privacy/Utility Evaluation.
"""
import time
import pandas as pd
from typing import Dict, Any, Optional, Callable
from app.core.security import NoiseEncoder
from app.engine.preprocessor import TabularPreprocessor
from app.engine.gan_model import TabularDPWGAN
from app.engine.evaluator import SyntheticEvaluator
from app.storage.store import store

class SynthesisPipeline:
    def __init__(
        self,
        job_id: str,
        real_df: pd.DataFrame,
        epsilon: float = 1.0,
        delta: float = 1e-5,
        epochs: int = 35,
        batch_size: int = 64,
        latent_dim: int = 32,
        learning_rate: float = 0.002,
        noise_mechanism: str = "gaussian",
        synthetic_sample_count: Optional[int] = None,
        progress_callback: Optional[Callable[[int, int, float, float, float], None]] = None
    ):
        self.job_id = job_id
        self.raw_df = real_df
        self.epsilon = epsilon
        self.delta = delta
        self.epochs = epochs
        self.batch_size = batch_size
        self.latent_dim = latent_dim
        self.learning_rate = learning_rate
        self.noise_mechanism = noise_mechanism
        self.n_samples = synthetic_sample_count or len(real_df)
        self.progress_callback = progress_callback

        self.noise_encoder = NoiseEncoder()
        self.preprocessor = None
        self.model = None

    def execute(self) -> Dict[str, Any]:
        start_time = time.time()

        # Step 1: Detect and Noise-Encode direct PII identifiers
        sample_dict = {col: self.raw_df[col].head(20).tolist() for col in self.raw_df.columns}
        pii_cols = self.noise_encoder.identify_pii_columns(list(self.raw_df.columns), sample_dict)
        
        sanitized_real_df = self.raw_df.copy()
        for pii_col in pii_cols:
            sanitized_real_df[pii_col] = self.noise_encoder.encode_pii_series(
                self.raw_df[pii_col].tolist(), pii_col
            )

        # Step 2: Fit Tabular Preprocessor
        self.preprocessor = TabularPreprocessor(pii_columns=pii_cols)
        self.preprocessor.fit(sanitized_real_df)
        feature_matrix = self.preprocessor.transform(sanitized_real_df)

        # Step 3: Initialize DP-WGAN
        input_dim = self.preprocessor.feature_dimensions
        self.model = TabularDPWGAN(
            input_dim=input_dim,
            latent_dim=self.latent_dim,
            hidden_dim=128,
            lr=self.learning_rate,
            target_epsilon=self.epsilon,
            target_delta=self.delta,
            clip_norm=1.0,
            noise_mechanism=self.noise_mechanism
        )

        # Step 4: Train over epochs with DP accounting
        for ep in range(1, self.epochs + 1):
            metrics = self.model.train_epoch(feature_matrix, batch_size=self.batch_size)
            store.update_job_progress(
                job_id=self.job_id,
                epoch=ep,
                total_epochs=self.epochs,
                d_loss=metrics["d_loss"],
                g_loss=metrics["g_loss"],
                epsilon_spent=metrics["epsilon_spent"]
            )
            if self.progress_callback:
                self.progress_callback(ep, self.epochs, metrics["d_loss"], metrics["g_loss"], metrics["epsilon_spent"])

        # Step 5: Generate Synthetic Data
        raw_synthetic_matrix = self.model.generate(self.n_samples)
        synthetic_df = self.preprocessor.inverse_transform(raw_synthetic_matrix, n_samples=self.n_samples)

        # Step 6: Compute Privacy & Utility Benchmarks
        evaluator = SyntheticEvaluator(
            real_df=sanitized_real_df,
            synthetic_df=synthetic_df,
            epsilon=self.epsilon,
            delta=self.delta
        )
        evaluation_results = evaluator.evaluate()

        # Step 7: Store artifacts
        store.store_synthetic_twin(self.job_id, synthetic_df)
        store.store_evaluation(self.job_id, evaluation_results)

        duration = round(time.time() - start_time, 2)
        summary = {
            "job_id": self.job_id,
            "status": "completed",
            "duration_seconds": duration,
            "real_rows": len(self.raw_df),
            "synthetic_rows": len(synthetic_df),
            "columns": list(synthetic_df.columns),
            "pii_detected_and_masked": pii_cols,
            "overall_utility_score": evaluation_results["overall_utility_score"],
            "overall_privacy_score": evaluation_results["overall_privacy_score"],
            "epsilon_consumed": self.epsilon,
            "delta": self.delta
        }
        return summary
