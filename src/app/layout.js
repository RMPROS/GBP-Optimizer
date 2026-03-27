import "./globals.css";

export const metadata = {
  title: "GBP Optimizer | Rental Marketing Pros",
  description: "AI-powered Google Business Profile description optimizer by Rental Marketing Pros",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
