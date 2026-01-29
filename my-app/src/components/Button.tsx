type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 active:bg-blue-700"
    >
      {children}
    </button>
  );
}
