import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StudentEnrollmentAdmin() {
  const [targetRollNumber, setTargetRollNumber] = useState('');
  const [targetName, setTargetName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_URL}/enrollment/admin/links`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/enrollment/admin/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRollNumber, targetName }),
      });
      if (res.ok) {
        const data = await res.json();
        const fullLink = `${window.location.origin}${data.link}`;
        setGeneratedLink(fullLink);
        fetchLinks();
        setTargetRollNumber('');
        setTargetName('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Student Enrollment</h1>
          <p className="text-muted-foreground mt-1">Generate one-time enrollment links for students.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Generator Form */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold mb-4">Generate Link</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Target Roll Number</Label>
                <Input 
                  id="rollNumber" 
                  value={targetRollNumber}
                  onChange={(e) => setTargetRollNumber(e.target.value)}
                  placeholder="e.g. 23CS012"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Target Name (Optional)</Label>
                <Input 
                  id="name" 
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="Student Name"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Link'}
              </Button>
            </form>

            {generatedLink && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Generated Link:</p>
                <div className="flex gap-2">
                  <Input readOnly value={generatedLink} className="bg-background" />
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedLink)}>
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* List of generated links */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold mb-4">Recent Links</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {links.length === 0 ? (
                <p className="text-sm text-muted-foreground">No links generated yet.</p>
              ) : (
                links.map((link) => (
                  <div key={link.id} className="p-3 border border-border rounded-lg flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{link.targetRollNumber}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        link.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                        link.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {link.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{window.location.origin}/enroll/{link.token}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
