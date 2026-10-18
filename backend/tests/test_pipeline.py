"""
End-to-end unit test for synthesis pipeline and evaluation metrics
"""
import pandas as pd
import numpy as np
from app.storage.sample_data import generate_healthcare_dataset
from app.engine.pipeline import SynthesisPipeline
from app.storage.store import store

def test_synthesis_pipeline_runs_and_generates_valid_output():
    # Generate small sample dataset
    df = generate_healthcare_dataset(n_rows=60)
    job_id = "test-job-001"

    pipeline = SynthesisPipeline(
        job_id=job_id,
        real_df=df,
        epsilon=1.5,
        delta=1e-5,
        epochs=12,
        batch_size=16,
        latent_dim=8,
        synthetic_sample_count=40
    )

    result = pipeline.execute()

    assert result["status"] == "completed"
    assert result["synthetic_rows"] == 40
    assert result["overall_utility_score"] > 35.0
    assert result["overall_privacy_score"] > 75.0

    # Retrieve generated dataframe
    synth_df = store.get_synthetic_twin(job_id)
    assert synth_df is not None
    assert len(synth_df) == 40
    assert "Age" in synth_df.columns
    assert "Patient_MRN" in synth_df.columns

    # Verify no exact raw patient MRNs leaked
    real_mrns = set(df["Patient_MRN"])
    synth_mrns = set(synth_df["Patient_MRN"])
    assert len(real_mrns.intersection(synth_mrns)) == 0
