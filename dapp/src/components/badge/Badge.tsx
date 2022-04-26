interface IBadge {
  label: string;
  body: string;
}

const Badge = ({ label, body }: IBadge) => {
  return (
    <div className="flex flex-row items-center text-xs font-medium">
      <div className="bg-card px-1.5 py-1">{label}</div>
      <div className="bg-secondary text-white px-1.5 py-1">{body}</div>
    </div>
  );
};

export default Badge;
