export default function Button({ as: As = 'button', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border shadow-sm transition active:scale-[.99]';
  const styles = 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700';
  return (
    <As className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </As>
  );
}
