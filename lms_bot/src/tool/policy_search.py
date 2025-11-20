from src.utils.embedding import get_embedding_model
import os 
from typing import List
from langchain.tools import tool
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import json


FAQ_FILE_PATH = r"D:\Model\LMS\data\policy.txt"
FAISS_DB_PATH = r"D:\Model\LMS\data\vectorstores"


def load_faq_data(file_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Không tìm thấy file: {file_path}")
    loader = TextLoader(file_path, encoding="utf-8")
    docs = loader.load()
    return docs


def split_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n", ".", "?", "!", ";"]
    )
    chunks = splitter.split_documents(docs)
    return chunks


def build_faiss_index(docs, embedding_model):
    db = FAISS.from_documents(docs, embedding_model)
    return db


def save_faiss_index(db, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    db.save_local(path)
    print(f"✅ FAISS index saved at: {path}")


def load_or_build_faiss(embedding_model):
    index_file = os.path.join(FAISS_DB_PATH, "index.faiss")
    if os.path.exists(index_file):
        print("📂 Loading existing FAISS index...")
        db = FAISS.load_local(
            FAISS_DB_PATH, 
            embedding_model, 
            allow_dangerous_deserialization=True
        )
    else:
        print("🔨 Building new FAISS index...")
        raw_docs = load_faq_data(FAQ_FILE_PATH)
        chunks = split_documents(raw_docs)
        db = build_faiss_index(chunks, embedding_model)
        save_faiss_index(db, FAISS_DB_PATH)
    return db


# ✅ FIX: Đổi return type thành str để nhất quán
@tool
def policy_search_tool(query: str) -> str:
    """
    Search for information in LMS policies, guidelines, and FAQ.
    
    Use this tool when users ask about:
    - Registration and login
    - Payment, refunds, promotions
    - Certificates and learning policies
    - Technical support
    - Terms of service
    
    Args:
        query: User question about policies or FAQ
    
    Returns:
        str: Relevant policy information or error message
    """
    try:
        embedding_model = get_embedding_model()
        db = load_or_build_faiss(embedding_model)
        results = db.similarity_search(query, k=3)

        if not results:
            return json.dumps({
                "status": "no_results",
                "message": "❌ Không tìm thấy thông tin phù hợp."
            }, ensure_ascii=False)

        # Format results nicely
        content_list = []
        for i, doc in enumerate(results, 1):
            content_list.append(f"[Kết quả {i}]\n{doc.page_content.strip()}")
        
        formatted_content = "\n\n" + "─" * 70 + "\n\n".join(content_list)
        
        return json.dumps({
            "status": "success",
            "results": formatted_content,
            "total": len(results)
        }, ensure_ascii=False, indent=2)
    
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Lỗi khi tìm kiếm chính sách: {str(e)}"
        }, ensure_ascii=False)


if __name__ == "__main__":
    print("🧪 Testing policy_search_tool...\n")
    
    # Test the tool
    test_query = "Làm sao để đăng ký tài khoản mới?"
    print(f"Test query: {test_query}\n")
    
    result = policy_search_tool.invoke({"query": test_query})
    print("\n📊 Results:")
    print(result)