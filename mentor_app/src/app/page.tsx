"use client";

import React, { useState } from "react";
import { 
  Users, 
  HelpCircle, 
  FileCheck, 
  User, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  AlertTriangle, 
  Send, 
  Star, 
  X,
  FileText,
  ChevronRight
} from "lucide-react";

export default function MentorsApp() {
  const [tab, setTab] = useState<"directory" | "requests" | "reviews" | "profile">("directory");

  // Mentor state
  const [assignedProjects, setAssignedProjects] = useState([
    {
      id: "p1",
      name: "EcoPack AI",
      founder: "Alex Rivera",
      stage: "Seed Round",
      documents_count: 2,
      latest_doc: "EcoPack_PitchDeck_v1.pdf",
      problem: "Sustainable packaging pricing for SMB e-commerce retailers.",
      status: "Needs Mentor Review"
    },
    {
      id: "p2",
      name: "MedFlow Tech",
      founder: "Elena Rostova",
      stage: "Pre-Seed",
      documents_count: 1,
      latest_doc: "MedFlow_BusinessPlan_v2.pdf",
      problem: "Automating clinical appointment triage.",
      status: "Approved"
    }
  ]);

  const [helpRequests, setHelpRequests] = useState([
    {
      id: "m1",
      project_name: "EcoPack AI",
      founder_name: "Alex Rivera",
      title: "Financial Model & CAC Assumptions Review",
      category: "Finance",
      description: "We need help reviewing our customer acquisition cost (CAC) assumptions and 12-month runway projection before our incubator demo day.",
      status: "open"
    }
  ]);

  // Selected project for Document Review modal
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "Alex Rivera (Founder)", text: "Hi Dr. Sarah! Thank you for taking the time to review our EcoPack pitch deck." }
  ]);

  const handleFetchAiSummary = (docTitle: string) => {
    setLoadingAiSummary(true);
    fetch("http://localhost:8001/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "mentor_summary",
        context: { title: docTitle, notes: "Pitch deck initial review" }
      })
    })
      .then(res => res.json())
      .then(data => {
        setAiSummary(data.result);
        setLoadingAiSummary(false);
      })
      .catch(() => {
        setAiSummary({
          summary: `AI Key Highlights from '${docTitle}': The startup presents strong market traction with 5 pilot accounts.`,
          key_strengths: ["Clear customer pain point", "Defined addressable market"],
          risk_flags: ["Customer Acquisition Cost (CAC) assumptions require stress testing"]
        });
        setLoadingAiSummary(false);
      });
  };

  const handleSubmitReview = (statusTag: string) => {
    if (!selectedProject || !feedbackText) return;
    
    // Call backend API
    fetch("http://localhost:8000/api/mentor-app/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mentorship_request_id: "m1",
        feedback_text: feedbackText,
        rating: rating,
        status_tag: statusTag
      })
    }).catch(() => console.log("Review submitted locally"));

    setReviewSubmitted(true);
    setTimeout(() => {
      setSelectedProject(null);
      setReviewSubmitted(false);
      setFeedbackText("");
    }, 1500);
  };

  const handleSendChatMessage = () => {
    if (!chatInput) return;
    setChatMessages(prev => [...prev, { sender: "Dr. Sarah Chen (Mentor)", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0B192C] text-slate-100 relative">
      {/* Mobile Top Header */}
      <header className="px-5 py-4 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            M
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-slate-100">Mentors Connection</h1>
            <span className="text-[10px] text-indigo-400 font-medium">Mentors Mobile App</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-xs text-slate-300 font-medium">Dr. Sarah Chen</span>
        </div>
      </header>

      {/* Main Scrollable Mobile Content */}
      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        
        {/* VIEW 1: DIRECTORY */}
        {tab === "directory" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Assigned Incubatees</h2>
              <p className="text-xs text-slate-400">Review student startup documents & pitch decks.</p>
            </div>

            <div className="space-y-4">
              {assignedProjects.map((p) => (
                <div key={p.id} className="bg-[#1E293B] border border-slate-700 p-5 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">{p.stage}</span>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400">Founder: {p.founder}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status.includes("Review") ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg leading-relaxed">{p.problem}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/80 text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-[#008B8B]" />
                      <span>{p.latest_doc}</span>
                    </span>

                    <button 
                      onClick={() => {
                        setSelectedProject(p);
                        handleFetchAiSummary(p.latest_doc);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center space-x-1"
                    >
                      <span>Review Deck</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: REQUESTS */}
        {tab === "requests" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Help Request Queue</h2>
              <p className="text-xs text-slate-400">Student help requests submitted from Student App.</p>
            </div>

            <div className="space-y-4">
              {helpRequests.map((req) => (
                <div key={req.id} className="bg-[#1E293B] border border-slate-700 p-5 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase">
                      {req.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Status: {req.status}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100">{req.title}</h3>
                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg leading-relaxed">{req.description}</p>
                  <p className="text-xs text-slate-400">Requested by: <span className="text-slate-200 font-semibold">{req.founder_name}</span> ({req.project_name})</p>

                  <div className="pt-2 flex space-x-2">
                    <button 
                      onClick={() => setChatOpen(true)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Founder Q&A</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: REVIEWS */}
        {tab === "reviews" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Submitted Mentor Feedback</h2>
              <p className="text-xs text-slate-400">History of advisory reviews sent to students.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">EcoPack AI Pitch Deck</span>
                <span className="text-[#D4AF37] font-bold">5.0 ★</span>
              </div>
              <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg">"Solid presentation of problem statement. Ensure you break down your unit economics before demo day."</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>By Dr. Sarah Chen</span>
                <span className="text-emerald-400 font-bold">Approved Tag</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PROFILE */}
        {tab === "profile" && (
          <div className="space-y-5">
            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-2xl text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-indigo-600 mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg">
                SC
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Dr. Sarah Chen</h2>
                <p className="text-xs text-indigo-400">Lead Mentor • Incubator Cohort 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-xs">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <p className="text-slate-400 text-[10px]">Projects Reviewed</p>
                  <p className="font-bold text-white text-base">14</p>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <p className="text-slate-400 text-[10px]">Mentor Rating</p>
                  <p className="font-bold text-[#D4AF37] text-base">4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Review Modal with AI Summary */}
      {selectedProject && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-end">
          <div className="w-full bg-[#1E293B] border-t border-slate-700 rounded-t-2xl p-5 space-y-4 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100">Reviewing: {selectedProject.name}</h3>
                <p className="text-[10px] text-slate-400">Submitted file: {selectedProject.latest_doc}</p>
              </div>
              <button onClick={() => setSelectedProject(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {/* AI Summary Box */}
            <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Mentor Document Summarizer</span>
              </div>
              
              {loadingAiSummary ? (
                <p className="text-xs text-slate-400 animate-pulse">Analyzing pitch deck contents...</p>
              ) : aiSummary ? (
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="bg-slate-950 p-2.5 rounded text-[11px]">{aiSummary.summary}</p>
                  {aiSummary.risk_flags && (
                    <div className="flex items-start space-x-1 text-amber-400 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{aiSummary.risk_flags[0]}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Mentor Rating & Feedback Form */}
            {reviewSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Review Transmitted to Student App!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Advisory Feedback for Student</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide constructive guidance for Alex and the team..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Assign Rating</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`text-lg ${star <= rating ? "text-[#D4AF37]" : "text-slate-600"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => handleSubmitReview("needs_revision")}
                    className="bg-amber-600/80 hover:bg-amber-600 text-white py-2.5 rounded-lg text-xs font-bold"
                  >
                    Tag: Needs Revision
                  </button>
                  <button 
                    onClick={() => handleSubmitReview("approved")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold"
                  >
                    Tag: Approve Deck
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct Q&A Chat Modal */}
      {chatOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col">
          <div className="px-5 py-4 bg-[#1E293B] border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">Q&A Chat: Alex Rivera (EcoPack AI)</h3>
            </div>
            <button onClick={() => setChatOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl text-xs max-w-[85%] ${
                  msg.sender.includes("Mentor") 
                    ? "bg-indigo-600 text-white ml-auto" 
                    : "bg-slate-800 text-slate-200 border border-slate-700 mr-auto"
                }`}
              >
                <p className="font-bold text-[10px] opacity-75 mb-0.5">{msg.sender}</p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1E293B] border-t border-slate-700 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Type mentor advice to founder..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={handleSendChatMessage}
              className="bg-indigo-600 p-2 rounded-lg text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="h-16 bg-[#1E293B] border-t border-slate-700 fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center justify-around z-20">
        <button 
          onClick={() => setTab("directory")}
          className={`flex flex-col items-center justify-center w-16 py-1 ${tab === "directory" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Directory</span>
        </button>

        <button 
          onClick={() => setTab("requests")}
          className={`flex flex-col items-center justify-center w-16 py-1 ${tab === "requests" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Help Feed</span>
        </button>

        <button 
          onClick={() => setTab("reviews")}
          className={`flex flex-col items-center justify-center w-16 py-1 ${tab === "reviews" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <FileCheck className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Reviews</span>
        </button>

        <button 
          onClick={() => setTab("profile")}
          className={`flex flex-col items-center justify-center w-16 py-1 ${tab === "profile" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
