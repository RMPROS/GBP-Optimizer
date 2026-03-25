import "./globals.css";

export const metadata = {
  title: "GBP Description Optimizer",
  description: "AI-powered Google Business Profile description optimizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
