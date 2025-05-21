const PageLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    {children}
  </div>
);

export default PageLayout;
