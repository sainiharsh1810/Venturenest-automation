from typing import Dict, Any

class ChatbotHandler:
    """
    Handles interactive AI co-founder & mentor advisor chat messages.
    """
    
    @staticmethod
    def answer_query(user_role: str, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        query_lower = query.lower()
        
        if user_role == "mentor":
            if "summarize" in query_lower or "review" in query_lower:
                reply = "I've reviewed the submitted pitch deck. The key risk area is the Unit Economics section. I recommend asking the founder for their CAC calculation breakdown."
            else:
                reply = "As a mentor advisor, you can provide inline feedback on student submitted documents or set up advisory Q&A sessions."
        else:
            # Founder / Student
            if "financial" in query_lower or "runway" in query_lower:
                reply = "To improve your financial model, focus on calculating your Monthly Burn Rate = (Monthly Expenses - Gross Revenue). I can help adjust your assumptions in the Financial Planner."
            elif "pitch" in query_lower or "deck" in query_lower:
                reply = "Your pitch deck looks solid! Make sure your Problem slide explicitly quantifies the financial loss your target customer currently suffers."
            else:
                reply = f"Great question! Building a venture requires validating your core hypothesis. Based on your current project context, I suggest reviewing your market size and requesting mentor review."

        return {
            "reply": reply,
            "sender": "AI Startup Advisor",
            "suggested_actions": ["Request Mentor Review", "Recalculate Runway", "Approve Plan Draft"]
        }
