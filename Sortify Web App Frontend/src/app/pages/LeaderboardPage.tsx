import { Trophy, Medal, Crown, Globe, MapPin, Flag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export function LeaderboardPage() {
  const { user, leaderboardScope, setLeaderboardScope, leaderboardData } = useApp();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-medium">#{rank}</span>;
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'local':
        return <MapPin className="w-4 h-4" />;
      case 'national':
        return <Flag className="w-4 h-4" />;
      case 'worldwide':
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank among other eco-warriors</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* User Points Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Points</CardTitle>
            <CardDescription>Total points earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-1">
              {user?.points.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Keep scanning to earn more!</p>
          </CardContent>
        </Card>

        {/* User Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Rank</CardTitle>
            <CardDescription>Current position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              #{user?.rank}
            </div>
            <p className="text-sm text-gray-500">In {leaderboardScope} rankings</p>
          </CardContent>
        </Card>

        {/* Next Milestone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Milestone</CardTitle>
            <CardDescription>Points needed</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const currentRank = user?.rank || 999;
              const nextEntry = leaderboardData.find(e => e.rank === currentRank - 1);
              const pointsNeeded = nextEntry ? nextEntry.points - (user?.points || 0) : 0;
              
              return (
                <>
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {pointsNeeded > 0 ? pointsNeeded.toLocaleString() : '🎉'}
                  </div>
                  <p className="text-sm text-gray-500">
                    {pointsNeeded > 0 ? `To rank #${currentRank - 1}` : "You're at the top!"}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Scope Selector & Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Rankings
              </CardTitle>
              <CardDescription className="mt-1">
                Top performers by scope
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={leaderboardScope} onValueChange={(value) => setLeaderboardScope(value as any)}>
            <TabsList className="mb-6">
              <TabsTrigger value="local" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local
              </TabsTrigger>
              <TabsTrigger value="national" className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                National
              </TabsTrigger>
              <TabsTrigger value="worldwide" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Worldwide
              </TabsTrigger>
            </TabsList>

            <TabsContent value={leaderboardScope}>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry) => (
                      <TableRow
                        key={entry.rank}
                        className={entry.isCurrentUser ? 'bg-green-50 hover:bg-green-50' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={entry.isCurrentUser ? 'font-semibold text-green-700' : ''}>
                              {entry.username}
                            </span>
                            {entry.isCurrentUser && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.points.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Earn Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Scan and correctly dispose of items: <strong>+10 points</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Daily login streak bonus: <strong>+5 points</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Share sustainability tips: <strong>+15 points</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Complete weekly challenges: <strong>+50 points</strong></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Competition Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              Rankings are updated in real-time as users scan and dispose of items correctly.
            </p>
            <p>
              <strong>Local:</strong> Users within 50 miles
            </p>
            <p>
              <strong>National:</strong> Users in your country
            </p>
            <p>
              <strong>Worldwide:</strong> All Sortify users globally
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
