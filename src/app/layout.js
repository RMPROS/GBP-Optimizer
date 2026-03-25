import "./globals.css";

export const metadata = {
  title: "GBP Optimizer | Rental Marketing Pros",
  description: "AI-powered Google Business Profile description optimizer by Rental Marketing Pros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
