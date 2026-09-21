export function sanitizeWpHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/text-shadow:[^;"]*;?/gi, "")
    .replace(/class="[^"]*"/gi, "")
    .replace(/id="[^"]*"/gi, "");
}

export function WpContent({ html }: { html: string }) {
  const cleaned = sanitizeWpHtml(html);
  if (!cleaned.trim()) return null;
  return (
    <div
      className="wp-content max-w-none [&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-3xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-xl [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground/85 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_img]:my-4 [&_img]:h-auto [&_img]:w-full [&_img]:max-w-3xl [&_img]:rounded-xl [&_a]:font-semibold [&_a]:text-navy [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
