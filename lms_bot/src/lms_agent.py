from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, trim_messages
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from src.tool.product_search import course_search_tool
from src.tool.policy_search import policy_search_tool
from langchain_groq import ChatGroq

import os 
from dotenv import load_dotenv
load_dotenv()


class ShoppingAgent:
    def __init__(self, llm, max_tokens: int = 2000, verbose: bool = False):
        """
        Agent with 2 tools:
          - course_search_tool
          - policy_search_tool
        """
        self.llm = llm
        self.max_tokens = max_tokens
        self.verbose = verbose

        self.tools = [course_search_tool, policy_search_tool]
        
        # ✅ FIX: Không dùng tool_choice, để model tự quyết định
        self.llm_with_tools = llm.bind_tools(self.tools)

        self.graph = self._build_graph()

    def _build_graph(self):
        # ✅ FIX: System prompt rõ ràng hơn, hướng dẫn cách dùng tool
        system_prompt = (
            "Bạn là trợ lý AI thông minh cho nền tảng học trực tuyến LMS.\n"
            "Nhiệm vụ của bạn là trả lời câu hỏi của người dùng về khóa học và chính sách.\n\n"
            "HƯỚNG DẪN QUAN TRỌNG:\n"
            "- Khi người dùng hỏi về KHÓA HỌC, BÀI GIẢNG, CHƯƠNG HỌC → dùng course_search_tool\n"
            "- Khi người dùng hỏi về CHÍNH SÁCH, ĐĂNG KÝ, THANH TOÁN → dùng policy_search_tool\n"
            "- Luôn trả lời bằng tiếng Việt\n"
            "- Thân thiện và cung cấp thông tin chính xác\n\n"
            "Công cụ có sẵn:\n"
            "1. course_search_tool(query: str) - Tìm kiếm khóa học\n"
            "2. policy_search_tool(query: str) - Tìm kiếm chính sách\n"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ])

        trimmer = trim_messages(
            max_tokens=self.max_tokens,
            strategy="last",
            token_counter=self.llm,
            include_system=True,
        )

        def agent_node(state: MessagesState):
            """Node xử lý chính"""
            try:
                trimmed = trimmer.invoke(state["messages"])
                chain = prompt | self.llm_with_tools
                response = chain.invoke({"messages": trimmed})

                if self.verbose:
                    print(f"\n[Agent] Response content: {response.content}")
                    if hasattr(response, "tool_calls") and response.tool_calls:
                        print(f"[Agent] Tool calls: {response.tool_calls}")

                return {"messages": [response]}
            
            except Exception as e:
                if self.verbose:
                    print(f"\n[Agent ERROR] {type(e).__name__}: {str(e)}")
                
                # Trả về error message thay vì crash
                error_response = AIMessage(
                    content=f"Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại."
                )
                return {"messages": [error_response]}

        def route_to_tool_or_end(state: MessagesState) -> str:
            """Quyết định có gọi tool hay kết thúc"""
            last = state["messages"][-1]
            if isinstance(last, AIMessage) and getattr(last, "tool_calls", None):
                if self.verbose:
                    print(f"[Router] Routing to TOOLS")
                return "tools"
            if self.verbose:
                print(f"[Router] Routing to END")
            return END

        tool_node = ToolNode(self.tools)

        graph_builder = StateGraph(MessagesState)
        graph_builder.add_node("agent", agent_node)
        graph_builder.add_node("tools", tool_node)

        graph_builder.add_edge(START, "agent")
        graph_builder.add_conditional_edges("agent", route_to_tool_or_end)
        graph_builder.add_edge("tools", "agent")

        memory = MemorySaver()
        return graph_builder.compile(checkpointer=memory)

    def invoke(self, query: str, session_id: str = "default") -> str:
        """Gọi agent với query"""
        config = {"configurable": {"thread_id": session_id}}
        
        if self.verbose:
            print(f"\n{'='*70}")
            print(f"[Shopping Agent] User Query: {query}")
            print(f"{'='*70}")
        
        try:
            response = self.graph.invoke(
                {"messages": [HumanMessage(content=query)]}, 
                config
            )
            last_message = response["messages"][-1]

            if self.verbose:
                print(f"\n[Shopping Agent] ✅ Final Response:")
                print(f"{last_message.content}")
                print(f"{'='*70}\n")

            return last_message.content
        
        except Exception as e:
            error_msg = f"Lỗi hệ thống: {str(e)}"
            if self.verbose:
                print(f"\n[Shopping Agent] ❌ ERROR: {error_msg}\n")
            return f"Xin lỗi, hệ thống gặp lỗi: {str(e)}"


if __name__ == "__main__":
    
    print("\n🔧 Đang khởi tạo Shopping Agent...")
    print("📌 Model: llama-3.3-70b-versatile")
    print("📌 Temperature: 0 (để tool calling ổn định)\n")
    
    llm = ChatGroq(
        temperature=0,  
        model="llama-3.3-70b-versatile",  
        api_key=os.getenv("GROK_API_KEY")
    )

    shopping_agent = ShoppingAgent(llm, verbose=True)
    session_id = "session_demo_001"

    # Test 1: Tìm khóa học
    print("\n" + "🎯" * 30)
    print("TEST 1: Tìm khóa học Python")
    print("🎯" * 30)
    response1 = shopping_agent.invoke(
        "Tôi muốn tìm khóa học về lập trình Python cơ bản.",
        session_id
    )

    # Test 2: Hỏi chính sách
    print("\n" + "🎯" * 30)
    print("TEST 2: Hỏi về chính sách")
    print("🎯" * 30)
    response2 = shopping_agent.invoke(
        "Làm sao để tạo tài khoản học viên mới?",
        session_id
    )


    print("\n" + "🎯" * 30)
    print("TEST 3: Câu hỏi nối tiếp")
    print("🎯" * 30)
    response3 = shopping_agent.invoke(
        "Ngoài Python thì có khóa học nào về Java không?",
        session_id
    )

    print("\n✅ Hoàn thành tất cả các test!")