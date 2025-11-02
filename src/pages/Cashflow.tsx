import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Cashflow = () => {
  return (
    <div className="space-y-6 p-1">
      <Card>
        <CardHeader>
          <CardTitle>Cashflow / Arus Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Halaman cashflow sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cashflow;
