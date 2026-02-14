import { useState, useEffect } from 'react';
import { MapPin, Filter, ExternalLink } from 'lucide-react';
import { useApp, BinCategory } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';

export function MapPage() {
  const { filteredBins, binFilters, toggleBinFilter } = useApp();
  const [selectedBin, setSelectedBin] = useState<string | null>(null);

  const getBinColor = (category: BinCategory) => {
    switch (category) {
      case 'recycle':
        return '#3b82f6'; // blue-500
      case 'compost':
        return '#22c55e'; // green-500
      case 'waste':
        return '#6b7280'; // gray-500
      default:
        return '#9ca3af';
    }
  };

  const getBinLabel = (category: BinCategory) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const filterOptions: { category: BinCategory; label: string; color: string }[] = [
    { category: 'waste', label: 'Waste', color: 'bg-gray-700' },
    { category: 'compost', label: 'Compost', color: 'bg-green-500' },
    { category: 'recycle', label: 'Recycle', color: 'bg-blue-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Disposal Bins</h1>
        <p className="text-gray-600">Locate the nearest waste, compost, and recycling bins</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <CardDescription>Show bins by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filterOptions.map((option) => (
                  <div key={option.category} className="flex items-center gap-3">
                    <Checkbox
                      id={option.category}
                      checked={binFilters.includes(option.category)}
                      onCheckedChange={() => toggleBinFilter(option.category)}
                    />
                    <label
                      htmlFor={option.category}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <div className={`w-4 h-4 rounded-full ${option.color}`} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 mb-2">Showing Results</div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredBins.length}
                  <span className="text-sm font-normal text-gray-500 ml-1">bins</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Bin Info */}
          {selectedBin && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Bin Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const bin = filteredBins.find(b => b.id === selectedBin);
                  if (!bin) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <Badge className={`text-white`} style={{ backgroundColor: getBinColor(bin.type) }}>
                          {getBinLabel(bin.type)}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Address</div>
                        <div className="text-sm font-medium text-gray-900">{bin.address}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Distance</div>
                        <div className="text-sm font-medium text-gray-900">
                          {bin.distance} mi away
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => openInGoogleMaps(bin.lat, bin.lng)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Google Maps
                      </Button>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Area - Static Map with Markers */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[600px] relative bg-gray-100">
                {/* Static Map Image Background */}
                <img
                  src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4194,37.7749,12,0/800x600@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                  alt="Map of San Francisco"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with bin markers */}
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {filteredBins.map((bin, index) => {
                      // Convert lat/lng to approximate pixel positions (simplified)
                      const x = ((bin.lng + 122.4312) / (122.4074 - 122.4312)) * 100;
                      const y = ((37.7889 - bin.lat) / (37.7889 - 37.7699)) * 100;
                      
                      return (
                        <g 
                          key={bin.id}
                          onClick={() => setSelectedBin(bin.id)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="16"
                            fill={getBinColor(bin.type)}
                            stroke="white"
                            strokeWidth="3"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                          />
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="white"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Bin List Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto">
                    <h3 className="font-semibold text-gray-900 mb-3">Nearby Bins</h3>
                    <div className="space-y-2">
                      {filteredBins.map((bin) => (
                        <div
                          key={bin.id}
                          onClick={() => setSelectedBin(bin.id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedBin === bin.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getBinColor(bin.type) }}
                                />
                                <span className="font-medium text-sm text-gray-900">
                                  {getBinLabel(bin.type)} Bin
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 truncate">{bin.address}</p>
                            </div>
                            <div className="text-xs text-gray-500 flex-shrink-0">
                              {bin.distance} mi
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Map Legend</div>
              <div className="flex items-center gap-6">
                {filterOptions.map((option) => (
                  <div key={option.category} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                    <span className="text-xs text-gray-600">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
