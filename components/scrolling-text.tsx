export default function ScrollingText() {
  const text = "WE NEED YOU "
  const repeatedText = text.repeat(15)

  return (
    <div className="bg-primary overflow-hidden py-4">
      <div className="animate-scroll-text whitespace-nowrap">
        <div className="inline-block">
          <span className="inline-flex">
            {repeatedText.split(" ").map((word, i) => (
              <span key={i} className={i % 2 === 0 ? "text-white mx-2" : "text-secondary mx-2"}>
                {word}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

