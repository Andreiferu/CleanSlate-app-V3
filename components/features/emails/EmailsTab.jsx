import Button from '../../ui/Button';

export default function EmailsTab() {
  return (
    <div className="p-4 border rounded-xl bg-white">
      <h2 className="text-lg font-semibold mb-4">Emails</h2>
      <Button onClick={() => alert('Compose email')}>
        Compose Email
      </Button>
    </div>
  );
}
