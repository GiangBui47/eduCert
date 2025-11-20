from typing import Union, List, Dict
from pymongo import MongoClient
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain.tools import tool
from langchain_groq import ChatGroq
import os 
from dotenv import load_dotenv
load_dotenv()
import json

LMS_COURSE_PROMPT = """
You are an AI assistant for an online learning platform (LMS). 
Your role is to help users find information about courses, chapters, lectures, and tests.

The MongoDB collection 'courses' contains the following fields:

Course-level fields:
- courseTitle (String): The title of the course.
- courseDescription (String): A short description of the course.
- courseThumbnail (String): URL of the course thumbnail image.
- coursePrice (Number): The price of the course.
- discount (Number): Discount percentage (0–100).
- discountEndTime (Date): Expiration date of discount.
- educator (String): ID of the course creator (teacher).
- enrolledStudents ([String]): List of student IDs enrolled.
- courseRatings ([{{ userId, rating }}]): User ratings (1–5).
- isPublished (Boolean): Whether the course is public.
- lastUpdated (Date): Last update timestamp.

courseContent (Array of chapters):
Each chapter contains:
- chapterId (String)
- chapterTitle (String)
- chapterOrder (Number)
- chapterContent (Array of lectures):
    - lectureId (String)
    - lectureTitle (String)
    - lectureDuration (Number, in minutes)
    - lectureUrl (String)
    - isPreviewFree (Boolean)
    - lectureOrder (Number)

tests (Array of assessments):
Each test includes:
- testId (String)
- chapterNumber (Number)
- duration (Number, minutes)
- passingScore (Number)
- questions (Array)

---

Your task:
Generate a **MongoDB query** to retrieve relevant information based on the user's question.

Rules:
1. Use case-insensitive regex search for text fields
2. Use proper projection to return only relevant fields
3. Output ONLY the MongoDB query in JSON format
4. No explanations, no markdown, just the JSON query

Question: {input}
"""

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "lms_db"
COLLECTION_NAME = "course"


def connect_mogodb() -> MongoClient:
    return MongoClient(MONGO_URI)


def execute_mongo_query(query_json: Dict) -> list[Dict]:
    with connect_mogodb() as client:
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        if "aggregate" in query_json and "pipeline" in query_json:
            results = list(collection.aggregate(query_json["pipeline"]))
        else:
            results = list(collection.find(query_json, {"_id": 0}))
        return results


def get_llm_grok():
    return ChatGroq(
        temperature=0,
        model="llama-3.3-70b-versatile",  
        api_key=os.getenv("GROK_API_KEY")
    )


def get_prompt():
    return PromptTemplate(
        template=LMS_COURSE_PROMPT,
        input_variables=["input"]
    )


def safe_execute_query(llm_output: str) -> List[Dict]:
    try:
        # Clean output
        llm_output = llm_output.strip()
        llm_output = llm_output.replace("```json", "").replace("```", "").strip()
        
        query_json = json.loads(llm_output)
        return query_json
    except json.JSONDecodeError as e:
        return [{"error": f"JSON parse error: {str(e)}", "raw_output": llm_output}]
    except Exception as e:
        return [{"error": f"Query execution error: {str(e)}"}]


def run_courses_query(query: str) -> Union[List[Dict], str]:
    try:
        llm = get_llm_grok()
        prompt = get_prompt()
        chain = (
            {"input": RunnablePassthrough()}
            | prompt
            | llm
            | (lambda x: safe_execute_query(x.content))
        )
        
        print(f"[Query] User input: {query}")
        result = chain.invoke(query)
        print(f"[Query] Generated query: {json.dumps(result, ensure_ascii=False, indent=2)}")
        
        return result
    except Exception as e:
        return f"Error executing query: {str(e)}"

@tool
def course_search_tool(query: str) -> str:
    """
    Search for courses in the LMS system.
    
    Use this tool when users ask about:
    - Finding courses (e.g., "Python courses", "free web development")
    - Course details (price, description, chapters)
    - Course content (lectures, lessons)
    
    Args:
        query: The search query or question about courses
    
    Returns:
        str: JSON string with matching courses or error message
    """
    try:
        result = run_courses_query(query=query)
        
        if not result:
            return json.dumps({
                "status": "no_results",
                "message": "Không tìm thấy khóa học nào phù hợp."
            }, ensure_ascii=False)
        

        return json.dumps(result, ensure_ascii=False, indent=2)
    
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Lỗi khi tìm kiếm: {str(e)}"
        }, ensure_ascii=False)


# if __name__ == "__main__":
#     print("🧪 Testing course_search_tool...\n")
    
#     test_query = "cho tôi xem khóa học python miễn phí và nó có những chapter nào"
#     print(f"Test query: {test_query}\n")
    
#     results = run_courses_query(test_query)
#     print("\n📊 Results:")
#     print(json.dumps(results, ensure_ascii=False, indent=2))