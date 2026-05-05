function CategoryTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-zinc-500 uppercase tracking-wide">{children}</p>
  );
}

export default CategoryTitle;
