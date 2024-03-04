interface TabHeaderProps {
  headerName: string;
}

export function TabHeader({ headerName }: TabHeaderProps) {
  return (
    <div className="tab-header-container">
      <div className="tab-header"></div>
      <span className="tab-header-text">{headerName}</span>
    </div>
  );
}
