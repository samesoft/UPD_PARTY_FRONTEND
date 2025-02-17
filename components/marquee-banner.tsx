export function MarqueeBanner() {
  return (
    <div className="relative bg-primary py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-scroll-text">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={`inline-block mx-4 text-xl font-semibold ${
              i % 2 === 0 ? "text-white" : "text-primary-foreground"
            }`}
          >
            WE NEED YOU
          </span>
        ))}
      </div>
    </div>
  );
}
