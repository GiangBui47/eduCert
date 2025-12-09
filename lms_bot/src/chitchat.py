from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, trim_messages
from langchain_groq import ChatGroq
import os 
from dotenv import load_dotenv

load_dotenv()



class ChitChatAgent:
    def __init__(self, llm, max_tokens: int = 2000):
        self.llm = llm
        self.max_tokens = max_tokens
        self.graph = self._build_graph()
    
    def _build_graph(self):
       
        system_prompt = (
            "You are a friendly and helpful AI assistant for an online learning platform (LMS).\n"
            "Your task is to chat with learners in a casual and engaging way, while naturally steering "
            "the conversation toward learning, education, and self-improvement whenever possible. "
            "Even when discussing everyday topics, try to relate them to learning or courses in a natural way.\n\n"
            "For example:\n"
            "- If the user mentions feeling tired, you might suggest short, relaxing study sessions or mindfulness courses.\n"
            "- If it's raining, you could mention that it’s a perfect time to stay indoors and learn something new.\n"
            "- If the user talks about work, you can connect it to career development or skill-upgrading courses.\n\n"
            "Always aim to:\n"
            "1. Be friendly, empathetic, and encouraging.\n"
            "2. Show genuine interest in the learner’s comments and goals.\n"
            "3. Smoothly guide the chat toward learning-related topics.\n"
            "4. Offer helpful study tips or course recommendations when appropriate.\n"
            "5. Inspire curiosity and continuous learning.\n\n"
            "IMPORTANT: Always respond in the SAME LANGUAGE as the user uses."
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
        
        def chatbot_node(state: MessagesState):
            trimmed_messages = trimmer.invoke(state["messages"])
            chain = prompt | self.llm
            response = chain.invoke({"messages": trimmed_messages})
            
            return {"messages": [response]}

        graph_builder = StateGraph(MessagesState)
        graph_builder.add_node("chatbot", chatbot_node)
        graph_builder.add_edge(START, "chatbot")
        graph_builder.add_edge("chatbot", END)
 
        memory = MemorySaver()
        return graph_builder.compile(checkpointer=memory)
    
    def invoke(self, query: str, session_id: str) -> str:
        config = {"configurable": {"thread_id": session_id}}
        
        response = self.graph.invoke(
            {"messages": [HumanMessage(content=query)]},
            config
        )
        
        return response["messages"][-1].content
    
    def stream(self, query: str, session_id: str):

        config = {"configurable": {"thread_id": session_id}}
        
        for event in self.graph.stream(
            {"messages": [HumanMessage(content=query)]},
            config,
            stream_mode="values"
        ):
            if "messages" in event and len(event["messages"]) > 0:
                yield event["messages"][-1].content