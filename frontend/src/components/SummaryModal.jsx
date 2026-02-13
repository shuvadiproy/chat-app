import { X, Copy, Sparkles, Loader2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const SummaryModal = () => {
    const { chatSummary, isSummarizing, clearSummary, selectedUser } = useChatStore();

    const handleCopy = () => {
        if (chatSummary) {
            navigator.clipboard.writeText(chatSummary);
            toast.success("Summary copied to clipboard!");
        }
    };

    if (!chatSummary && !isSummarizing) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-4 border-b border-base-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Sparkles className="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Chat Summary</h3>
                                <p className="text-xs text-base-content/60">
                                    AI-generated summary with {selectedUser?.fullName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearSummary}
                            className="btn btn-sm btn-circle btn-ghost hover:bg-base-300"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {isSummarizing ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="relative">
                                <Loader2 className="size-12 text-primary animate-spin" />
                                <Sparkles className="size-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-base-content">Analyzing conversation...</p>
                                <p className="text-sm text-base-content/60 mt-1">
                                    AI is summarizing your chat
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none">
                            <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
                                <pre className="whitespace-pre-wrap text-sm font-sans text-base-content leading-relaxed m-0 bg-transparent">
                                    {chatSummary}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSummarizing && chatSummary && (
                    <div className="px-6 py-4 border-t border-base-300 bg-base-200/30 flex gap-3 justify-end">
                        <button
                            onClick={handleCopy}
                            className="btn btn-sm btn-outline gap-2"
                        >
                            <Copy className="size-4" />
                            Copy
                        </button>
                        <button
                            onClick={clearSummary}
                            className="btn btn-sm btn-primary"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryModal;
