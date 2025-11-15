import { useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, User, Bot } from "lucide-react";
import type { AiMessage } from "@/types/domain";

type AiQuestionnaireProps = {
  messages: AiMessage[];
  onSubmit: (question: string) => void;
  busy?: boolean;
  maxLength?: number;
};

export const AiQuestionnaire = ({ messages, onSubmit, busy, maxLength = 1000 }: AiQuestionnaireProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = useCallback(() => {
    if (!question.trim() || question.length > maxLength) return;
    onSubmit(question.trim());
    setQuestion("");
  }, [question, onSubmit, maxLength]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <NeuCard className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">Copilot Fiscal</h3>
          <p className="text-sm text-muted-foreground">Posez vos questions à l'IA sur les obligations et exports.</p>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4 min-h-[280px] max-h-[400px]">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Aucune interaction pour l'instant. Demandez-lui ses recommandations.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`neu-inset rounded-xl p-4 ${
                message.role === "assistant" ? "bg-primary/5 border-primary/20" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
                    {message.role === "assistant" ? "Copilot IA" : message.role === "user" ? "Vous" : "Système"}
                  </p>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <div className="space-y-2">
          <Textarea
            placeholder="Ex: Quels justificatifs dois-je préparer pour l'export App A ?"
            value={question}
            onChange={(event) => {
              if (event.target.value.length <= maxLength) {
                setQuestion(event.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
            disabled={busy}
            maxLength={maxLength}
            aria-label="Zone de saisie pour votre question"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="sr-only">Nombre de caractères utilisés</span>
            <span className={question.length > maxLength * 0.9 ? "text-orange-600" : ""}>
              {question.length}/{maxLength}
            </span>
          </div>
        </div>
        <NeuButton
          type="button"
          className="w-full"
          onClick={handleSubmit}
          disabled={busy || !question.trim() || question.length > maxLength}
          aria-label={busy ? "Envoi en cours..." : "Envoyer la question"}
        >
          <Send className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy ? "Envoi..." : "Poser la question"}
        </NeuButton>
      </div>
    </NeuCard>
  );
};

