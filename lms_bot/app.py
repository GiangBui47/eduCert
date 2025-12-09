from src.chitchat import ChitChatAgent
from src.lms_agent import LMSAgent
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
# from flask_core import CORS
from src.router.semantic_router import classify_query, load_or_create_all_embeddings

load_dotenv()
app = Flask(__name__)
# CORS(app)


def handel_query(query: str):
    model, embeddings, labels, samples = load_or_create_all_embeddings()
    category = classify_query(query, model, embeddings, labels)
    session_id = "session_demo_001"
    llm = ChatGroq(
            temperature=0,  
            model="llama-3.3-70b-versatile",  
            api_key=os.getenv("GROK_API_KEY")
        )
    if category == "course":
        lms_agent = LMSAgent(llm, verbose=True)
       
        response = lms_agent.invoke(
            query,
            session_id
        )
    else:
        chitchat_agent = ChitChatAgent(llm)
        response = chitchat_agent.invoke(query, session_id)

    return response

@app.route("/api/query", methods=["POST"])
def api_query():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        response = handel_query(query)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)