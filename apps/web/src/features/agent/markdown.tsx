import ReactMarkdown from 'react-markdown';

export function Markdown({ children }: { children: string }) {
  return (
    <div
      className="flex flex-col gap-2 [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:text-xs
        [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}