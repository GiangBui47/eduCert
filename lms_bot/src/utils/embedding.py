from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import Optional
import torch
import sys

def get_embedding_model(model_name: Optional[str] = None) -> HuggingFaceEmbeddings:
    model_name = model_name or "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    device = "cuda" if torch.cuda.is_available() else "cpu"

    try:
        print(f"🔄 Đang tải model: {model_name} trên {device.upper()} ...")

        # ✅ Đúng cú pháp của LangChain
        model = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs={"device": device},  # quan trọng
            encode_kwargs={"normalize_embeddings": True}
        )

        print(f"✅ Loaded embedding model: {model_name} on {device.upper()}")
        return model

    except Exception as e:
        print(f"❌ Không thể tải model '{model_name}' trên {device.upper()}: {e}", file=sys.stderr)

        # Fallback sang CPU nếu GPU bị lỗi
        if device == "cuda":
            try:
                print("⚠️ Thử lại trên CPU ...")
                model = HuggingFaceEmbeddings(
                    model_name=model_name,
                    model_kwargs={"device": "cpu"},
                    encode_kwargs={"normalize_embeddings": True}
                )
                print(f"✅ Loaded embedding model: {model_name} on CPU (fallback)")
                return model
            except Exception as e2:
                raise RuntimeError(f"Lỗi khi tải model {model_name} (CPU fallback): {e2}") from e2
        else:
            raise RuntimeError(f"Lỗi khi tải model {model_name}: {e}") from e
