export function AboutSection() {
  return (
    <section className="mt-8 space-y-4 border-t pt-5 text-sm text-muted-foreground">
      <div className="space-y-1.5">
        <h2 className="text-[15px] font-semibold text-foreground">What is the secretary problem?</h2>
        <p>
          The secretary problem is a classic puzzle in probability and optimal stopping theory that answers how to maximize your chances of choosing the single best option from a sequential stream of candidates. The Problem: You interview <i>n</i> candidates one by one in a random order. How do you decide when to stop and make your choice?
        </p>
      </div>
      <div className="space-y-1.5">
        <h2 className="text-[15px] font-semibold text-foreground">What is the 37% rule?</h2>
        <p>
          Explore the first 37% (1/e, about 36.8%) of what you have without choosing anything, and
          remember the best option you saw. Then pick the first option that beats it.
        </p>
        <p>
          This gives you about a 37% chance of ending up with the very best option, which is the
          highest chance any strategy can offer.
        </p>
      </div>
    </section>
  );
}
