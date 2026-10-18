"""
SynthEthic Storage and Job State Manager
Provides dataset caching, job state tracking, and export formatting.
"""
import os
import uuid
import pandas as pd
from typing import Dict, Any, Optional
from app.storage.sample_data import AVAILABLE_BENCHMARKS

class StorageManager:
    def __init__(self):
        self.datasets: Dict[str, pd.DataFrame] = {}
        self.synthetic_twins: Dict[str, pd.DataFrame] = {}
        self.evaluation_reports: Dict[str, Dict[str, Any]] = {}
        self.training_histories: Dict[str, list] = {}
        self.active_jobs: Dict[str, Dict[str, Any]] = {}
        
        # Pre-seed benchmark datasets
        self._initialize_benchmarks()

    def _initialize_benchmarks(self):
        for benchmark_id, info in AVAILABLE_BENCHMARKS.items():
            df = info["generator"](n_rows=500)
            self.datasets[benchmark_id] = df

    def store_dataset(self, name: str, df: pd.DataFrame) -> str:
        dataset_id = str(uuid.uuid4())[:8]
        self.datasets[dataset_id] = df
        return dataset_id

    def get_dataset(self, dataset_id: str) -> Optional[pd.DataFrame]:
        return self.datasets.get(dataset_id)

    def store_synthetic_twin(self, job_id: str, df: pd.DataFrame):
        self.synthetic_twins[job_id] = df

    def get_synthetic_twin(self, job_id: str) -> Optional[pd.DataFrame]:
        return self.synthetic_twins.get(job_id)

    def store_evaluation(self, job_id: str, eval_data: Dict[str, Any]):
        self.evaluation_reports[job_id] = eval_data

    def get_evaluation(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self.evaluation_reports.get(job_id)

    def update_job_progress(self, job_id: str, epoch: int, total_epochs: int, d_loss: float, g_loss: float, epsilon_spent: float):
        if job_id not in self.training_histories:
            self.training_histories[job_id] = []
        
        entry = {
            "epoch": epoch,
            "d_loss": round(d_loss, 4),
            "g_loss": round(g_loss, 4),
            "epsilon_spent": round(epsilon_spent, 4),
            "progress_percent": round((epoch / total_epochs) * 100, 1)
        }
        self.training_histories[job_id].append(entry)
        
        self.active_jobs[job_id] = {
            "status": "training" if epoch < total_epochs else "completed",
            "current_epoch": epoch,
            "total_epochs": total_epochs,
            "latest_metrics": entry
        }

    def get_training_history(self, job_id: str) -> list:
        return self.training_histories.get(job_id, [])

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        return self.active_jobs.get(job_id, {"status": "not_found"})

store = StorageManager()
