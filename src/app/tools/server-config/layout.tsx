import { createPageMetadata } from "../../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Server Config Generator",
  description: "Generate a valid enshrouded_server.json with server name, slots, port, chat, and difficulty settings.",
  path: "/tools/server-config",
});

export default function ServerConfigLayout({ children }: { children: React.ReactNode }) {
  return children;
}

