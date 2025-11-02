import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Commission = () => {
  return (
    <div className="space-y-6 p-1">
      <Card>
        <CardHeader>
          <CardTitle>Data Komisi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Halaman komisi sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commission;
