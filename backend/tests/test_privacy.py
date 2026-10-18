"""
Unit tests for Differential Privacy & Security Modules
"""
import numpy as np
import pytest
from app.engine.differential_privacy import DifferentialPrivacyAccountant, DPNoiseMechanism
from app.core.security import NoiseEncoder

def test_rdp_accountant_monotonic_growth():
    accountant = DifferentialPrivacyAccountant(target_delta=1e-5)
    eps_0 = accountant.get_epsilon()
    
    # Step 10 times
    accountant.step(q=0.05, noise_multiplier=1.2, steps=10)
    eps_10 = accountant.get_epsilon()

    accountant.step(q=0.05, noise_multiplier=1.2, steps=20)
    eps_30 = accountant.get_epsilon()

    assert eps_10 >= eps_0
    assert eps_30 > eps_10
    assert eps_30 < 10.0  # Safe reasonable bound

def test_gaussian_noise_mechanism():
    data = np.zeros((100, 10))
    noisy = DPNoiseMechanism.add_gaussian_noise(data, sensitivity=1.0, epsilon=1.0, delta=1e-5)
    assert noisy.shape == data.shape
    assert not np.allclose(data, noisy)
    # Mean of noise should be close to 0
    assert abs(np.mean(noisy)) < 0.5

def test_gradient_clipping_and_perturbation():
    grad = np.array([3.0, 4.0]) # norm = 5.0
    sanitized = DPNoiseMechanism.clip_and_perturb_gradients(grad, clip_norm=1.0, noise_multiplier=0.0)
    norm = np.linalg.norm(sanitized)
    assert np.isclose(norm, 1.0, atol=1e-4)

def test_noise_encoder_pii():
    encoder = NoiseEncoder(salt="test_salt_123")
    cols = ["patient_id", "email_address", "age", "systolic_bp"]
    samples = {
        "patient_id": ["P123", "P456"],
        "email_address": ["alice@example.com", "bob@health.org"],
        "age": [45, 60],
        "systolic_bp": [120, 140]
    }
    pii_cols = encoder.identify_pii_columns(cols, samples)
    assert "patient_id" in pii_cols
    assert "email_address" in pii_cols
    assert "age" not in pii_cols

    hashed = encoder.encode_pii_series(["alice@example.com"], "email_address")
    assert len(hashed) == 1
    assert hashed[0].startswith("EMAI_")
    assert hashed[0] != "alice@example.com"
