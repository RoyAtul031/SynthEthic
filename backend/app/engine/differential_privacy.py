"""
SynthEthic Differential Privacy Engine
Implements (epsilon, delta)-Differential Privacy Mechanisms & RDP Moments Accounting.
References:
- Dwork, Roth: "The Algorithmic Foundations of Differential Privacy" (2014)
- Abadi et al.: "Deep Learning with Differential Privacy", CCS 2016
- Mironov: "Rényi Differential Privacy", CSF 2017
"""
import math
import numpy as np
from typing import Dict, Any, Tuple

class DifferentialPrivacyAccountant:
    """
    Rényi Differential Privacy (RDP) & Advanced Composition Accountant.
    Tracks privacy loss parameters (epsilon, delta) across training epochs.
    """
    def __init__(self, target_delta: float = 1e-5):
        self.target_delta = target_delta
        # RDP orders to evaluate for the tightest epsilon conversion
        self.orders = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 8.0, 10.0, 16.0, 32.0, 64.0]
        self.rdp_history = np.zeros(len(self.orders))

    def compute_step_rdp(self, q: float, noise_multiplier: float, order: float) -> float:
        """
        Calculates Rényi divergence for subsampled Gaussian mechanism.
        q = subsampling ratio (batch_size / N)
        sigma = noise_multiplier
        alpha = order
        """
        if noise_multiplier <= 0:
            return float('inf')
        
        # Subsampled Gaussian mechanism RDP bound approximation (Mironov et al.)
        if q == 1.0:
            return order / (2.0 * (noise_multiplier ** 2))
        
        # For small q, RDP approx: (q^2 * alpha) / (2 * sigma^2)
        variance = noise_multiplier ** 2
        approx_rdp = (q ** 2) * order / (2.0 * variance)
        return float(approx_rdp)

    def step(self, q: float, noise_multiplier: float, steps: int = 1):
        """Accumulates privacy loss over steps"""
        for i, order in enumerate(self.orders):
            step_rdp = self.compute_step_rdp(q, noise_multiplier, order)
            self.rdp_history[i] += step_rdp * steps

    def get_epsilon(self) -> float:
        """
        Converts accumulated RDP to (epsilon, delta)-DP via standard transformation:
        epsilon(delta) = min_{alpha > 1} ( RDP(alpha) + (log(1 / delta)) / (alpha - 1) )
        """
        epsilons = []
        for i, order in enumerate(self.orders):
            if order <= 1.0:
                continue
            eps = self.rdp_history[i] + (math.log(1.0 / self.target_delta) / (order - 1.0))
            epsilons.append(eps)
        
        if not epsilons:
            return 1.0
        return float(min(epsilons))


class DPNoiseMechanism:
    """
    Calibrated Noise Perturbation for Data Preprocessing and Gradient Sanitization
    """
    @staticmethod
    def add_laplace_noise(data: np.ndarray, sensitivity: float, epsilon: float) -> np.ndarray:
        """
        Laplace Mechanism: f(x) + Lap(0, Delta f / epsilon)
        Provides pure epsilon-Differential Privacy.
        """
        if epsilon <= 0:
            raise ValueError("Epsilon must be greater than 0.")
        scale = sensitivity / epsilon
        noise = np.random.laplace(0.0, scale, size=data.shape)
        return data + noise

    @staticmethod
    def add_gaussian_noise(data: np.ndarray, sensitivity: float, epsilon: float, delta: float = 1e-5) -> np.ndarray:
        """
        Gaussian Mechanism: f(x) + N(0, sigma^2)
        Provides (epsilon, delta)-Differential Privacy where
        sigma >= sensitivity * sqrt(2 * ln(1.25 / delta)) / epsilon
        """
        if epsilon <= 0 or delta <= 0:
            raise ValueError("Epsilon and Delta must be positive.")
        sigma = sensitivity * math.sqrt(2.0 * math.log(1.25 / delta)) / epsilon
        noise = np.random.normal(0.0, sigma, size=data.shape)
        return data + noise

    @staticmethod
    def clip_and_perturb_gradients(gradients: np.ndarray, clip_norm: float, noise_multiplier: float) -> np.ndarray:
        """
        DP-SGD gradient perturbation step:
        1. Norm clipping: g <- g / max(1, ||g||_2 / C)
        2. Calibrated noise: g <- g + N(0, (sigma * C)^2 * I)
        """
        grad_norm = np.linalg.norm(gradients)
        if grad_norm > clip_norm and grad_norm > 0:
            clipped_grads = gradients * (clip_norm / grad_norm)
        else:
            clipped_grads = gradients.copy()
        
        if noise_multiplier > 0:
            sigma = noise_multiplier * clip_norm
            noise = np.random.normal(0.0, sigma, size=clipped_grads.shape)
            return clipped_grads + noise
        return clipped_grads
