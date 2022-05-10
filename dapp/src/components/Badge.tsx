interface BadgeProps {
  label: string;
  body: string;
}

const Badge = ({ label, body }: BadgeProps) => {
  return (
    <div className="flex flex-row items-center text-xs font-medium shadow-sm">
      <div className="bg-card px-1.5 py-1">{label}</div>
      <div className="bg-secondary text-white px-1.5 py-1">{body}</div>
    </div>
  );
};

export default Badge;
