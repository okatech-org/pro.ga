import { useState, useCallback, useMemo } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, User, Bot, Loader2 } from "lucide-react";
import type { AiMessage } from "@/types/domain";

type AiQuestionnaireProps = {
  messages: AiMessage[];
  onSubmit: (question: string) => void;
  busy?: boolean;
  maxLength?: number;
};

export const AiQuestionnaire = ({ messages, onSubmit, busy = false, maxLength = 1000 }: AiQuestionnaireProps) => {
  const [question, setQuestion] = useState("");

  const isValid = useMemo(() => {
    return question.trim().length > 0 && question.trim().length <= maxLength;
  }, [question, maxLength]);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    onSubmit(question.trim());
    setQuestion("");
  }, [question, onSubmit, isValid]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <NeuCard className="w-full p-4 sm:p-6 flex flex-col h-full min-h-[400px] sm:min-h-[500px]">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-slate-900">Copilot Fiscal</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">Posez vos questions à l'IA sur les obligations et exports.</p>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-2 sm:pr-4 mb-3 sm:mb-4 min-h-[200px] sm:min-h-[280px] max-h-[300px] sm:max-h-[400px]">
        <div className="space-y-2 sm:space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                Aucune interaction pour l'instant. Demandez-lui ses recommandations.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`neu-inset rounded-xl p-3 sm:p-4 ${
                message.role === "assistant" ? "bg-primary/5 border-primary/20" : ""
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant" 
                    ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
                    {message.role === "assistant" ? "Copilot IA" : message.role === "user" ? "Vous" : "Système"}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                  {message.createdAt && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleTimeString("fr-FR", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {busy && (
            <div className="neu-inset rounded-xl p-3 sm:p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
                    Copilot IA
                  </p>
                  <p className="text-xs sm:text-sm text-slate-900">Traitement en cours...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
        <div className="space-y-1.5 sm:space-y-2">
          <Textarea
            placeholder="Ex: Quels justificatifs dois-je préparer pour l'export App A ?"
            value={question}
            onChange={(event) => {
              if (event.target.value.length <= maxLength) {
                setQuestion(event.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            className="min-h-[70px] sm:min-h-[80px] resize-none text-xs sm:text-sm"
            disabled={busy}
            maxLength={maxLength}
            aria-label="Zone de saisie pour votre question"
          />
          <div className="flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground">
            <span className="sr-only">Nombre de caractères utilisés</span>
            <span className={question.length > maxLength * 0.9 ? "text-orange-600 font-medium" : ""}>
              {question.length}/{maxLength}
            </span>
          </div>
        </div>
        <NeuButton
          type="button"
          variant="premium"
          size="sm"
          className="w-full text-xs sm:text-sm"
          onClick={handleSubmit}
          disabled={busy || !isValid}
          aria-label={busy ? "Envoi en cours..." : isValid ? "Envoyer la question" : "Question invalide"}
        >
          {busy ? (
            <>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Envoi...</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Poser la question</span>
            </>
          )}
        </NeuButton>
      </div>
    </NeuCard>
  );
};

