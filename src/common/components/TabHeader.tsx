interface TabHeaderProps {
  headerName: string;
}

export function TabHeader({ headerName }: TabHeaderProps) {
  return (
    <div className="tab-header-container">
      <div className="tab-header"></div>
      <span>{headerName}</span>
    </div>
  );
}
