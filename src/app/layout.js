import "./globals.css";

export const metadata = {
  title: "GBP Description Optimizer | Rental Marketing Pros",
  description: "Optimize your Google Business Profile description with Rental Marketing Pros",
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
