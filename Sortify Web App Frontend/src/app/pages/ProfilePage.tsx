import { User, Trophy, TrendingUp, Calendar, Package } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';

export function ProfilePage() {
  const { user, scanHistory } = useApp();

  const getBinColor = (category: string) => {
    switch (category) {
      case 'recycle':
        return 'bg-blue-500';
      case 'compost':
        return 'bg-green-500';
      case 'waste':
        return 'bg-gray-700';
      default:
        return 'bg-gray-400';
    }
  };

  const getBinLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const totalScans = scanHistory.length;
  const totalPoints = user?.points || 0;
  const categoryStats = scanHistory.reduce((acc, scan) => {
    acc[scan.binCategory] = (acc[scan.binCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedCategory = Object.entries(categoryStats).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || 'None';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Your sustainability journey and achievements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-3xl">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.username}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                
                <div className="flex items-center gap-4 w-full justify-center mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Points</div>
                  </div>
                  
                  <Separator orientation="vertical" className="h-12" />
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      #{user?.rank}
                    </div>
                    <div className="text-xs text-gray-500">Rank</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Scans</div>
                    <div className="font-semibold text-gray-900">{totalScans}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Most Used</div>
                    <div className="font-semibold text-gray-900 capitalize">{mostUsedCategory}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Avg. Confidence</div>
                    <div className="font-semibold text-gray-900">
                      {totalScans > 0
                        ? Math.round(
                            scanHistory.reduce((sum, scan) => sum + scan.confidence, 0) /
                              totalScans
                          )
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-700">{category}</span>
                    <span className="font-medium text-gray-900">{count} scans</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getBinColor(category)}`}
                      style={{ width: `${(count / totalScans) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {totalScans === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No scans yet. Start scanning items!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Scan History */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Scan History
              </CardTitle>
              <CardDescription>
                Your complete scanning history with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {scanHistory.length > 0 ? (
                  <div className="space-y-4">
                    {scanHistory.map((scan) => (
                      <div
                        key={scan.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {scan.itemName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {formatDate(scan.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={`${getBinColor(scan.binCategory)} text-white`}>
                              {getBinLabel(scan.binCategory)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {scan.explanation}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Confidence:</span>
                              <span className="font-medium text-gray-900">
                                {scan.confidence}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-green-600" />
                              <span className="font-medium text-green-600">
                                +{scan.pointsEarned} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No scan history yet</p>
                    <p className="text-sm mt-1">Start scanning items to build your history!</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
