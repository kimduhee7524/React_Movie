const PageLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 max-w-6xl mx-auto space-y-8">
    <div className="relative">
      <h1 className="text-3xl font-bold text-foreground mb-2 inline-flex items-center gap-3">
        <span className="bounce-cute">🎬</span>
        {title}
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

export default PageLayout;
