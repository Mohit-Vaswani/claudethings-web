import CopyPrompt from "./CopyPrompt";

/**
 * A copy-paste prompt block: mono prompt text with a copy button and an
 * optional "why it works" note underneath. Server component — only the
 * copy button hydrates.
 */
export default function PromptCard({
  title,
  prompt,
  note,
}: {
  title: string;
  prompt: string;
  note?: string;
}) {
  return (
    <div className="prompt-card">
      <div className="prompt-head">
        <span className="p-title">{title}</span>
        <CopyPrompt text={prompt} />
      </div>
      <pre className="prompt-body">{prompt}</pre>
      {note && (
        <div className="prompt-note">
          <b>Why it works:</b> {note}
        </div>
      )}
    </div>
  );
}
