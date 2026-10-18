"""
SynthEthic Tabular Data Preprocessor
Transforms mixed continuous and discrete columns into normalized neural representation,
and performs high-fidelity inverse transformation back to real database schemas.
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional

class ColumnType:
    CONTINUOUS = "continuous"
    CATEGORICAL = "categorical"
    IDENTIFIER = "identifier"

class TabularPreprocessor:
    def __init__(self, pii_columns: Optional[List[str]] = None):
        self.pii_columns = pii_columns or []
        self.column_metadata: Dict[str, Dict[str, Any]] = {}
        self.feature_dimensions = 0
        self.column_order: List[str] = []
        self.output_blocks: List[Dict[str, Any]] = []

    def fit(self, df: pd.DataFrame) -> "TabularPreprocessor":
        self.column_order = list(df.columns)
        self.output_blocks = []
        total_dim = 0

        for col in self.column_order:
            if col in self.pii_columns:
                self.column_metadata[col] = {
                    "type": ColumnType.IDENTIFIER,
                    "sample_prefix": f"{col[:3].upper()}_"
                }
                continue

            series = df[col]
            if pd.api.types.is_numeric_dtype(series) and series.nunique() > 10:
                # Continuous variable
                c_min = float(series.min())
                c_max = float(series.max())
                c_std = float(series.std()) if float(series.std()) > 0 else 1.0
                c_mean = float(series.mean())
                
                # Check if integer or float
                is_int = pd.api.types.is_integer_dtype(series)

                meta = {
                    "type": ColumnType.CONTINUOUS,
                    "min": c_min,
                    "max": c_max,
                    "mean": c_mean,
                    "std": c_std,
                    "is_int": is_int,
                    "dim": 1,
                    "start_idx": total_dim,
                    "end_idx": total_dim + 1
                }
                self.column_metadata[col] = meta
                self.output_blocks.append({"col": col, "type": ColumnType.CONTINUOUS, "dim": 1})
                total_dim += 1
            else:
                # Discrete / Categorical variable
                is_num = pd.api.types.is_numeric_dtype(series)
                is_int = pd.api.types.is_integer_dtype(series)
                categories = [str(c) for c in series.dropna().unique()]
                if not categories:
                    categories = ["UNKNOWN"]
                cat_to_idx = {c: i for i, c in enumerate(categories)}
                idx_to_cat = {i: c for i, c in enumerate(categories)}
                dim = len(categories)

                meta = {
                    "type": ColumnType.CATEGORICAL,
                    "is_numeric": is_num,
                    "is_int": is_int,
                    "categories": categories,
                    "cat_to_idx": cat_to_idx,
                    "idx_to_cat": idx_to_cat,
                    "dim": dim,
                    "start_idx": total_dim,
                    "end_idx": total_dim + dim
                }
                self.column_metadata[col] = meta
                self.output_blocks.append({"col": col, "type": ColumnType.CATEGORICAL, "dim": dim})
                total_dim += dim

        self.feature_dimensions = total_dim
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """Encodes DataFrame into 2D continuous matrix for GAN training"""
        n_rows = len(df)
        encoded = np.zeros((n_rows, self.feature_dimensions), dtype=np.float32)

        for col, meta in self.column_metadata.items():
            if meta["type"] == ColumnType.IDENTIFIER:
                continue

            series = df[col]
            s_idx = meta["start_idx"]
            e_idx = meta["end_idx"]

            if meta["type"] == ColumnType.CONTINUOUS:
                # Min-max scale to [-1, 1] range for Tanh generator activation
                val = series.values.astype(np.float32)
                span = meta["max"] - meta["min"]
                if span > 0:
                    scaled = 2.0 * ((val - meta["min"]) / span) - 1.0
                else:
                    scaled = np.zeros_like(val)
                encoded[:, s_idx] = np.clip(scaled, -1.0, 1.0)

            elif meta["type"] == ColumnType.CATEGORICAL:
                cat_to_idx = meta["cat_to_idx"]
                for row_i, val in enumerate(series):
                    val_str = str(val)
                    if val_str in cat_to_idx:
                        c_idx = cat_to_idx[val_str]
                        encoded[row_i, s_idx + c_idx] = 1.0

        return encoded

    def inverse_transform(self, matrix: np.ndarray, n_samples: Optional[int] = None) -> pd.DataFrame:
        """Converts generated matrix back to DataFrame conforming to original schema"""
        if n_samples is None:
            n_samples = matrix.shape[0]
        else:
            matrix = matrix[:n_samples]

        synthetic_dict: Dict[str, List[Any]] = {}

        for col in self.column_order:
            meta = self.column_metadata[col]

            if meta["type"] == ColumnType.IDENTIFIER:
                # Generate new synthetic random hash identifiers that resemble the pattern
                prefix = meta.get("sample_prefix", "SYN_")
                ids = [f"{prefix}{np.random.randint(100000, 999999)}" for _ in range(n_samples)]
                synthetic_dict[col] = ids

            elif meta["type"] == ColumnType.CONTINUOUS:
                s_idx = meta["start_idx"]
                col_vals = matrix[:, s_idx]
                # Inverse scale from [-1, 1] to [min, max]
                span = meta["max"] - meta["min"]
                unscaled = (col_vals + 1.0) / 2.0 * span + meta["min"]
                
                # Clip to physical reasonable limits
                unscaled = np.clip(unscaled, meta["min"] * 0.8 if meta["min"] > 0 else meta["min"] * 1.2,
                                   meta["max"] * 1.2 if meta["max"] > 0 else meta["max"] * 0.8)
                
                if meta["is_int"]:
                    synthetic_dict[col] = np.round(unscaled).astype(int).tolist()
                else:
                    synthetic_dict[col] = np.round(unscaled, 2).tolist()

            elif meta["type"] == ColumnType.CATEGORICAL:
                s_idx = meta["start_idx"]
                e_idx = meta["end_idx"]
                logits = matrix[:, s_idx:e_idx]
                
                # Argmax selection
                chosen_indices = np.argmax(logits, axis=1)
                idx_to_cat = meta["idx_to_cat"]
                cats = [idx_to_cat.get(idx, "UNKNOWN") for idx in chosen_indices]

                # If originally numeric, cast back to numeric type
                if meta.get("is_numeric", False):
                    casted_vals = []
                    for c in cats:
                        try:
                            val = float(c)
                            if meta.get("is_int", False):
                                val = int(round(val))
                            casted_vals.append(val)
                        except (ValueError, TypeError):
                            casted_vals.append(0)
                    synthetic_dict[col] = casted_vals
                else:
                    synthetic_dict[col] = cats

        return pd.DataFrame(synthetic_dict)
