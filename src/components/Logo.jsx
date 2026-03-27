export default function Logo({ size = "md" }) {
  const heights = { sm: 32, md: 44, lg: 60 };
  const h = heights[size] || heights.md;
  return (
    <img
      src="/logo_cropped.png"
      alt="Rental Marketing Pros"
      height={h}
      style={{ height: h, width: "auto", display: "block", objectFit: "contain" }}
    />
  );
}
